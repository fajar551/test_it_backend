import { Router } from 'express';
import { register, loginPassword, loginToken } from '../controllers/authController';

const router = Router();

router.post('/register', register);
router.post('/login-password', loginPassword);
router.post('/login-token', loginToken);

export default router;
