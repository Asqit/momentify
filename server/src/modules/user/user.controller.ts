import { Router } from 'express';
import { protectedRoute } from '~/middlewares';

const router = Router();

router.get('/:id', protectedRoute);
router.put('/follow', protectedRoute);

export default router;
