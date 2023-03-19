import { Trim } from 'class-sanitizer'
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator'

export class AuthDto {
	@IsEmail({}, { message: 'Provided email is not valid' })
	@Trim()
	public email?: string

	@IsString()
	@IsNotEmpty()
	@Trim()
	public username?: string

	@IsString()
	@MinLength(8, { message: 'Password should be minimum of 9 characters' })
	@Trim()
	public password?: string
}
