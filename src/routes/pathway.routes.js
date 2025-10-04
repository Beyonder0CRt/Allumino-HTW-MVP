const express = require('express');
const pathwayController = require('../controllers/pathway.controller');
const { verifyAccess } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validation.middleware');
const {
  pathwayValidators,
  paginationValidators,
  uuidValidator,
} = require('../utils/validators');

const router = express.Router();

// Public routes
router.get('/public/pathways', paginationValidators, validate, pathwayController.listPublicPathways);

// Protected routes
router.get('/pathways', verifyAccess, paginationValidators, validate, pathwayController.getPathways);
router.post('/pathways', verifyAccess, pathwayValidators.create, validate, pathwayController.createPathway);
router.get('/pathways/:id', verifyAccess, uuidValidator, validate, pathwayController.getPathway);
router.put('/pathways/:id', verifyAccess, uuidValidator, pathwayValidators.update, validate, pathwayController.updatePathway);
router.delete('/pathways/:id', verifyAccess, uuidValidator, validate, pathwayController.deletePathway);

module.exports = router;
