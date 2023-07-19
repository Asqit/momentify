import { Request, Response } from 'express';
import { HttpException } from '~/utils/HttpException';
import { PrismaConnector } from '~/utils/PrismaConnector';
import asyncHandler from 'express-async-handler';
import fs from 'node:fs/promises';
import sharp from 'sharp';
import path from 'node:path';
import { logger } from '~/utils/logger';
import { User } from '@prisma/client';

const prisma = PrismaConnector.client;

// ------------------------------------------------------------------------------------> [GET] /:id
export const getUser = asyncHandler(async (req: Request, res: Response) => {
	const { id } = req.params;
	const user = await prisma.user.findUnique({
		where: {
			id,
		},
		include: {
			posts: {
				include: {
					comments: true,
				},
			},
			followers: true,
			following: true,
		},
	});

	if (!user) {
		throw new HttpException(404, 'User not found');
	}

	const responseUser: Partial<User> = user;

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
		user.followersIds = user.followersIds.filter((id: string) => id !== followerId);
		follower.followingIds = follower.followingIds.filter((id: string) => id !== userId);
	} else {
		user.followersIds.push(followerId);
		follower.followingIds.push(userId);
	}

	await prisma.user.update({
		where: { id: userId },
		data: {
			followersIds: user.followersIds,
		},
	});

	await prisma.user.update({
		where: { id: followerId },
		data: {
			followingIds: follower.followingIds,
		},
	});

	res.sendStatus(200);
});

// ------------------------------------------------------------------------------------> [PUT] /:id/image
export const changeProfilePicture = asyncHandler(async (req: Request, res: Response) => {
	const { id } = req.params;
	const image = req.file;
	const user = await prisma.user.findUnique({ where: { id } });
	let filename: string;

	if (!image) {
		throw new HttpException(400, 'Missing image');
	}

	if (!user) {
		throw new HttpException(404, 'No user was found');
	}

	if (user.profilePicture) {
		fs.rm(`public/${user.profilePicture}`).catch((error) => {
			logger.warn('Image could not be deleted');
		});
	}

	if (path.extname(image.filename) !== '.webp') {
		// `req.file` does not actually contain buffer, so instead we are reading it from storage.
		const imageBuffer = await fs.readFile(image.path);
		const webpBuffer = await sharp(imageBuffer).webp().toBuffer();

		filename = image.filename.split('.')[0] + '.webp';

		await sharp(webpBuffer).toFile(`public/${filename}`);

		// delete the original uploaded file, since we don't need it anymore.
		await fs.rm(image.path);
	} else {
		filename = image.filename;
	}

	await prisma.user.update({
		where: { id },
		data: { profilePicture: filename },
	});

	const responseUser: any = user;

	delete responseUser.hashPassword;

	res.status(200).json({
		user: responseUser,
	});
});

// ------------------------------------------------------------------------------------> [DELETE] /:id
async function deleteUserData(userId: string) {
	const posts = await prisma.post.findMany({ where: { authorId: userId } });

	for (const post of posts) {
		await prisma.comment.deleteMany({ where: { postId: post.id } });

		for (const body of post.body) {
			try {
				await fs.unlink(`public/${body}`);
			} catch (error) {
				logger.error(`Error deleting file ${body}: ${error}`);
			}
		}
	}

	await prisma.comment.deleteMany({ where: { authorId: userId } });
	await prisma.post.deleteMany({ where: { authorId: userId } });
}

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
	const { id } = req.params;

	const user = await prisma.user.findUnique({ where: { id }, include: { posts: true } });

	if (!user) {
		throw new HttpException(404, 'Not found');
	}

	try {
		await deleteUserData(id);

		await prisma.user.delete({ where: { id } });

		if (user.profilePicture) {
			try {
				await fs.unlink(user.profilePicture);
			} catch (error) {
				logger.error(`Error deleting profile picture: ${error}`);
			}
		}

		res.status(200).json({ message: `User ${id} deleted` });
	} catch (error) {
		logger.error(JSON.stringify(error));
		throw new HttpException(500, 'Server error');
	}
});

// ------------------------------------------------------------------------------------> [PUT] /:id/bio
export const changeBio = asyncHandler(async (req: Request, res: Response) => {
	const { userId } = req.params;
	const { bio } = req.body;
	const user = await prisma.user.update({ where: { id: userId }, data: { bio } });

	const responseUser: Partial<User> = user;

	delete responseUser.hashPassword;

	res.status(200).json({
		user: responseUser,
	});
});
