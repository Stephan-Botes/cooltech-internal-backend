const validationController = require('../controllers/validation.controller');
const userController = require('../controllers/user.controller');
const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

// Register endpoint - adds a new user to the database
exports.register = async (req, res) => {
    // Validates entered information
    const {error} = validationController.userRegisterValidation(req.body);
    if(error)
        res.status(400).send({message: error.details[0].message});

    // Generate user
    await userController.create(req, res) // If no error, create the user
}

// Login endpoint - logs an existing user in with a jwt
exports.login = async (req, res) => {
    // Validates entered information
    const {error} = validationController.userLoginValidation(req.body);
    if (error)
        res.status(400).send({message: error.details[0].message});

    // Validate user exists
    const foundUser = await User.findOne({email: req.body.email});
    if (!foundUser)
        return res.status(403).send({message: 'Incorrect login information'});

    // Validate passwords match
    const validPassword = await bcrypt.compare(req.body.password, foundUser.password);
    if (!validPassword)
        return res.status(403).send({message: 'Incorrect login information.'});

    // Assign JWT
    payload = {
        'id': foundUser._id,
        'email': foundUser.email,
        'firstname': foundUser.firstname,
        'lastname': foundUser.lastname,
        'role': foundUser.role,
        'ou': foundUser.ou
    }
    const token = jwt.sign(JSON.stringify(payload), process.env.TOKEN_SECRET,{algorithm: 'HS256'});
    res.header('auth-token', token).header('Access-Control-Expose-Headers', '*').send(payload);
}

// Verify a user's JWT token
exports.verifyUser = (req, res, next) => {
    // Check for aut-token in header
    const token = req.header('auth-token');
    if (!token)
        return res.status(401).send({message: `Access denied.`});

    // Verifies token in header with the server TOKEN_SECRET
    try {
        const verifiedUser = jwt.verify(token, process.env.TOKEN_SECRET,);
        if (verifiedUser.role === 'admin' || verifiedUser.role === 'manager' || verifiedUser.role === 'user') {
            req.user = verifiedUser;
            next();
        } else
            res.status(403).send({message: `You do not have the access level.`});
    } catch (err) {
        res.status(400).send({message: `Invalid token.`});
    }
}

// Verify a manager's JWT token
exports.verifyManager = (req, res, next) => {
    // Check for aut-token in header
    const token = req.header('auth-token');
    if (!token)
        return res.status(401).send({message: `Access denied.`});

    // Verifies token in header with the server TOKEN_SECRET
    try {
        const verifiedUser = jwt.verify(token, process.env.TOKEN_SECRET,);
        if (verifiedUser.role === 'admin' || verifiedUser.role === 'manager') {
            req.user = verifiedUser;
            next();
        } else
            res.status(403).send({message: `You do not have the access level.`});
    } catch (err) {
        res.status(400).send({message: `Invalid token.`});
    }
}

// Verify a admin's JWT token
exports.verifyAdmin = (req, res, next) => {
    // Check for aut-token in header
    const token = req.header('auth-token');
    if (!token)
        return res.status(401).send({message: `Access denied.`});

    // Verifies token in header with the server TOKEN_SECRET
    try {
        const verifiedUser = jwt.verify(token, process.env.TOKEN_SECRET,);
        if (verifiedUser.role === 'admin') {
            req.user = verifiedUser;
            next();
        } else
            res.status(403).send({message: `You do not have the access level.`});
    } catch (err) {
        res.status(400).send({message: `Invalid token.`});
    }
}
