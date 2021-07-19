const express = require('express');
const router = express.Router();
const authenticationController = require('../controllers/authentication.controller');

// Register endpoint - adds a new user to the database
router.post('/register', authenticationController.register);

// Login endpoint - logs an existing user in with a jwt
router.post('/login', authenticationController.login);

module.exports = router;
