import { NextFunction, Response, Request } from 'express';
import { HttpException } from '../../utils/HttpException';
import { exit } from 'node:process';
import { logger } from '../../utils/logger';

/**
 * Middleware responsible for handling errors.
 * @param err
 * @param req
 * @param res
 * @param next
 */
export function errorHandler(
	err: HttpException | Error,
	req: Request,
	res: Response,
	next: NextFunction,
): void {
	try {
		const isDevelopment = process.env.NODE_ENV === 'development';
		const status =
			err instanceof HttpException
				? err.statusCode
				: res.statusCode == 200
				? 500
				: res.statusCode;
		const response = {
			message: err.message,
			...(isDevelopment && { stack: err.stack }),
		};

		res.status(status).json(response);
	} catch (error) {
		logger.error(JSON.stringify(error));
		exit(1);
	}
}
