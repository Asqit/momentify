import { User } from '../auth/auth.types';
import { Post } from '../posts/posts.types';

export type CreateCommentPayload = {
	value: string;
	authorId: string;
	postId: string;
};

export type UpdateCommentPayload = {
	id: string;
	value: string;
};

export type Comment = {
	id: string;
	createdAt: Date;
	updatedAt?: Date;
	value: string;
	authorId: string;
	likedBy: string[];
	postId: string;
};

export type CommentWithReferences = Comment & {
	post: Post;
	author: User;
};
