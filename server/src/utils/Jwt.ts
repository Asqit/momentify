import { NextFunction, Request, Response, RequestHandler } from 'express';
import jwt, { SignOptions, TokenExpiredError } from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';
import { serverConfig } from '~/config/server.config';
import { HttpException } from './HttpException';
import { logger } from './logger';
import asyncHandler from 'express-async-handler';
import { PrismaConnector } from './PrismaConnector';

interface MomentifyToken extends JwtPayload {
	userId: string;
}

export class Jwt {
	public static createAccessToken(userId: string, opts?: SignOptions) {
		return jwt.sign({ userId }, serverConfig.ACCESS_TOKEN_SECRET, {
			...opts,
			expiresIn: '15min',
		});
	}

	public static createRefreshToken(userId: string) {
		return jwt.sign({ userId }, serverConfig.REFRESH_TOKEN_SECRET, {
			expiresIn: '30d',
		});
	}

	public static createEmailToken(userId: string) {
		return jwt.sign({ userId }, serverConfig.EMAIL_TOKEN_SECRET, {
			expiresIn: '1h',
		});
	}

	public static isMomentifyToken(test: unknown): test is MomentifyToken {
		if ((test as MomentifyToken).userId) {
			return true;
		} else {
			return false;
		}
	}

	public static protectedRoute() {
		return asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
			const HEADER = req.headers['authorization'];
			const TOKEN = HEADER && HEADER.split(' ')[1];

			if (!TOKEN) {
				throw new HttpException(401, 'Missing authorization token');
			}

			const SECRET = serverConfig.ACCESS_TOKEN_SECRET;

			if (!SECRET) {
				throw new HttpException(500, 'Server did not provided a dependency');
			}

			const decoded = jwt.verify(TOKEN, SECRET);

			if (!this.isMomentifyToken(decoded)) {
				throw new HttpException(401, 'Invalid authorization token');
			}

			const prisma = PrismaConnector.client;
			const user = await prisma.user.findUnique({ where: { id: decoded.userId } });

			if (!user) {
				throw new HttpException(403, 'Invalid authorization token');
			}

			res.locals.userId = user.id;

			next();
		});
	}
}
