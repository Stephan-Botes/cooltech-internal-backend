const express = require('express');
const router = express.Router();
const divisionController = require('../controllers/division.controller');
const {verifyUser, verifyManager, verifyAdmin} = require('../controllers/authentication.controller');

// GET Route - finds all the division
router.get('/find/all', verifyUser, divisionController.findAll);

// * GET Route - finds a specific ou
router.get('/find/:id', verifyUser, divisionController.findById);

// POST Route - creates a new division
router.post('/create', verifyAdmin, divisionController.create);

// * POST Route - adds a credential to a division by its id
router.post('/add/credentials/:id', verifyUser, divisionController.addCredentials);

// * POST Route - updates a credential to a division by its id
router.patch('/update/credentials/:id', verifyManager, divisionController.updateCredentials);


module.exports = router;
