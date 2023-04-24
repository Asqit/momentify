import { Request, Response, NextFunction } from 'express';
import { ObjectSchema, ValidationResult } from 'joi';
import { HttpException } from '~/utils/HttpException';

interface ValidatedRequest<T> extends Request {
	body: T;
}

/**
 * Middleware used to validate request with Joi
 * @param schema how the request should be shaped
 * @returns express RequestHandler
 */
export function validateRequest(schema: ObjectSchema) {
	return (req: Request, res: Response, next: NextFunction) => {
		const result: ValidationResult = schema.validate(req.body);

		if (result.error) {
			throw new HttpException(400, result.error.details[0].message);
		}

		const validatedReq = req as ValidatedRequest<typeof result.value>;
		validatedReq.body = result.value;

		next();
	};
}
