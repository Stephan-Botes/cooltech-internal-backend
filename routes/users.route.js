const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const {verifyUser, verifyManager, verifyAdmin} = require('../controllers/authentication.controller');

// Finds all users endpoint
// router.get('/find/all', verifyUser, userController.findAll);
router.get('/find/all', userController.findAll);

// Create user endpoint
router.post('/create', verifyManager ,userController.create);

// Add division endpoint - adds a division, under a ou to a user by id
router.post('/add/division', verifyAdmin, userController.addDivisionByEmail);

router.patch('/remove/division', verifyAdmin, userController.removeDivisionByEmail);

// Update user details endpoint
router.patch('/update/details', verifyAdmin, userController.updateUserDetails);

// Update user role endpoint
router.patch('/update/role', verifyAdmin, userController.updateUserRole);

module.exports = router;
