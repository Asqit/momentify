import { NextFunction, Request, Response } from 'express';
import jwt, { SignOptions, TokenExpiredError } from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';
import { serverConfig } from '../config/server.config';
import { HttpException } from './HttpException';
import { PrismaConnector } from './PrismaConnector';
import asyncHandler from 'express-async-handler';

/** An `interface` describing our token */
interface MomentifyToken extends JwtPayload {
	userId: string;
}

/**
 * Class for Jwt manipulation
 *
 * **Note**: class is not instantiable, just contains static methods.
 */
export class Jwt {
	/**
	 * Method used for getting a new access token
	 * @param userId
	 * @param opts optional options object. (Algorithm, expiresIn...please note, that expiresIn is overridden)
	 * @returns A newly generated Jwt token used as access token. (It lasts 15 minutes)
	 */
	public static createAccessToken(userId: string, opts?: SignOptions) {
		return jwt.sign({ userId }, serverConfig.ACCESS_TOKEN_SECRET, {
			...opts,
			expiresIn: '15min',
		});
	}

	/**
	 * Method used for getting a new refresh token.
	 * @param userId Jwt token payload.
	 * @returns A newly generated JWT token used as refresh token. (It lasts 30 days)
	 */
	public static createRefreshToken(userId: string) {
		return jwt.sign({ userId }, serverConfig.REFRESH_TOKEN_SECRET, {
			expiresIn: '30d',
		});
	}

	/**
	 * Method used for getting a new email verification token.
	 * @param userId
	 * @returns A newly generated Jwt token used as email token. (It lasts 1 hour)
	 */
	public static createEmailToken(userId: string) {
		return jwt.sign({ userId }, serverConfig.EMAIL_TOKEN_SECRET, {
			expiresIn: '1h',
		});
	}

	/**
	 * A type guard for checking if token actually is ours.
	 * @param test Unknown Jwt token to be tested
	 * @returns `true` if is our token and `false` if not
	 */
	public static isMomentifyToken(test: unknown): test is MomentifyToken {
		if ((test as MomentifyToken).userId) {
			return true;
		} else {
			return false;
		}
	}

	/**
	 * Method which returns a middleware for access token authentication
	 * @returns Middleware which will test access token obtained from `Request Header`
	 */
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

			try {
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
			} catch (error) {
				if (error instanceof TokenExpiredError) {
					throw new HttpException(401, 'Access token needs to be refreshed');
				}

				throw error;
			}
		});
	}

	public static verifyRefreshToken(token: string): MomentifyToken {
		try {
			const data = jwt.verify(token, serverConfig.REFRESH_TOKEN_SECRET);

			if (!this.isMomentifyToken(data)) {
				throw new Error('Is not our token');
			}

			return data;
		} catch (error) {
			throw error;
		}
	}
}
