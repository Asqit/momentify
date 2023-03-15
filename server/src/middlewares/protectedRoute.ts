import { verify } from 'jsonwebtoken';
import { isMomentifyToken } from '../utils/generateToken';
import { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import { serverConfig } from '../config/server.config';
import { dbConnector } from '../utils/dbConnector';
import { AppError } from '../utils/AppError';

export const protectedRoute = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
	const HEADER = req.headers['authorization'];
	const TOKEN = HEADER && HEADER.split(' ')[1];

	if (!TOKEN) {
		throw new AppError(401, 'Missing authorization token');
	}

	const SECRET = serverConfig.jwt.accessTokenSecret;

	if (!SECRET) {
		throw new AppError(500, 'Server did not provided a dependency');
	}

	const decoded = verify(TOKEN, SECRET);

	if (!isMomentifyToken(decoded)) {
		throw new AppError(401, 'Invalid authorization token');
	}

	const prisma = dbConnector.prisma;
	const user = await prisma.user.findUnique({ where: { email: decoded.email } });

	if (!user) {
		throw new AppError(403, 'Invalid authorization token');
	}

	next();
});
