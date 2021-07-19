const Ou = require('../models/ou.model');
const Division = require('../models/division.model');

// Ou controller that uses different functions on the database with the Ou model structure

// Function that reads all Ou documents
exports.findAll = async (req, res) => {
    try {
        const ou = await Ou.find();
        res.send(ou);
    } catch (err) {
        console.log(err);
        res.status(500).send({message: 'Some error occurred while retrieving the Ous.'});
    }
}

// Function that reads a specific Ou by its id
exports.findById = async (req, res) => {
    try {
        const ou = await Ou.findById(req.params.id);
        res.send(ou);
    } catch (err) {
        console.log(err);
        res.status(500).send({message: 'Some error occurred while retrieving the Ou.'});
    }
}

// Function that creates a new Ou document
exports.create = async (req, res) => {
    const newOu = new Ou({
        name: req.body.name
    });

    try {
        await newOu.save();
        res.send({message: 'added'});
    } catch (err) {
        console.log(err);
        res.status(500).send({message: 'Some error occurred while creating the Ou.'});
    }
}

// Function that adds a new division to a Ou document
exports.addDivision = async (req, res) => {
    const ouExists = await checkOuExistence(req.params.id);
    if (ouExists) {
        const divisionExists = await checkDivisionExistence(req.body.division_id);
        if (divisionExists) {
            try {
                await Ou.findOneAndUpdate(
                    {_id: req.params.id},
                    {
                        $addToSet: {
                            divisions: {
                                division_id: req.body.division_id
                            }
                        }
                    });
                res.send({message: 'Division added.'});
            } catch (err) {
                console.log(err);
                res.status(500).send({message: 'Some error occurred while updating the Ou.'});
            }
        } else {
            res.status(500).send({message: `Division doesn't exist in the database.`});
        }
    } else {
        res.status(500).send({message: `Ou doesn't exist in the database.`});
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