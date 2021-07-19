const Division = require('../models/division.model');

// Division controller that uses different functions on the database with the Division model structure

// Function used to check if a Division with a given ID exists
checkDivisionExistence = async (id) => {
    try {
        return await Division.exists({_id: id});
    } catch (err) {
        return false;
    }
}

// Function that reads all division documents
exports.findAll = async (req, res) => {
    try {
        const division = await Division.find();
        res.send(division);
    } catch (err) {
        console.log(err);
        res.status(500).send({message: 'Some error occurred while retrieving the divisions.'});
    }
}

// Function that reads a specific Division by its id
exports.findById = async (req, res) => {
    try {
        const division = await Division.findById(req.params.id);
        res.send(division);
    } catch (err) {
        console.log(err);
        res.status(500).send({message: 'Some error occurred while retrieving the division.'});
    }
}

// Function that creates a new division document
exports.create = async (req, res) => {
    const newDivision = new Division({
        name: req.body.name
    });

    try {
        await newDivision.save();
        res.send({message: 'added'});
    } catch (err) {
        console.log(err);
        res.status(500).send({message: 'Some error occurred while creating the division.'});
    }
}

// Function that adds a new credential to a division document
exports.addCredentials = async (req, res) => {
    const divisionExists = await checkDivisionExistence(req.params.id);
    if (divisionExists) {
        try {
            await Division.findOneAndUpdate(
                {_id: req.params.id},
                {
                    $addToSet: {
                        credentials: {
                            name: req.body.name,
                            login: req.body.login,
                            password: req.body.password
                        }
                    }
                });
            res.send({message: 'Credentials added.'});
        } catch (err) {
            console.log(err);
            res.status(500).send({message: 'Some error occurred while updating the division.'});
        }
    } else {
        res.status(500).send({message: `Division doesn't exist in the database.`});
    }
}

// Function that updates a credential entry of a division document
exports.updateCredentials = async (req, res) => {
    const divisionExists = await checkDivisionExistence(req.params.id);
    if (divisionExists) {
        let newName = req.body.newName;
        if (!req.body.newName)
            newName = req.body.name;


        let newLogin = req.body.newLogin;
        if (!req.body.newLogin)
            newLogin = req.body.login;

        let newPassword = req.body.newPassword;
        if (!req.body.newPassword)
            newPassword = req.body.password;

        try {
            await Division.findOneAndUpdate(
                {
                    _id: req.params.id,
                    'credentials.name': req.body.name,
                    'credentials.login': req.body.login,
                    'credentials.password': req.body.password
                    },
                {
                    $set: {
                        'credentials.$.name': newName,
                        'credentials.$.login': newLogin,
                        'credentials.$.password': newPassword
                    }
                }
            );
            res.send({message: 'Credentials updated.'});
        } catch (err) {
            console.log(err);
            res.status(500).send({message: 'Some error occurred while updating the division.'});
        }
    } else {
        res.status(500).send({message: `Division doesn't exist in the database.`});
    }
}