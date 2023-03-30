import { HttpException } from '~/utils/HttpException';
import { dbConnector } from '~/utils/dbConnector';
import asyncHandler from 'express-async-handler';
import { Request, Response } from 'express';
import { unlink } from 'node:fs';

const prisma = dbConnector.prisma;

export const createPost = asyncHandler(async (req: Request, res: Response) => {
	const { title, authorId } = req.body;
	const images = req.files;
	let files: any = images;

	if (!images) {
		throw new HttpException(400, 'Bad request');
	}

	if (!Array.isArray(images)) {
		files = [images];
	} else {
		files = images.map((image) => image.path);
	}

	await prisma.post.create({
		data: {
			title,
			authorId,
			body: files,
		},
	});

	res.status(201).json({
		success: true,
	});
});

export const getPost = asyncHandler(async (req: Request, res: Response) => {
	const { id } = req.params;
	const post = await prisma.post.findUnique({ where: { id } });

	if (!post) {
		res.sendStatus(404);
		return;
	}

	res.status(200).json(post);
});

export const getAuthorPosts = asyncHandler(async (req: Request, res: Response) => {});

export const updatePost = asyncHandler(async (req: Request, res: Response) => {
	const { id } = req.params;
});

export const deletePost = asyncHandler(async (req: Request, res: Response) => {
	const { id } = req.params;

	// Remove post alone
	const post = await prisma.post.delete({
		where: {
			id,
		},
	});

	// Remove post's images (body)
	post.body.forEach((imageUrl: string) => {
		unlink(`public/${imageUrl}`, (err) => {
			if (err) {
				throw new HttpException(500, "Cannot delete post's image");
			}
		});
	});

	// Remove all comments
	await prisma.comment.deleteMany({
		where: {
			postId: post.id,
		},
	});

	res.status(200).json(post.id);
});
