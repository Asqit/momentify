import { Router } from 'express';
import { protectedRoute } from '~/middlewares';
import { changeProfilePicture, getUser, toggleFollowUser } from './user.service';
import { upload } from '~/utils/multer';

const router = Router();

// Get user details
router.get('/:id', protectedRoute, getUser);

// Follow/Unfollow user
router.put('/follow', protectedRoute, toggleFollowUser);

// Change user picture
router.put('/:id/image', protectedRoute, upload.single('file'), changeProfilePicture);

export default router;
