const express = require('express');
const userController = require('../controllers/user.controller');
const { verifyAccess } = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/me', verifyAccess, userController.getMe);
router.put('/me', verifyAccess, userController.updateMe);

module.exports = router;
