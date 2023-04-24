import { Request, Response, NextFunction } from 'express';
import { logger } from '~/utils/logger';

/**
 * Middleware used to log every `Request` and our `Response` to it.
 * @param req Express request
 * @param res Express response
 * @param next Express nextFunction
 */
function requestLogger(req: Request, res: Response, next: NextFunction) {
	const { method, url } = req;
	const ip = req.socket.remoteAddress;

	const syntax = `Method - [${method.toUpperCase()}], Url - [${url}], Ip - [${ip}]`;

	logger.info(syntax);

	res.on('finish', () => {
		const { statusCode } = res;
		logger.info(`${syntax}, Status - [${statusCode}]`);
	});

	next();
}

export { requestLogger };
