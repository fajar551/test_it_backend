import { Router } from 'express';
import { saveData } from '../controllers/dataController';

const router = Router();

router.post('/save', saveData);

export default router;
