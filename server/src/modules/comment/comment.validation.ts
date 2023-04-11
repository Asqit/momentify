import Joi from 'joi';

export const commentCreationSchema = Joi.object({
	value: Joi.string().required().trim(),
	authorId: Joi.string().trim().required(),
	postId: Joi.string().trim().required(),
});

export const commentUpdateSchema = Joi.object({
	value: Joi.string().trim().required(),
	id: Joi.string().trim().required(),
});
