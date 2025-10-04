const { body, query, param } = require('express-validator');

const pathwayValidators = {
  create: [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').optional().trim(),
    body('metadata').optional().isObject(),
  ],
  update: [
    body('title').optional().trim().notEmpty(),
    body('description').optional().trim(),
    body('metadata').optional().isObject(),
  ],
};

const assessmentValidators = {
  create: [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('type').trim().notEmpty().withMessage('Type is required'),
    body('pathwayId').optional().isUUID(),
    body('score').optional().isDecimal(),
    body('rawData').optional().isObject(),
    body('metadata').optional().isObject(),
  ],
};

const opportunityValidators = {
  create: [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').optional().trim(),
    body('location').optional().trim(),
    body('tags').optional().isArray(),
  ],
  update: [
    body('title').optional().trim().notEmpty(),
    body('description').optional().trim(),
    body('location').optional().trim(),
    body('tags').optional().isArray(),
  ],
};

const paginationValidators = [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
];

const uuidValidator = [param('id').isUUID().withMessage('Invalid ID format')];

module.exports = {
  pathwayValidators,
  assessmentValidators,
  opportunityValidators,
  paginationValidators,
  uuidValidator,
};
