import { protectedRoute, validateRequest } from '~/middlewares';
import * as service from './post.service';
import { upload } from '~/utils/multer';
import { Router } from 'express';
import { postCreationSchema } from './post.validation';

const router = Router();

router.post(
	'/',
	protectedRoute,
	upload,
	validateRequest(postCreationSchema),
	service.createPost,
);
router.put('/:id', protectedRoute, service.updatePost); // Author post editing
router.put('/like/:id', protectedRoute); // Random user toggle like
router.delete('/:id', protectedRoute, service.deletePost); // Author deletes posts
router.get('/:id', protectedRoute, service.getPost); // get singular post (detailed view)
router.get('/posts/:authorId', protectedRoute, service.getAuthorPosts); // get all posts created by single user

export default router;
