const Joi = require('joi');

const registerUserSchema = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    dietaryRestrictions: Joi.string()
});

module.exports = { registerUserSchema };
