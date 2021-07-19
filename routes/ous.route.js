const express = require('express');
const router = express.Router();
const ouController = require('../controllers/ou.controller');
const userController = require('../controllers/user.controller');
const {verifyUser, verifyManager, verifyAdmin} = require('../controllers/authentication.controller');

// GET Route - finds all the ous
router.get('/find/all', verifyUser, ouController.findAll);

// GET Route - finds a specific ou by id
router.get('/find/:id', ouController.findById);

// POST Route - creates a new ou
router.post('/create', ouController.create);

// POST Route - adds a division to a ou by its id
router.post('/add/division/:id', verifyUser, ouController.addDivision);

// Add a user to a division under a specific ou
router.post('/add/user', userController.addDivisionByEmail);

module.exports = router;
