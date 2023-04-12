import { Request, Response } from 'express';
import { HttpException } from '~/utils/HttpException';
import { dbConnector } from '~/utils/dbConnector';
import asyncHandler from 'express-async-handler';

const prisma = dbConnector.prisma;

// ------------------------------------------------------------------------------------> [GET] /:id
export const getUser = asyncHandler(async (req: Request, res: Response) => {
	const { id } = req.params;
	const user = await prisma.user.findUnique({
		where: {
			id,
		},
		include: { posts: true },
	});

	if (!user) {
		throw new HttpException(404, 'User not found');
	}

	const responseUser: any = user;

	delete responseUser.hashPassword;

	res.status(200).json({
		user: responseUser,
	});
});

// ------------------------------------------------------------------------------------> [PUT] /follow
export const toggleFollowUser = asyncHandler(async (req: Request, res: Response) => {
	const { userId, followerId } = req.body;
	const user = await prisma.user.findUnique({ where: { id: userId } }); // target user
	const follower = await prisma.user.findUnique({ where: { id: followerId } }); // This guy should follows user

	if (!user || !follower) {
		throw new HttpException(404, 'Users were not found');
	}

	if (user.followersIds.includes(followerId)) {
		user.followersIds.filter((id) => id !== followerId);
		follower.followingIds.filter((id) => id !== userId);
	} else {
		user.followersIds.push(followerId);
		follower.followingIds.push(userId);
	}

	const updatedUser = await prisma.user.update({
		where: { id: userId },
		data: {
			followersIds: user.followersIds,
		},
	});

	const updatedFollower = await prisma.user.update({
		where: { id: followerId },
		data: {
			followingIds: follower.followingIds,
		},
	});

	res.status(200).json({
		results: 'OK',
	});
});