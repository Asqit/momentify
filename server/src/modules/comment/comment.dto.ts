import { Trim } from 'class-sanitizer'
import { IsNotEmpty, IsNumberString, IsString } from 'class-validator'

export class CreateCommentDto {
	@IsString()
	@IsNotEmpty()
	@Trim()
	public value?: string

	@IsString()
	@IsNotEmpty()
	@Trim()
	public author?: string
}

export class RetrieveCommentDto {
	@IsString()
	@IsNotEmpty()
	@Trim()
	public id?: string

	@IsNumberString()
	@IsNotEmpty()
	@Trim()
	public createAt?: number

	@IsString()
	@IsNotEmpty()
	@Trim()
	public value?: string
	@IsString()
	@IsNotEmpty()
	@Trim()
	public author?: string
}
