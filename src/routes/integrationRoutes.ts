import { Router } from 'express';
import { fetchExternalData } from '../controllers/integrationController';

const router = Router();

// Rute untuk mengambil data dari API eksternal
router.get('/external-data', fetchExternalData);

export default router;
