const express = require('express');
const opportunityController = require('../controllers/opportunity.controller');
const { verifyAccess, requireRole } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validation.middleware');
const {
  opportunityValidators,
  paginationValidators,
  uuidValidator,
} = require('../utils/validators');

const router = express.Router();

// Public routes
router.get('/public/opportunities', paginationValidators, validate, opportunityController.listOpportunities);

// Protected routes
router.get('/opportunities', verifyAccess, paginationValidators, validate, opportunityController.listOpportunities);
router.get('/opportunities/:id', verifyAccess, uuidValidator, validate, opportunityController.getOpportunity);

// Admin only routes
router.post('/opportunities', verifyAccess, requireRole('admin'), opportunityValidators.create, validate, opportunityController.createOpportunity);
router.put('/opportunities/:id', verifyAccess, requireRole('admin'), uuidValidator, opportunityValidators.update, validate, opportunityController.updateOpportunity);
router.delete('/opportunities/:id', verifyAccess, requireRole('admin'), uuidValidator, validate, opportunityController.deleteOpportunity);

module.exports = router;
