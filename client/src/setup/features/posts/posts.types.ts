import { User } from '~/setup/features/auth/auth.types';
import { Comment } from '../comments/comments.types';

/** POST body for creating a new post. (`body: string[]` is array of images) */
export type CreatePostBody = {
	title: string;
	files: FormData;
};

/** Structure of singular post without references */
export type Post = {
	id: string;
	title: string;
	likedBy: string[];
	authorId: string;
	body: string[];
	createdAt: Date;
	comments: Comment[];
};

/** Structure of a singular post, that has all references */
export type PostWithReferences = Post & {
	author: User;
};
