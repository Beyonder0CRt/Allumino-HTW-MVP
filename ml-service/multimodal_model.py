import torch
import torch.nn as nn
from transformers import AutoTokenizer, AutoModel
import numpy as np

# --- CONFIG ---
TEXT_MODEL = "sentence-transformers/all-MiniLM-L6-v2"
TEXT_EMBED_DIM = 384
NUMERIC_INPUT_DIM = 5  # math_score, science_score, project_score, gender_encoded, socioeconomic_index
NUM_PROJ_DIM = 64
BEHAVIOR_INPUT_DIM = 32
GRU_HIDDEN = 64


class TextEncoder(nn.Module):
    """Encodes text descriptions into embeddings using a pre-trained transformer model"""

    def __init__(self):
        super().__init__()
        self.model = AutoModel.from_pretrained(TEXT_MODEL)
        self.tokenizer = AutoTokenizer.from_pretrained(TEXT_MODEL)

    def forward(self, text_list):
        """
        Args:
            text_list: List of text strings
        Returns:
            Tensor of shape (batch_size, TEXT_EMBED_DIM)
        """
        inputs = self.tokenizer(
            text_list,
            padding=True,
            truncation=True,
            return_tensors='pt',
            max_length=128
        )

        with torch.no_grad():
            out = self.model(**inputs)

        # Return CLS token embedding
        return out.last_hidden_state[:, 0, :]


class NumericProjector(nn.Module):
    """Projects numeric features (scores, demographics) into a latent space"""

    def __init__(self, input_dim=NUMERIC_INPUT_DIM, output_dim=NUM_PROJ_DIM):
        super().__init__()
        self.mlp = nn.Sequential(
            nn.Linear(input_dim, 128),
            nn.ReLU(),
            nn.Dropout(0.2),
            nn.Linear(128, output_dim)
        )

    def forward(self, x):
        """
        Args:
            x: Tensor of shape (batch_size, input_dim)
        Returns:
            Tensor of shape (batch_size, output_dim)
        """
        return self.mlp(x)


class BehaviorEncoder(nn.Module):
    """Encodes sequential behavioral data (e.g., activity logs, engagement patterns)"""

    def __init__(self, input_dim=BEHAVIOR_INPUT_DIM, hidden_dim=GRU_HIDDEN):
        super().__init__()
        self.gru = nn.GRU(input_dim, hidden_dim, batch_first=True, dropout=0.2)

    def forward(self, seq):
        """
        Args:
            seq: Tensor of shape (batch_size, seq_len, input_dim)
        Returns:
            Tensor of shape (batch_size, hidden_dim)
        """
        _, h = self.gru(seq)
        return h.squeeze(0)


class MultiModalTalentModel:
    """
    Combines text, numeric, and behavioral features for talent detection.
    Uses separate encoders for each modality and fuses them for final prediction.
    """

    def __init__(self):
        self.text_encoder = TextEncoder()
        self.num_projector = NumericProjector()
        self.beh_encoder = BehaviorEncoder()
        self.xgb_model = None

        # Set encoders to eval mode
        self.text_encoder.eval()
        self.num_projector.eval()
        self.beh_encoder.eval()

    def encode_features(self, text_data, num_data, beh_data=None):
        """
        Encode all modalities and fuse them into a single embedding.

        Args:
            text_data: List of text strings
            num_data: NumPy array of shape (n_samples, NUMERIC_INPUT_DIM)
            beh_data: NumPy array of shape (n_samples, seq_len, BEHAVIOR_INPUT_DIM) or None

        Returns:
            NumPy array of fused embeddings
        """
        # Encode text
        text_emb = self.text_encoder(text_data)

        # Encode numeric
        num_tensor = torch.FloatTensor(num_data)
        num_proj = self.num_projector(num_tensor)

        # Encode behavior (if provided)
        if beh_data is not None:
            beh_tensor = torch.FloatTensor(beh_data)
            beh_emb = self.beh_encoder(beh_tensor)
            fused_emb = torch.cat([text_emb, num_proj, beh_emb], dim=1)
        else:
            # If no behavioral data, just concatenate text and numeric
            fused_emb = torch.cat([text_emb, num_proj], dim=1)

        return fused_emb.detach().numpy()

    def get_fused_dim(self):
        """Get the dimension of the fused embedding"""
        if hasattr(self, '_fused_dim'):
            return self._fused_dim
        # Default dimension (text + numeric, no behavior)
        return TEXT_EMBED_DIM + NUM_PROJ_DIM

    def set_xgb_model(self, model):
        """Set the trained XGBoost model"""
        self.xgb_model = model

    def predict(self, text_data, num_data, beh_data=None):
        """
        Make predictions using the full pipeline.

        Args:
            text_data: List of text strings
            num_data: NumPy array of numeric features
            beh_data: NumPy array of behavioral features or None

        Returns:
            Predictions and probabilities from XGBoost
        """
        if self.xgb_model is None:
            raise ValueError("XGBoost model not set. Train the model first.")

        # Get fused embeddings
        fused_emb = self.encode_features(text_data, num_data, beh_data)

        # Predict
        predictions = self.xgb_model.predict(fused_emb)
        probabilities = self.xgb_model.predict_proba(fused_emb)

        return predictions, probabilities
