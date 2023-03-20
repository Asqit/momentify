import * as service from './auth.service';
import { Router } from 'express';
import { dtoValidation } from '~/middlewares';
import { AuthDto } from './auth.dto';

const router = Router();

router.post('/', dtoValidation(AuthDto), service.register);
router.post('/login', dtoValidation(AuthDto, true), service.login);

// TODO: Add token-based email verification
router.get('/verify/:token', service.verifyEmail);

export default router;
