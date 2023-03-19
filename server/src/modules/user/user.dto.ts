import { User } from '@prisma/client'
import { Trim } from 'class-sanitizer'
import { plainToInstance } from 'class-transformer'
import { IsArray, IsEmail, IsNotEmpty, IsString } from 'class-validator'

/** this class represents a transferable `User` model */
export class UserDto {
	public id?: string
	public email?: string
	public username?: string
	public followers?: string[]
	public following?: string[]
	public posts?: string[]
}
