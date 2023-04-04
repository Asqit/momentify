import { HttpException } from '~/utils/HttpException';
import { dbConnector } from '~/utils/dbConnector';
import asyncHandler from 'express-async-handler';
import { Request, Response } from 'express';
import { unlink } from 'node:fs';

const prisma = dbConnector.prisma;

// ------------------------------------------------------------------------------------> [POST] /
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

	let post = await prisma.post.create({
		data: {
			title,
			authorId,
			body: files,
		},
	});

	res.status(201).json({
		id: post.id,
	});
});

// ------------------------------------------------------------------------------------> [GET] post/:id
export const getPost = asyncHandler(async (req: Request, res: Response) => {
	const { id } = req.params;
	const post = await prisma.post.findUnique({ where: { id } });

	if (!post) {
		res.sendStatus(404);
		return;
	}

	res.status(200).json(post);
});

// ------------------------------------------------------------------------------------> [GET] post/posts/:authorId
export const getAuthorPosts = asyncHandler(async (req: Request, res: Response) => {
	const { authorId } = req.params;
	const posts = await prisma.post.findMany({
		where: {
			authorId,
		},
	});

	if (!posts) {
		throw new HttpException(404, 'No posts were found');
	}

	res.status(200).json({
		results: posts,
	});
});

// ------------------------------------------------------------------------------------> [DELETE] /:id
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

// ------------------------------------------------------------------------------------> [PUT] /like/:id/:authorId
export const likePost = asyncHandler(async (req: Request, res: Response) => {
	const { id, authorId } = req.params;
	const post = await prisma.post.findUnique({ where: { id } });

	if (!post) {
		throw new HttpException(404, 'No post was found');
	}

	const updatedPost = await prisma.post.update({
		where: { id },
		data: {
			likedBy: post.likedBy.filter((userId) => {
				if (userId === authorId) {
					return;
				}

				return authorId;
			}),
		},
	});

	res.status(200).json({
		post: updatedPost,
	});
});
