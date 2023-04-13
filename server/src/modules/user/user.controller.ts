import { Router } from 'express';
import { protectedRoute } from '~/middlewares';
import { getUser, toggleFollowUser } from './user.service';

const router = Router();

// Get user details
router.get('/:id', protectedRoute, getUser);

// Follow/Unfollow user
router.put('/follow', protectedRoute, toggleFollowUser);

// Change user picture
router.put('/');

export default router;
