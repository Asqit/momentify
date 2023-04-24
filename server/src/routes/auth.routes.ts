import * as service from '~/services/auth.service';
import { Router } from 'express';
import { Jwt } from '~/utils/Jwt';
import { validateRequest } from '~/middlewares';
import {
	changePasswordSchema,
	loginSchema,
	registerSchema,
} from '~/validation/auth.validation';

const authRoutes = Router();

authRoutes.post('/', validateRequest(registerSchema), service.register);
authRoutes.post('/login', validateRequest(loginSchema), service.login);
authRoutes.get('/verify/email/:token', service.verifyEmail);
authRoutes.put(
	'/issue/password',
	Jwt.protectedRoute(),
	validateRequest(changePasswordSchema),
	service.issuePassword,
);
authRoutes.get('/issue/email/:email', Jwt.protectedRoute(), service.issueEmail);

export { authRoutes };
