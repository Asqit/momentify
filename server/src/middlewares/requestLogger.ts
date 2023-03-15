import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export function requestLogger(req: Request, res: Response, next: NextFunction) {
	const { socket, method, url } = req;
	const { statusCode } = res;

	const syntax = `Method - [${method.toUpperCase()}], Url - [$${url}], Ip - [${socket.remoteAddress}]`;

	logger.info(syntax);

	res.on('finish', () => {
		logger.info(`${syntax}, Status - [${statusCode}]`);
	});

	next();
}
