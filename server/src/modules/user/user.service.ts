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
		include: { posts: true, followers: true, following: true },
	});

	if (!user) {
		throw new HttpException(404, 'User not found');
	}

	const responseUser: any = user;

	delete responseUser.hashPassword;

	res.status(200).json({
		...responseUser,
	});
});

// ------------------------------------------------------------------------------------> [PUT] /follow
export const toggleFollowUser = asyncHandler(async (req: Request, res: Response) => {
	const { userId, followerId } = req.params;
	const user = await prisma.user.findUnique({ where: { id: userId } }); // target user
	const follower = await prisma.user.findUnique({ where: { id: followerId } }); // This guy should follow user

	if (!user || !follower) {
		throw new HttpException(404, 'Users were not found');
	}

	const isFollowerFollowing = user.followersIds.includes(followerId);

	if (isFollowerFollowing) {
	  user.followersIds = user.followersIds.filter((id) => id !== followerId);
	  follower.followingIds =	follower.followingIds.filter((id) => id !== userId);
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
// ------------------------------------------------------------------------------------> [PUT] /:id/image
export const changeProfilePicture = asyncHandler(async (req: Request, res: Response) => {
	const { id } = req.params;
	const image = req.file;
	const user = await prisma.user.findUnique({ where: { id } });

	if (!image) {
		throw new HttpException(400, 'Missing image');
	}

	if (!user) {
		throw new HttpException(404, 'No user was found');
	}

	const updatedUser = await prisma.user.update({
		where: { id },
		data: { profilePicture: image.filename },
	});

	const responseUser: any = user;

	delete responseUser.hashPassword;

	res.status(200).json({
		user: responseUser,
	});
});
