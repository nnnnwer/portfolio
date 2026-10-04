import { Router } from 'express';
import { getExperience } from '../controllers/experienceController.js';
import { cacheFor } from '../middleware/cacheControl.js';

const router = Router();
router.get('/', cacheFor(60), getExperience);
export default router;
