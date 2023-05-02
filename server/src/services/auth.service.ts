import {
	LoginSchema,
	PasswordChangeSchema,
	RegisterSchema,
} from '../validation/auth.validation';
import { Request, Response } from 'express';
import { HttpException } from '~/utils/HttpException';
import { serverConfig } from '~/config/server.config';
import { hash, verify } from 'argon2';
import { verify as verifyJWT } from 'jsonwebtoken';
import { Email } from '~/utils/Email';
import { Jwt } from '~/utils/Jwt';
import { PrismaConnector } from '~/utils/PrismaConnector';
import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import Joi from 'joi';
import { User } from '@prisma/client';

const prisma = PrismaConnector.client;

// ------------------------------------------------------------------------------------> [POST] /
export const register = asyncHandler(async (req: Request, res: Response) => {
	const { email, password, username } = req.body as RegisterSchema;
	const conflict = await prisma.user.findFirst({
		where: {
			OR: [{ email }, { username }],
		},
	});

	if (conflict) {
		throw new HttpException(409, 'Email or username is already taken');
	}

	const HASH_PASSWORD = await hash(password);

	const user = await prisma.user.create({
		data: {
			username,
			email,
			hashPassword: HASH_PASSWORD,
		},
		include: {
			posts: true,
		},
	});

	const EMAIL_TOKEN = Jwt.createEmailToken(user.id);

	await Email.sendVerification(email, EMAIL_TOKEN);

	res.status(201).json({
		message: 'success',
	});
});

// ------------------------------------------------------------------------------------> [POST] /login
export const login = asyncHandler(async (req: Request, res: Response) => {
	const { email, password } = req.body as LoginSchema;

	const user = await prisma.user.findUnique({
		where: { email },
		include: {
			posts: true,
			followers: false,
			following: false,
		},
	});

	if (!user) {
		throw new HttpException(401, 'Invalid credentials');
	}

	if (!user.verified) {
		res.redirect(`http://localhost:${serverConfig.API_PORT}/api/auth/issue/email/${email}`);
	}

	if (!(await verify(user.hashPassword, password))) {
		throw new HttpException(401, 'Invalid credentials');
	}

	const ACCESS_TOKEN = Jwt.createAccessToken(user.id);
	const REFRESH_TOKEN = Jwt.createRefreshToken(user.id);

	let responseUser: any = user;

	delete responseUser.hashPassword;

	res.cookie('auth', REFRESH_TOKEN, { httpOnly: true, sameSite: 'strict' });

	res.status(200).json({
		accessToken: ACCESS_TOKEN,
		user: responseUser,
	});
});

// ------------------------------------------------------------------------------------> [GET] /verify/email/:token
export const verifyEmail = asyncHandler(async (req: Request, res: Response) => {
	const { token } = req.params;

	const decoded = verifyJWT(token, serverConfig.EMAIL_TOKEN_SECRET);

	if (!Jwt.isMomentifyToken(decoded)) {
		throw new HttpException(401, 'Invalid token');
	}

	const user = await prisma.user.findUnique({
		where: {
			email: decoded.email,
		},
	});

	if (!user) {
		throw new HttpException(401, 'Invalid token data');
	}

	if (user.verified) {
		throw new HttpException(403, 'User is already verified');
	}

	await prisma.user.update({
		where: {
			email: user.email,
		},
		data: {
			verified: true,
		},
	});

	res.sendStatus(200);
});

// ------------------------------------------------------------------------------------> [GET] /issue/email/:email
export const issueEmail = asyncHandler(async (req: Request, res: Response) => {
	const { email } = req.params;
	const emailTest = Joi.string().email().trim().required();
	const emailTestResults = emailTest.validate(email);

	if (emailTestResults.error) {
		throw new HttpException(400, emailTestResults.error.message);
	}

	const user = await prisma.user.findUnique({ where: { email } });

	if (!user) {
		throw new HttpException(404, 'No user was found');
	}

	if (user.verified) {
		throw new HttpException(409, 'User is already verified');
	}

	const EMAIL_TOKEN = Jwt.createEmailToken(user.id);

	Email.sendVerification(email, EMAIL_TOKEN);

	res.sendStatus(200);
});

// ------------------------------------------------------------------------------------> [PUT] /issue/password
export const issuePassword = asyncHandler(async (req: Request, res: Response) => {
	const { password, newPassword } = req.body as PasswordChangeSchema;
	const { userId } = res.locals;
	const user = await prisma.user.findUnique({ where: { id: userId } });

	if (!user) {
		throw new HttpException(404, 'User not found');
	}

	if (!(await verify(user.hashPassword, password))) {
		throw new HttpException(401, 'Passwords does not match');
	}

	const HASH_PASSWORD = await hash(newPassword);

	await prisma.user.update({
		where: {
			id: userId,
		},
		data: {
			hashPassword: HASH_PASSWORD,
		},
	});

	res.sendStatus(200);
});

// ------------------------------------------------------------------------------------> [GET] /refresh
export const refreshToken = asyncHandler(async (req: Request, res: Response) => {
	const { auth: REFRESH_TOKEN } = req.cookies;
	const data = Jwt.verifyRefreshToken(REFRESH_TOKEN);
	const user = await prisma.user.findUnique({ where: { id: data.userId } });

	if (!user) {
		throw new HttpException(403, 'Invalid token');
	}

	const NEW_ACCESS_TOKEN = Jwt.createAccessToken(user.id);
	const NEW_REFRESH_TOKEN = Jwt.createRefreshToken(user.id);

	res.cookie('auth', REFRESH_TOKEN, { httpOnly: true, sameSite: 'strict' });

	const responseUser: Partial<User> = user;

	delete responseUser.hashPassword;

	res.status(200).send({
		accessToken: NEW_ACCESS_TOKEN,
		user: responseUser,
	});
});
