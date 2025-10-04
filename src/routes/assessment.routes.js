const express = require('express');
const assessmentController = require('../controllers/assessment.controller');
const { verifyAccess } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validation.middleware');
const {
  assessmentValidators,
  paginationValidators,
  uuidValidator,
} = require('../utils/validators');

const router = express.Router();

router.get('/assessments', verifyAccess, paginationValidators, validate, assessmentController.getAssessments);
router.post('/assessments', verifyAccess, assessmentValidators.create, validate, assessmentController.createAssessment);
router.get('/assessments/:id', verifyAccess, uuidValidator, validate, assessmentController.getAssessment);
router.put('/assessments/:id', verifyAccess, uuidValidator, validate, assessmentController.updateAssessment);

module.exports = router;
