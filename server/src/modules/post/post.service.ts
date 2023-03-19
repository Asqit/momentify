import { HttpException } from '~/utils/HttpException'
import { dbConnector } from '~/utils/dbConnector'
import { validateDto } from '~/utils/validateDto'
import asyncHandler from 'express-async-handler'
import { RetrievePostDto } from './post.dto'
import { Request, Response } from 'express'
import { unlink } from 'node:fs'

const prisma = dbConnector.prisma

export const createPost = asyncHandler(async (req: Request, res: Response) => {
	const files = req.files
	const { title, authorId } = req.body

	if (!files) {
		throw new HttpException(400, 'Missing request body')
	}

	const newPost = prisma.post.create({
		data: {
			title,
			authorId,
		},
	})
})

export const getPost = asyncHandler(async (req: Request, res: Response) => {
	const { id } = req.params
	const post = await prisma.post.findUnique({ where: { id } })

	if (!post) {
		res.sendStatus(404)
		return
	}

	const result = await validateDto(RetrievePostDto, post)

	res.status(200).json(result)
})

export const updatePost = asyncHandler(async (req: Request, res: Response) => {
	const { id } = req.params
})

export const deletePost = asyncHandler(async (req: Request, res: Response) => {
	const { id } = req.params

	// Remove post alone
	const post = await prisma.post.delete({
		where: {
			id,
		},
	})

	// Remove post's images (body)
	post.body.forEach((imageUrl) => {
		unlink(`public/${imageUrl}`, (err) => {
			if (err) {
				throw new HttpException(500, "Cannot delete post's image")
			}
		})
	})

	// Remove all comments
	await prisma.comment.deleteMany({
		where: {
			postId: post.id,
		},
	})

	res.status(200).json(post.id)
})
