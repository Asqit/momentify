import { LoginSchema, PasswordChangeSchema, RegisterSchema } from './auth.validation';
import { Request, Response } from 'express';
import { dbConnector } from '~/utils/dbConnector';
import { generateToken, isEmailToken } from '~/utils/generateToken';
import { HttpException } from '~/utils/HttpException';
import { serverConfig } from '~/config/server.config';
import { hash, verify } from 'argon2';
import { sendVerificationEmail } from '~/utils/sendEmail';
import { verify as verifyJWT } from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import Joi from 'joi';

const prisma = dbConnector.prisma;

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

	const EMAIL_TOKEN = generateToken(
		{
			id: user.id,
			email: user.email,
		},
		serverConfig.EMAIL_TOKEN_SECRET,
		{
			expiresIn: '1h',
		},
	);

	await sendVerificationEmail(email, EMAIL_TOKEN);

	res.status(201).json({
		message: 'success',
	});
});

// ------------------------------------------------------------------------------------> [POST] /login
export const login = asyncHandler(async (req: Request, res: Response) => {
	const { email, password } = req.body as LoginSchema;

	const user = await prisma.user.findUnique({
		where: { email },
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

	const SECRET = serverConfig.ACCESS_TOKEN_SECRET;
	const ACCESS_TOKEN = generateToken({ email }, SECRET, {
		expiresIn: '60 minutes',
	});

	let responseUser: any = user;

	delete responseUser.hashPassword;

	res.status(200).json({
		accessToken: ACCESS_TOKEN,
		user: responseUser,
	});
});

// ------------------------------------------------------------------------------------> [GET] /verify/email/:token
export const verifyEmail = asyncHandler(async (req: Request, res: Response) => {
	const { token } = req.params;

	const decoded = verifyJWT(token, serverConfig.EMAIL_TOKEN_SECRET);

	if (!isEmailToken(decoded)) {
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

	const EMAIL_TOKEN = generateToken(
		{
			id: user.id,
			email: user.email,
		},
		serverConfig.EMAIL_TOKEN_SECRET,
		{
			expiresIn: '1h',
		},
	);

	sendVerificationEmail(email, EMAIL_TOKEN);

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
