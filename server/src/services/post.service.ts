import { HttpException } from '~/utils/HttpException';
import { Request, Response } from 'express';
import { unlink } from 'node:fs';
import { Post } from '@prisma/client';
import { shuffle } from '~/utils/shuffle';
import { PrismaConnector } from '~/utils/PrismaConnector';
import asyncHandler from 'express-async-handler';
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const prisma = PrismaConnector.client;

// ------------------------------------------------------------------------------------> [POST] /
export const createPost = asyncHandler(async (req: Request, res: Response) => {
	const { title, authorId } = req.body;
	const images = req.files;
	let files: any = images;
	const finalFiles: string[] = [];

	if (!images) {
		throw new HttpException(400, 'Bad request');
	}

	if (!Array.isArray(images)) {
		files = [images];
	} else {
		files = images.map((image) => image.filename);
	}

	for (let file of files) {
		// Skip every file with .webp extension
		if (path.extname(file) === '.webp') {
			finalFiles.push(file);
			continue;
		}

		const imageBuffer = await fs.readFile(`public/${file}`);
		const webpBuffer = await sharp(imageBuffer).webp().toBuffer();
		const NEW_FILENAME = file.replace(path.extname(file), '.webp');

		// Save a webp version of the file
		await sharp(webpBuffer).toFile(`public/${NEW_FILENAME}`);

		// Remove original file
		await fs.rm(`public/${file}`);

		finalFiles.push(NEW_FILENAME);
	}

	let post = await prisma.post.create({
		data: {
			title,
			authorId,
			body: finalFiles,
		},
	});

	res.status(201).json({
		id: post.id,
	});
});

// ------------------------------------------------------------------------------------> [GET] posts/:id
export const getPost = asyncHandler(async (req: Request, res: Response) => {
	const { id } = req.params;
	const post = await prisma.post.findUnique({
		where: { id },
		include: { comments: true, author: true },
	});

	if (!post) {
		res.sendStatus(404);
		return;
	}

	const responsePost: any = post;

	delete responsePost.author.hashPassword;

	res.status(200).json(post);
});

// ------------------------------------------------------------------------------------> [GET] posts/
export const getAllPosts = asyncHandler(async (req: Request, res: Response) => {
	const posts = await prisma.post.findMany({
		include: {
			author: true,
			comments: true,
		},
	});

	res.status(200).json(posts);
});

// ------------------------------------------------------------------------------------> [GET] posts/feed/person
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
	// Find first 30 posts, that has id > lastId
	let posts = await prisma.post.findMany({
		take: 30,
		include: {
			author: true,
			comments: true,
		},
	});

	posts = shuffle(posts);

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
	const { id, userId } = req.params;
	const post = await prisma.post.findUnique({ where: { id } });

	if (!post) {
		throw new HttpException(404, 'No post was found');
	}

	const isAlreadyLiked = post.likedBy.includes(userId);

	const updatedPost = await prisma.post.update({
		where: { id },
		data: {
			likedBy: isAlreadyLiked
				? post.likedBy.filter((id) => id !== userId)
				: [...post.likedBy, userId],
		},
	});

	res.status(200).json({
		...updatedPost,
	});
});
