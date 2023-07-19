import Joi from 'joi';

export const changeBioSchema = Joi.object({
	bio: Joi.string().required().trim(),
});
