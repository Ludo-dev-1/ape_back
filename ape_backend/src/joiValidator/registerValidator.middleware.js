import Joi from "joi";
import { validate } from "./validate.middleware.js";

export const registerValidatorSchema = Joi.object({
    firstname: Joi.string()
        .min(2)
        .max(64)
        .pattern(/^[A-Za-zÀ-ÖØ-öø-ÿ-' ]+$/)
        .required(),

    lastname: Joi.string()
        .min(2)
        .max(64)
        .pattern(/^[A-Za-zÀ-ÖØ-öø-ÿ-' ]+$/)
        .required(),

    email: Joi.string()
        .email()
        .required(),

    password: Joi.string()
        .min(8)
        .pattern(/(?=.*[a-z])/)
        .pattern(/(?=.*[A-Z])/)
        .pattern(/(?=.*[0-9])/)
        .pattern(/(?=.*[!@#$%^&*])/)
        .required(),

    repeat_password: Joi.string()
        .valid(Joi.ref("password"))
        .required()
        .messages({
            "any.only": "Les mots de passe doivent correspondre."
        }),

    role_id: Joi.number().required()
});

export const validateRegister = validate(registerValidatorSchema);