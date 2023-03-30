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
const password = Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'));

export const loginSchema: ObjectSchema<LoginSchema> = Joi.object({
	email,
	password,
});

export const registerSchema: ObjectSchema<RegisterSchema> = Joi.object({
	username,
	email,
	password,
});
