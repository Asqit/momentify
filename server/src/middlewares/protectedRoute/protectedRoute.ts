import { verify } from 'jsonwebtoken';
import { isAccessToken } from '~/utils/generateToken';
import { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import { serverConfig } from '~/config/server.config';
import { dbConnector } from '~/utils/dbConnector';
import { HttpException } from '~/utils/HttpException';

export const protectedRoute = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const HEADER = req.headers['authorization'];
		const TOKEN = HEADER && HEADER.split(' ')[1];

		if (!TOKEN) {
			throw new HttpException(401, 'Missing authorization token');
		}

		const SECRET = serverConfig.ACCESS_TOKEN_SECRET;

		if (!SECRET) {
			throw new HttpException(500, 'Server did not provided a dependency');
		}

		const decoded = verify(TOKEN, SECRET);

		if (!isAccessToken(decoded)) {
			throw new HttpException(401, 'Invalid authorization token');
		}

		const prisma = dbConnector.prisma;
		const user = await prisma.user.findUnique({ where: { email: decoded.email } });

		if (!user) {
			throw new HttpException(403, 'Invalid authorization token');
		}

		res.locals.userId = user.id;

		next();
	},
);
