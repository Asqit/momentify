import Joi from 'joi';

export const objectIdSchema = Joi.string().required();

export const postCreationSchema = Joi.object({
	title: Joi.string().trim().required(),
	authorId: Joi.string().required(),
});
