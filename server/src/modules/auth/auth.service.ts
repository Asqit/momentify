import { LoginSchema, RegisterSchema } from './auth.validation';
import { Request, Response } from 'express';
import { dbConnector } from '~/utils/dbConnector';
import { generateToken } from '~/utils/generateToken';
import { HttpException } from '~/utils/HttpException';
import { serverConfig } from '~/config/server.config';
import { hash, verify } from 'argon2';
import asyncHandler from 'express-async-handler';

const prisma = dbConnector.prisma;

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

	await prisma.user.create({
		data: {
			username,
			email,
			hashPassword: HASH_PASSWORD,
		},
	});

	res.status(201).json({
		message: 'success',
	});
});

export const login = asyncHandler(async (req: Request, res: Response) => {
	const { email, password } = req.body as LoginSchema;

	const user = await prisma.user.findUnique({ where: { email } });

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
	const ACCESS_TOKEN = generateToken(email, SECRET, {
		expiresIn: '10h',
	});

	res.status(200).json({
		accessToken: ACCESS_TOKEN,
		user,
	});
});

export const verifyEmail = asyncHandler(async (req: Request, res: Response) => {});

export const verifyPassword = asyncHandler(async (req: Request, res: Response) => {});

export const issueEmail = asyncHandler(async (req: Request, res: Response) => {});

export const issueToken = asyncHandler(async (req: Request, res: Response) => {
	const { email } = req.params;
	const user = await prisma.user.findUnique({ where: { email } });

	if (!user) {
		throw new HttpException(400, 'Invalid email address');
	}
});
