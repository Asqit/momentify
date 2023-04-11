import { Router } from 'express';
import { protectedRoute } from '~/middlewares';
import { getUser, toggleFollowUser } from './user.service';

const router = Router();

router.get('/:id', protectedRoute, getUser);
router.put('/follow', protectedRoute, toggleFollowUser);

export default router;
