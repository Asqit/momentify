import * as service from '../services/authService';
import { Router } from 'express';
import { dtoValidation } from '../middlewares';
import { AuthDto } from '../dto/auth.dto';

const router = Router();

router.post('/', dtoValidation(AuthDto), service.register);

router.post('/login', dtoValidation(AuthDto, true), service.login);

export default router;
