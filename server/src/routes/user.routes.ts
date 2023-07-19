import { Router } from 'express';
import { validateRequest } from '~/middlewares';
import {
	changeBio,
	changeProfilePicture,
	deleteUser,
	getUser,
	toggleFollowUser,
} from '~/services/user.service';
import { Jwt } from '~/utils/Jwt';
import { logger } from '~/utils/logger';
import { upload } from '~/utils/multer';
import { changeBioSchema } from '~/validation/user.validation';

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

userRoutes.put(
	'/:userId/bio',
	Jwt.protectedRoute(),
	validateRequest(changeBioSchema),
	changeBio,
);

userRoutes.delete('/:id', Jwt.protectedRoute(), deleteUser);

export { userRoutes };
