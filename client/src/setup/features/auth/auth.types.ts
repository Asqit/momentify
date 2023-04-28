import { Post } from '../posts/posts.types';

/**
 * This interface represents a user object sent to here by server-side
 * it is strapped of any crucial details.
 */
export type User = {
	id: string;
	email: string;
	username: string;
	profilePicture: string | null;
	verified: boolean;
	followersIds: string[];
	followingIds: string[];
};

/**
 * An interface representing a user with all references to his posts, followers and who is he/she following.
 */
export type UserWithReferences = User & {
	followers: User[];
	following: User[];
	posts: Post[];
};

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
	i18ClientKey?: string;
}

export interface RegisterResponse {
	message: string;
}

export function isHttpException(test: unknown): test is AuthErrorResponse {
	return (
		(test as AuthErrorResponse).message !== undefined &&
		typeof (test as AuthErrorResponse).message === 'string' &&
		(test as AuthErrorResponse).statusCode !== undefined &&
		typeof (test as AuthErrorResponse).statusCode === 'number'
	);
}
