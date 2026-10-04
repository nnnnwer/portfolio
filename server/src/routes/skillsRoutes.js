import { Router } from 'express';
import { getSkills } from '../controllers/skillsController.js';
import { cacheFor } from '../middleware/cacheControl.js';

const router = Router();
router.get('/', cacheFor(60), getSkills);
export default router;
