import { Router } from 'express';
import { getDatabaseHealth, getHealth } from '../controllers/healthController.js';
import { noStore } from '../middleware/cacheControl.js';

const router = Router();
router.get('/', noStore, getHealth);
router.get('/db', noStore, getDatabaseHealth);
export default router;
