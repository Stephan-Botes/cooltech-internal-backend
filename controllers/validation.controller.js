const Joi = require('@hapi/joi');

// Validates registration details
exports.userRegisterValidation = (data) => {
    const registerValidationSchema = Joi.object({
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required(),
        firstname: Joi.string().min(1).required(),
        lastname: Joi.string().min(1).required(),
        role: Joi.string().min(4)
    });
    return registerValidationSchema.validate(data);
}

// Validates login details
exports.userLoginValidation = (data) => {
    const loginValidationSchema = Joi.object({
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required()
    });
    return loginValidationSchema.validate(data);
}