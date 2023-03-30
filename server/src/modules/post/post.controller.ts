import { protectedRoute } from '~/middlewares';
import * as service from './post.service';
import { upload } from '~/utils/multer';
import { Router } from 'express';

const router = Router();

router.post('/', protectedRoute, upload, service.createPost);
router.put('/:id', protectedRoute, service.updatePost);
router.delete('/:id', protectedRoute, service.deletePost);
router.get('/:id', protectedRoute, service.getPost);
router.get('/posts/:authorId', protectedRoute, service.getAuthorPosts);

export default router;
