import * as service from './auth.service';
import { Router } from 'express';
import { protectedRoute } from '~/middlewares';
import { validateRequest } from '~/middlewares';
import { changePasswordSchema, loginSchema, registerSchema } from './auth.validation';

const router = Router();

router.post('/', validateRequest(registerSchema), service.register);
router.post('/login', validateRequest(loginSchema), service.login);
router.get('/verify/email/:token', service.verifyEmail);
router.put(
	'/issue/password',
	protectedRoute,
	validateRequest(changePasswordSchema),
	service.issuePassword,
);
router.get('/issue/email/:email', protectedRoute, service.issueEmail);

export default router;
