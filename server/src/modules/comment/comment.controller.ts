import * as services from './comment.service';
import { protectedRoute, validateRequest } from '~/middlewares';
import { commentCreationSchema, commentUpdateSchema } from './comment.validation';
import { Router } from 'express';

const router = Router();

// User creates a new comment
router.post(
	'/',
	protectedRoute,
	validateRequest(commentCreationSchema),
	services.createComment,
);

// Get all post comments
router.get('/post/:id', protectedRoute, services.getPostComments);

// User updates his comment
router.put(
	'/:id',
	protectedRoute,
	validateRequest(commentUpdateSchema),
	services.updateComment,
);

// Get specific comment
router.get('/:id', protectedRoute, services.getComment);

// User deletes a comment
router.delete('/:id', protectedRoute, services.deleteComment);

export default router;
