# Allumino HTW MVP - Full Stack Setup Guide

## 🎯 Hackathon Submission - Complete Setup Instructions

This is a full-stack STEM talent detection platform with AI/ML capabilities.

## 🏗️ Architecture

- **Frontend**: React + TailwindCSS (Vite)
- **Backend**: Node.js + Express + Auth0 + PostgreSQL + MongoDB
- **ML Service**: Python Flask + PyTorch + XGBoost (91.94% accuracy)

---

## 📋 Prerequisites

- Node.js 16+ and npm
- Python 3.11+
- PostgreSQL database
- MongoDB database (optional for production features)

---

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/Beyonder0CRt/Allumino-HTW-MVP.git
cd Allumino-HTW-MVP
```

### 2. Backend Setup

```bash
# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your database credentials and Auth0 settings

# Run database migrations
npx prisma migrate dev

# Start backend server
npm run dev
```

Backend will run on **http://localhost:3000**

### 3. Frontend Setup

```bash
cd frontend-app

# Install dependencies
npm install

# Start frontend dev server
npm run dev
```

Frontend will run on **http://localhost:5173**

### 4. ML Service Setup

```bash
cd ml-service

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Train the model
python train_multimodal_model.py

# Start ML service
python app_multimodal.py
```

ML Service will run on **http://localhost:5001**

---

## 🔑 Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/allumino"
MONGODB_URI="mongodb://localhost:27017/allumino"

# Auth0
AUTH0_DOMAIN="your-domain.auth0.com"
AUTH0_AUDIENCE="your-api-audience"

# Server
PORT=3000
NODE_ENV=development

# ML Service
ML_SERVICE_URL="http://localhost:5001"
```

---

## 🧪 Testing the Application

### 1. Test Backend API

```bash
# Health check
curl http://localhost:3000/health

# ML service health
curl http://localhost:3000/api/ml/health
```

### 2. Test ML Prediction

```bash
curl -X POST http://localhost:5001/predict \
  -H "Content-Type: application/json" \
  -d '{
    "math_score": 85,
    "science_score": 90,
    "project_score": 80,
    "gender": "Female",
    "socioeconomic_index": 0.7
  }'
```

### 3. Test Frontend

Open http://localhost:5173 in your browser

You can also use the ML test interface:
- Open `ml-service/test.html` in a browser

---

## 🎨 Features

### Backend API
- ✅ User authentication (Auth0)
- ✅ PostgreSQL database with Prisma ORM
- ✅ RESTful API endpoints
- ✅ ML model integration
- ✅ Batch prediction support

### Frontend
- ✅ Modern React UI with TailwindCSS
- ✅ Responsive design
- ✅ Landing page with hero sections
- ✅ Interactive components

### ML Model
- ✅ Multi-modal architecture (Text + Numeric + Behavioral)
- ✅ 91.94% accuracy
- ✅ Real-time STEM talent prediction
- ✅ Adaptive recommendations
- ✅ Confidence scoring

---

## 📁 Project Structure

```
Allumino-HTW-MVP/
├── src/                      # Backend source code
│   ├── routes/              # API routes
│   ├── controllers/         # Business logic
│   ├── services/            # Service layer (ML integration)
│   └── middlewares/         # Auth & validation
├── frontend-app/            # React frontend
│   ├── src/
│   │   ├── App.jsx         # Landing page
│   │   └── main.jsx
│   └── public/
├── ml-service/              # Python ML service
│   ├── app_multimodal.py   # Flask API
│   ├── multimodal_model.py # Model architecture
│   └── train_multimodal_model.py
├── prisma/                  # Database schema
├── tests/                   # Test suites
└── package.json
```

---

## 🔧 Troubleshooting

### Backend won't start
- Check DATABASE_URL is correct
- Run `npx prisma generate`
- Ensure PostgreSQL is running

### Frontend build errors
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again

### ML Service errors
- Ensure Python 3.11+ is installed
- Train the model first: `python train_multimodal_model.py`
- Check all dependencies are installed

### Port conflicts
- Backend: Change PORT in `.env`
- Frontend: Change port in `vite.config.js`
- ML Service: Change port in `app_multimodal.py`

---

## 📊 ML Model Details

### Architecture
- **Text Encoder**: sentence-transformers/all-MiniLM-L6-v2 (384-dim)
- **Numeric Projector**: MLP (5 → 128 → 64)
- **Behavior Encoder**: GRU (32-dim input, 64-dim hidden)
- **Classifier**: XGBoost (100 estimators)

### Performance
- **Accuracy**: 91.94%
- **Precision**: 94% (High Potential)
- **Recall**: 90% (High Potential)

### Features Used
- Math score
- Science score
- Project score
- Gender (encoded)
- Socioeconomic index
- Generated text descriptions

---

## 🚢 Deployment

### Backend (Railway/Render/Vercel)
1. Set environment variables
2. Run migrations: `npx prisma migrate deploy`
3. Build: `npm run build`
4. Start: `npm start`

### Frontend (Vercel/Netlify)
1. Build: `npm run build`
2. Deploy `dist/` folder

### ML Service (Railway/Render)
1. Set Python buildpack
2. Install requirements
3. Train model (or upload pre-trained .pkl files)
4. Start: `python app_multimodal.py`

---

## 📝 API Endpoints

### Backend
- `GET /health` - Health check
- `POST /api/auth/login` - User login
- `POST /api/ml/predict` - Single prediction
- `POST /api/ml/batch-predict` - Batch predictions
- `GET /api/ml/health` - ML service status

### ML Service
- `GET /health` - Service health
- `POST /predict` - STEM potential prediction
- `POST /batch-predict` - Batch predictions

---

## 👥 Team

Allumino HTW MVP - Hackathon Submission

---

## 📄 License

See LICENSE file

---

## 🆘 Support

For issues during hackathon judging, contact the team or check:
- GitHub Issues
- API Documentation: `API_EXAMPLES.md`
- Deployment Guide: `DEPLOYMENT.md`
