import { Trim } from 'class-sanitizer'
import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class CreatePostDto {
	@IsString()
	@IsNotEmpty()
	@Trim()
	public title?: string

	// It's no need to put `req.files` here, because here we validate only the text properties
	// For the files, we need a custom validation.

	/** This field represents a user's mongoDB `_id` property */
	@IsString()
	@IsNotEmpty()
	@Trim()
	public authorId?: string
}

export class RetrievePostDto {
	@IsString()
	@IsNotEmpty()
	@Trim()
	public title?: string

	@IsNumber()
	@IsNotEmpty()
	public likes?: number

	@IsArray()
	@IsNotEmpty()
	public body?: string[]

	@IsString()
	@IsNotEmpty()
	@Trim()
	public author?: string

	@IsArray()
	public comments?: string[]
}
