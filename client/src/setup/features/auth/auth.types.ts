import { Post } from '../posts/post.types';

/**
 * This interface represents a user object sent to here by server-side
 * it is strapped of any crucial details.
 */
export interface User {
	id: string;
	email: string;
	username: string;

	/** An array of post ids */
	posts: Post[];

	/** An array of user ids */
	following: User[];

	/** An array of user ids */
	followers: User[];
}

export interface ChangePasswordBody {
	password: string;
	newPassword: string;
}

export interface LoginCredentials {
	email: string;
	password: string;
}

export interface RegisterCredentials extends LoginCredentials {
	username: string;
}

export interface LoginResponse {
	user: User;
	accessToken: string;
}

export interface AuthState {
	user: User | null;
	accessToken: string;
}

export interface AuthErrorResponse {
	message: string;
	statusCode: number;
	stack?: string;
}

export interface RegisterResponse {
	message: string;
}

export function isAuthErrorResponse(test: unknown): test is AuthErrorResponse {
	return (
		(test as AuthErrorResponse).message !== undefined &&
		typeof (test as AuthErrorResponse).message === 'string' &&
		(test as AuthErrorResponse).statusCode !== undefined &&
		typeof (test as AuthErrorResponse).statusCode === 'number'
	);
}
