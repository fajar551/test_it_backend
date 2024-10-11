import { Router } from 'express';
import { executeTransaction } from '../controllers/transactionController';

const router = Router();

router.post('/execute', executeTransaction);

export default router;
