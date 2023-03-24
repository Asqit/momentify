import asyncHandler from 'express-async-handler';
import { Request, Response } from 'express';
import * as argon2 from 'argon2';
import { dbConnector } from '~/utils/dbConnector';
import { generateAccessToken } from '~/utils/generateToken';
import { HttpException } from '~/utils/HttpException';

const prisma = dbConnector.prisma;

export const register = asyncHandler(async (req: Request, res: Response) => {
	const { email, password, username } = req.body;
	const conflict = await prisma.user.findFirst({
		where: {
			OR: [{ email }, { username }],
		},
	});

	if (conflict) {
		throw new HttpException(409, 'Email or username is already taken');
	}

	const HASH_PASSWORD = await argon2.hash(password);

	await prisma.user.create({
		data: {
			username,
			email,
			hashPassword: HASH_PASSWORD,
		},
	});

	// TODO: Notify user to verify their email
	// 1) Generate a new special token
	// 2) send that token to specified email address

	res.status(201).json({
		success: true,
	});
});

export const login = asyncHandler(async (req: Request, res: Response) => {
	const { email, password } = req.body;

	const user = await prisma.user.findUnique({ where: { email } });

	if (!user) {
		throw new HttpException(401, 'Invalid credentials');
	}

	const isMatch = await argon2.verify(user.hashPassword, password);

	if (!isMatch) {
		throw new HttpException(401, 'Invalid credentials');
	}

	const ACCESS_TOKEN = generateAccessToken(email);

	res.status(200).json({
		accessToken: ACCESS_TOKEN,
		user,
	});
});

export const verifyEmail = asyncHandler(async (req: Request, res: Response) => {});
