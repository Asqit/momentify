import { validateRequest } from '~/middlewares';
import * as service from '~/services/post.service';
import { uploadPostBody } from '~/utils/multer';
import { Router } from 'express';
import { postCreationSchema } from '~/validation/post.validation';
import { Jwt } from '~/utils/Jwt';

const postRoutes = Router();

// Post creation
postRoutes.post(
	'/',
	uploadPostBody,
	validateRequest(postCreationSchema),
	service.createPost,
);

// Toggle user's like
postRoutes.put('/:id/like/:userId', Jwt.protectedRoute(), service.likePost);

// Get single post (detailed view)
postRoutes.get('/:id', Jwt.protectedRoute(), service.getPost);

// Get all posts
postRoutes.get('/', Jwt.protectedRoute(), service.getAllPosts);

// Get all posts by user
postRoutes.get('/posts/:authorId', Jwt.protectedRoute(), service.getAuthorPosts);

// Get personalized feed
postRoutes.get('/feed/person', Jwt.protectedRoute(), service.getPersonFeed);

// Get global feed (explore)
postRoutes.get('/feed/global/', Jwt.protectedRoute(), service.getGlobalFeed);

// Create a comment
postRoutes.put('/:id/comment', Jwt.protectedRoute());

// Author deletes post
postRoutes.delete('/:id', Jwt.protectedRoute(), service.deletePost);

export { postRoutes };
