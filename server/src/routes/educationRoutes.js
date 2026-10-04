import { Router } from 'express';
import { getEducation } from '../controllers/educationController.js';
import { cacheFor } from '../middleware/cacheControl.js';

const router = Router();
router.get('/', cacheFor(60), getEducation);
export default router;
