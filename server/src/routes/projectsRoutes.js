import { Router } from 'express';
import { getProjectById, getProjects } from '../controllers/projectsController.js';
import { cacheFor } from '../middleware/cacheControl.js';

const router = Router();
router.get('/', cacheFor(60), getProjects);
router.get('/:id', cacheFor(60), getProjectById);
export default router;
