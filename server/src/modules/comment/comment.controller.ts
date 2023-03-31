import { Router } from 'express';
import { protectedRoute } from '~/middlewares';

const router = Router();

router.post('/', protectedRoute); // user creates a comment             C
router.get('/post/:id', protectedRoute); // get all comments relative to specific post R
router.put('/:id', protectedRoute); // user updates a comment           U
router.get('/:id', protectedRoute); // get specific comment             U
router.delete('/:id', protectedRoute); // user deletes a comment        D

export default router;
