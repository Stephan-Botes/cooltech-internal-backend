const User = require('../models/user.model');
const Ou = require('../models/ou.model');
const Division = require('../models/division.model');
const bcrypt = require('bcrypt');

// User controller that uses different functions on the database with the User model structure

// Function that reads all user documents
exports.findAll = async (req, res) => {
    try {
        const users = await User.find();
        res.send(users);
    } catch (err) {
        console.log(err);
        res.status(500).send({message: 'Some error occurred while retrieving the users.'});
    }
}

// Function that creates a new user document
exports.create = async (req, res) => {
    // Hashes password
    const hashedPassword = await generateHash(req.body.password);

    // Create user with given details
    const newUser = new User({
        email: req.body.email,
        password: hashedPassword,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        role: req.body.role
    });

    // Check if user already exists in database
    const foundUser = await User.findOne({email: req.body.email});
    if (foundUser)
        return res.status(400).send({message: `That user already exists in the database.`})

    // Create user
    try {
        await newUser.save();
        res.send({message: 'added'});
    } catch (err) {
        console.log(err);
        res.status(500).send({message: 'Some error occurred while creating the user.'});
    }
}

// Function that adds a new Division under a Ou  to a User document
exports.addDivision = async (req, res) => {
    const userExists = await checkUserExistence(req.params.id);
    if (userExists) {
        const ouExists = await checkOuExistence(req.body.ou_id);
        if (ouExists) {
            const divisionExists = await checkDivisionExistence(req.body.division_id);
            if (divisionExists) {
                try {
                    await User.findOneAndUpdate(
                        {_id: req.params.id},
                        {
                            $addToSet: {
                                ou: {
                                    ou_id: req.body.ou_id,
                                    division_id: req.body.division_id,
                                    role: req.body.role
                                }
                            }
                        });
                    res.send({message: 'division added'});
                } catch (err) {
                    console.log(err);
                    res.status(500).send({message: 'Some error occurred while updating the User.'});
                }
            } else {
                res.status(500).send({message: `Division doesn't exist in the database.`});
            }
        } else {
            res.status(500).send({message: `Ou doesn't exist in the database.`});
        }
    } else {
        res.status(500).send({message: `User doesn't exist in the database.`});
    }
}

// Function that adds a division under a user with their email
exports.addDivisionByEmail = async (req, res) => {
    const userExists = await User.findOne({email: req.body.email});
    if (!userExists)
        res.status(500).send({message: `User doesn't exist in the database.`});

    const ouExists = await checkOuExistence(req.body.ou_id);
    if (!ouExists)
        res.status(500).send({message: `Ou doesn't exist in the database.`});

    const divisionExists = await checkDivisionExistence(req.body.division_id);
    if (!divisionExists)
        res.status(500).send({message: `Division doesn't exist in the database.`});

    try {
        await User.findOneAndUpdate(
            {email: req.body.email},
            {
                $addToSet: {
                    ou: {
                        ou_id: req.body.ou_id,
                        division_id: req.body.division_id
                    }
                }
            });
        res.send({message: `User assigned to division.`});
    } catch (err) {
        console.log(err);
        res.status(500).send({message: `Some error occurred while updating the User.`});
    }
}

// Function that removes a division under a user with their email
exports.removeDivisionByEmail = async (req, res) => {
    const userExists = await User.findOne({email: req.body.email});
    if (!userExists)
        res.status(500).send({message: `User doesn't exist in the database.`});

    const ouExists = await checkOuExistence(req.body.ou_id);
    if (!ouExists)
        res.status(500).send({message: `Ou doesn't exist in the database.`});

    const divisionExists = await checkDivisionExistence(req.body.division_id);
    if (!divisionExists)
        res.status(500).send({message: `Division doesn't exist in the database.`});

    try {
        await User.findOneAndUpdate(
            {email: req.body.email},
            {
                $pull: {
                    ou: {
                        ou_id: req.body.ou_id,
                        division_id: req.body.division_id
                    }
                }
            });
        res.send({message: `User removed from division.`});
    } catch (err) {
        console.log(err);
        res.status(500).send({message: `Some error occurred while removing the User.`});
    }
}

// Function used to update an existing users details
exports.updateUserDetails = async (req, res) => {
    console.log(req.body)
    const userExists = await checkUserExistence(req.body.id);
    if (!userExists)
        res.status(500).send({message: `User doesn't exist in the database.`});

    let newEmail = req.body.newEmail;
    if (!req.body.newEmail)
        newEmail = req.body.email;

    let newPassword = req.body.newPassword;
    let hashedPassword;
    if (newPassword) {
        // Hashes password
        hashedPassword = await generateHash(newPassword);
    } else
        hashedPassword = req.body.password;

    let newFirstname = req.body.newFirstname;
    if (!req.body.newFirstname)
        newFirstname = req.body.firstname;

    let newLastname = req.body.newLastname;
    if (!req.body.newLastname)
        newLastname = req.body.lastname;

    try {
        await User.findOneAndUpdate(
            {_id: req.body.id},
            {
                $set: {
                    email: newEmail,
                    password: hashedPassword,
                    firstname: newFirstname,
                    lastname: newLastname
                }
            }
        );
        res.send({message: 'User details updated.'});
    } catch (err) {
        console.log(err);
        res.status(500).send({message: 'Some error occurred while updating the user.'});
    }
}

// Function used to update an existing users role
exports.updateUserRole = async (req, res) => {
    const userExists = await checkUserExistence(req.body.id);
    if (!userExists)
        res.status(500).send({message: `User doesn't exist in the database.`});

    let newRole = req.body.newRole;
    if (!req.body.newRole)
        newRole = req.body.role;

    try {
        await User.findOneAndUpdate(
            {_id: req.body.id},
            {
                $set: {
                    role: newRole
                }
            }
        );
        res.send({message: 'User role updated.'});
    } catch (err) {
        console.log(err);
        res.status(500).send({message: 'Some error occurred while updating the role.'});
    }
}

// Function used to check if a User with a given ID exists
checkUserExistence = async (id) => {
    try {
        return await User.exists({_id: id});
    } catch (err) {
        return false;
    }
}

// Function used to check if a OU with a given ID exists
checkOuExistence = async (id) => {
    try {
        return await Ou.exists({_id: id});
    } catch (err) {
        return false;
    }
}

// Function used to check if a Division with a given ID exists
checkDivisionExistence = async (id) => {
    try {
        return await Division.exists({_id: id});
    } catch (err) {
        return false;
    }
}

// Function that generates a hashed password for the given input
generateHash = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}