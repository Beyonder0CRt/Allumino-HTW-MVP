const express = require('express');
const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const pathwayRoutes = require('./pathway.routes');
const assessmentRoutes = require('./assessment.routes');
const opportunityRoutes = require('./opportunity.routes');
const healthRoutes = require('./health.routes');
const mlRoutes = require('./ml.routes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/', healthRoutes);
router.use('/', userRoutes);
router.use('/', pathwayRoutes);
router.use('/', assessmentRoutes);
router.use('/', opportunityRoutes);
router.use('/ml', mlRoutes);

module.exports = router;
