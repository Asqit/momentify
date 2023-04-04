import { NextFunction, Response, Request } from 'express';
import { HttpException } from '~/utils/HttpException';

function errorHandler(
	err: HttpException | Error,
	req: Request,
	res: Response,
	next: NextFunction,
) {
	const isDevelopment = process.env.NODE_ENV === 'development';
	const status = err instanceof HttpException ? err.statusCode : res.statusCode;
	const response = {
		message: err.message,
		...(isDevelopment && { stack: err.stack }),
	};
	res.status(status).json(response);
}

export { errorHandler };
