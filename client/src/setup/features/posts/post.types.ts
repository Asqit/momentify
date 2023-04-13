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
	body: string[];
	createdAt: Date;
};
