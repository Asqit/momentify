import { Router } from 'express';
import {
	changeProfilePicture,
	deleteUser,
	getUser,
	toggleFollowUser,
} from '~/services/user.service';
import { Jwt } from '~/utils/Jwt';
import { upload } from '~/utils/multer';

const userRoutes = Router();

// Get user details
userRoutes.get('/:id', Jwt.protectedRoute(), getUser);

// Follow/Un-follow user
userRoutes.put('/:userId/follow/:followerId', Jwt.protectedRoute(), toggleFollowUser);

// Change user picture
userRoutes.put(
	'/:id/image',
	Jwt.protectedRoute(),
	upload.single('file'),
	changeProfilePicture,
);

userRoutes.delete('/:id', Jwt.protectedRoute(), deleteUser);

export { userRoutes };
