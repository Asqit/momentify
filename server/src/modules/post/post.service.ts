import { HttpException } from '~/utils/HttpException';
import { dbConnector } from '~/utils/dbConnector';
import { Request, Response } from 'express';
import { unlink } from 'node:fs';
import { Post } from '@prisma/client';
import { shuffle } from '~/utils/shuffle';
import asyncHandler from 'express-async-handler';

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

// ------------------------------------------------------------------------------------> [GET] posts/feed/person
// TODO: Think of better algorithm. (this one is repetitive)
export const getPersonFeed = asyncHandler(async (req: Request, res: Response) => {
	const { userId: id } = res.locals;
	const user = await prisma.user.findUnique({
		where: { id },
		include: {
			followers: {
				include: { posts: true },
			},
		},
	});

	if (!user) {
		throw new HttpException(404, 'User not found');
	}

	const FOLLOWERS_LENGTH = user.followers.length;
	let posts: Post[] = [];

	// Append all posts into single array
	for (let i = 0; i < FOLLOWERS_LENGTH; i++) {
		const follower = user.followers[i];

		const FOLLOWER_POSTS_LENGTH = follower.posts.length;
		for (let j = 0; j < FOLLOWER_POSTS_LENGTH; j++) {
			const post = follower.posts[j];
			posts.push(post);
		}
	}

	// Shuffle the array
	posts = shuffle(posts);

	res.status(200).json({
		results: posts,
	});
});

// ------------------------------------------------------------------------------------> [GET] posts/feed/global/:lastId
export const getGlobalFeed = asyncHandler(async (req: Request, res: Response) => {
	const { lastId } = req.params;

	// Find first 30 posts, that has id > lastId
	const posts = await prisma.post.findMany({
		take: 30,
		where: {
			id: {
				gt: lastId,
			},
		},
	});

	res.status(200).json({
		results: posts,
	});
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
