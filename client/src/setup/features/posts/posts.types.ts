import { User } from '~/setup/features/auth/auth.types';

/** POST body for creating a new post. (`body: string[]` is array of images) */
export type CreatePostBody = {
	title: string;
	files: FormData;
};

/** Structure of singular post */
export type Post = {
	id: string;
	title: string;
	likedBy: string[];
	authorId: string;
	author: User;
	body: string[];
	createdAt: Date;
};
