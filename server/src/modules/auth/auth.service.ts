import asyncHandler from 'express-async-handler'
import { Request, Response } from 'express'
import * as argon2 from 'argon2'
import { dbConnector } from '~/utils/dbConnector'
import { generateAccessToken } from '~/utils/generateToken'
import { HttpException } from '~/utils/HttpException'

const prisma = dbConnector.prisma

export const register = asyncHandler(async (req: Request, res: Response) => {
	const { email, password, username } = req.body
	const conflict = await prisma.user.findUnique({ where: { email } })

	if (conflict) {
		throw new HttpException(409, 'Email is already in use')
	}

	const HASH_PASSWORD = await argon2.hash(password)

	const newUser = await prisma.user.create({
		data: {
			username,
			email,
			hashPassword: HASH_PASSWORD,
		},
	})

	const ACCESS_TOKEN = generateAccessToken(email)

	res.status(201).json({
		accessToken: ACCESS_TOKEN,
	})
})

export const login = asyncHandler(async (req: Request, res: Response) => {
	const { email, password } = req.body

	const user = await prisma.user.findUnique({ where: { email } })

	if (!user) {
		throw new HttpException(401, 'Invalid credentials')
	}

	const isMatch = await argon2.verify(user.hashPassword, password)

	if (!isMatch) {
		throw new HttpException(401, 'Invalid credentials')
	}

	const ACCESS_TOKEN = generateAccessToken(email)

	res.status(200).json({
		accessToken: ACCESS_TOKEN,
	})
})
