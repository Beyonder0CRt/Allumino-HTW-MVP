const express = require('express');
const router = express.Router();
const { verifyAccess } = require('../middlewares/auth.middleware');
const mlService = require('../services/mlService');

// Use verifyAccess as authenticate
const authenticate = verifyAccess;

/**
 * @route   POST /api/ml/predict
 * @desc    Predict STEM potential for a student
 * @access  Private
 */
router.post('/predict', authenticate, async (req, res) => {
  try {
    const { mathScore, scienceScore, projectScore, gender, socioeconomicIndex } = req.body;

    // Validate input
    if (
      mathScore === undefined ||
      scienceScore === undefined ||
      projectScore === undefined ||
      !gender ||
      socioeconomicIndex === undefined
    ) {
      return res.status(400).json({
        error: 'Missing required fields: mathScore, scienceScore, projectScore, gender, socioeconomicIndex',
      });
    }

    const prediction = await mlService.predictSTEMPotential({
      mathScore,
      scienceScore,
      projectScore,
      gender,
      socioeconomicIndex,
    });

    res.json(prediction);
  } catch (error) {
    console.error('Error in ML prediction route:', error);
    res.status(500).json({
      error: 'Failed to generate prediction',
      message: error.message,
    });
  }
});

/**
 * @route   POST /api/ml/batch-predict
 * @desc    Batch predict STEM potential for multiple students
 * @access  Private
 */
router.post('/batch-predict', authenticate, async (req, res) => {
  try {
    const { students } = req.body;

    if (!students || !Array.isArray(students) || students.length === 0) {
      return res.status(400).json({
        error: 'students array is required and must not be empty',
      });
    }

    const predictions = await mlService.batchPredictSTEMPotential(students);

    res.json(predictions);
  } catch (error) {
    console.error('Error in ML batch prediction route:', error);
    res.status(500).json({
      error: 'Failed to generate batch predictions',
      message: error.message,
    });
  }
});

/**
 * @route   GET /api/ml/health
 * @desc    Check ML service health
 * @access  Public
 */
router.get('/health', async (req, res) => {
  try {
    const health = await mlService.checkHealth();
    res.json(health);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to check ML service health',
      message: error.message,
    });
  }
});

module.exports = router;
