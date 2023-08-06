import { Request, Response } from 'express';
import { HttpException } from '../utils/HttpException';
import { PrismaConnector } from '../utils/PrismaConnector';
import asyncHandler from 'express-async-handler';

const prisma = PrismaConnector.client;

// ------------------------------------------------------------------------------------> [POST] /
export const createComment = asyncHandler(async (req: Request, res: Response) => {
	const { value, authorId, postId } = req.body;
	const comment = await prisma.comment.create({
		data: { value, authorId, postId },
	});

	res.status(201).json({
		...comment,
	});
});

// ------------------------------------------------------------------------------------> [PUT] /:id
export const updateComment = asyncHandler(async (req: Request, res: Response) => {
	const { id, value } = req.body;
	const comment = await prisma.comment.update({ where: { id }, data: { value } });

	res.status(200).json({
		results: comment,
	});
});

// ------------------------------------------------------------------------------------> [GET] /post/:id
export const getPostComments = asyncHandler(async (req: Request, res: Response) => {
	const { id } = req.params;
	const comments = await prisma.comment.findMany({ where: { postId: id } });

	if (!comments || comments.length === 0) {
		throw new HttpException(404, 'No comments were found');
	}

	res.status(200).json({
		results: comments,
	});
});

// ------------------------------------------------------------------------------------> [GET] /:id
export const getComment = asyncHandler(async (req: Request, res: Response) => {
	const { id } = req.params;
	const comment = await prisma.comment.findUnique({ where: { id } });

	if (!comment) {
		throw new HttpException(404, 'Comment was not found');
	}

	res.status(200).json({
		results: comment,
	});
});

// ------------------------------------------------------------------------------------> [DELETE] /:id
export const deleteComment = asyncHandler(async (req: Request, res: Response) => {
	const { id } = req.params;

	const deleteResult = await prisma.comment.delete({ where: { id } });

	res.status(200).json({ id: deleteResult.id });
});
// ------------------------------------------------------------------------------------> [PUT] /:id/like/:userId
export const likeComment = asyncHandler(async (req: Request, res: Response) => {
	const { id, userId } = req.params;
	const comment = await prisma.comment.findUnique({ where: { id } });
	const user = await prisma.user.findUnique({ where: { id: userId } });

	if (!comment || !user) {
		throw new HttpException(404, 'Not found');
	}

	const isAlreadyLiked = comment.likedBy.includes(userId);

	const updatedComment = await prisma.comment.update({
		where: { id },
		data: {
			updatedAt: new Date().toISOString(),
			likedBy: isAlreadyLiked
				? comment.likedBy.filter((id) => id !== userId)
				: [...comment.likedBy, userId],
		},
	});

	res.status(200).json(updatedComment);
});
