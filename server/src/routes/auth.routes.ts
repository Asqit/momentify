import * as service from '../services/auth.service';
import { Router } from 'express';
import { Jwt } from '../utils/Jwt';
import { validateRequest } from '../middlewares';
import {
	changePasswordSchema,
	loginSchema,
	registerSchema,
} from '../validation/auth.validation';

const authRoutes = Router();

// Register endpoint
authRoutes.post('/', validateRequest(registerSchema), service.register);

// Login endpoint
authRoutes.post('/login', validateRequest(loginSchema), service.login);

// Endpoint to actually verify email
authRoutes.get('/verify/email/:token', service.verifyEmail);

// User wants to change his/her password
authRoutes.put(
	'/issue/password',
	Jwt.protectedRoute(),
	validateRequest(changePasswordSchema),
	service.issuePassword,
);

// User wants to manually verify his/her email
authRoutes.get('/issue/email/:email', Jwt.protectedRoute(), service.issueEmail);

// Client requests token refresh (both access and refresh)
authRoutes.get('/refresh', service.refreshToken);

export { authRoutes };
