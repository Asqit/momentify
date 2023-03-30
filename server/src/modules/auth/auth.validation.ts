import Joi, { ObjectSchema } from 'joi';

export interface LoginSchema {
	email: string;
	password: string;
}

export interface RegisterSchema extends LoginSchema {
	username: string;
}

const username = Joi.string().alphanum().min(3).max(30).required();
const email = Joi.string().email().required();
// Password must contain 8 characters and at least one number, one letter and one unique character such as !#$%&?
const password = Joi.string().pattern(
	new RegExp('^.*(?=.{8,})(?=.*[a-zA-Z])(?=.*d)(?=.*[!#$%&? "]).*$'),
);

export const loginSchema: ObjectSchema<LoginSchema> = Joi.object({
	email,
	password,
});

export const registerSchema: ObjectSchema<RegisterSchema> = Joi.object({
	username,
	email,
	password,
});
