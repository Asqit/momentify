import * as services from '~/services/comment.service';
import { validateRequest } from '~/middlewares';
import {
	commentCreationSchema,
	commentUpdateSchema,
} from '~/validation/comment.validation';
import { Router } from 'express';
import { Jwt } from '~/utils/Jwt';

const commentRoutes = Router();

// User creates a new comment
commentRoutes.post(
	'/',
	Jwt.protectedRoute(),
	validateRequest(commentCreationSchema),
	services.createComment,
);

// Get all post comments
commentRoutes.get('/post/:id', Jwt.protectedRoute(), services.getPostComments);

// User updates his comment
commentRoutes.put(
	'/',
	Jwt.protectedRoute(),
	validateRequest(commentUpdateSchema),
	services.updateComment,
);

// Get specific comment
commentRoutes.get('/:id', Jwt.protectedRoute(), services.getComment);

// User deletes a comment
commentRoutes.delete('/:id', Jwt.protectedRoute(), services.deleteComment);

// Like comment
commentRoutes.put('/:id/like/:userId', Jwt.protectedRoute(), services.likeComment);

export { commentRoutes };
