const express = require('express');
const authController = require('../controllers/auth.controller');

const router = express.Router();

router.get('/login', authController.login);
router.get('/callback', authController.callback);
router.post('/logout', authController.logout);

module.exports = router;
