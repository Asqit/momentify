import { Request, Response, NextFunction } from 'express';
import { ValidationError } from 'yup';
import { AppError } from '../utils/AppError';

export function errorHandler(err: AppError | Error | ValidationError, req: Request, res: Response, next: NextFunction) {
	try {
		const { stack, message } = err;
		const response: any = { message };

		if (err instanceof AppError) {
			response.statusCode = err.statusCode;
		} else if (err instanceof ValidationError) {
			response.statusCode = 400;
		} else {
			response.statusCode = res.statusCode ?? 500;
		}

		if (process.env.NODE_ENV === 'development') {
			response.stack = stack;
		}

		res.status(response.statusCode).json(response);
	} catch (error) {
		res.status(500).json({
			error,
		});
	}
}
