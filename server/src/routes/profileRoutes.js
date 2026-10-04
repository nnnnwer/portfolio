import { Router } from 'express';
import { getProfile } from '../controllers/profileController.js';
import { cacheFor } from '../middleware/cacheControl.js';

const router = Router();
router.get('/', cacheFor(60), getProfile);
export default router;
