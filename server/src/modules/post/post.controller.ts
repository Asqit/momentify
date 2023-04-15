import { protectedRoute, validateRequest } from '~/middlewares';
import * as service from './post.service';
import { uploadPostBody } from '~/utils/multer';
import { Router } from 'express';
import { postCreationSchema } from './post.validation';

const router = Router();

// Post creation
router.post('/', uploadPostBody, validateRequest(postCreationSchema), service.createPost);

// Toggle user's like
router.put('/like/:id/:authorId', protectedRoute, service.likePost);

// Get single post (detailed view)
router.get('/:id', protectedRoute, service.getPost);

// Get all posts by user
router.get('/posts/:authorId', protectedRoute, service.getAuthorPosts);

// Get feed
router.get('/posts/feed/person', protectedRoute, service.getPersonFeed);

// Get personalized feed
router.get('/posts/feed/global/', protectedRoute, service.getGlobalFeed);

// Author deletes post
router.delete('/:id', protectedRoute, service.deletePost);

export default router;
