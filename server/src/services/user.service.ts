import { Request, Response } from 'express';
import { HttpException } from '~/utils/HttpException';
import { PrismaConnector } from '~/utils/PrismaConnector';
import asyncHandler from 'express-async-handler';
import fs from 'node:fs/promises';
import sharp from 'sharp';

const prisma = PrismaConnector.client;

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
		follower.followingIds = follower.followingIds.filter((id) => id !== userId);
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

	// `req.file` does not actually contain buffer, so instead we are reading it from storage.
	const imageBuffer = await fs.readFile(image.path);
	const webpBuffer = await sharp(imageBuffer).webp().toBuffer();
	const NEW_FILENAME = image.filename.split('.')[0] + '.webp';

	await sharp(webpBuffer).toFile(`public/${NEW_FILENAME}`);

	// delete the original uploaded file, since we don't need it anymore.
	await fs.rm(image.path);

	const updatedUser = await prisma.user.update({
		where: { id },
		data: { profilePicture: NEW_FILENAME },
	});

	const responseUser: any = user;

	delete responseUser.hashPassword;

	res.status(200).json({
		user: responseUser,
	});
});
