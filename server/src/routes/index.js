import { Router } from 'express';
import contactRoutes from './contactRoutes.js';
import educationRoutes from './educationRoutes.js';
import experienceRoutes from './experienceRoutes.js';
import healthRoutes from './healthRoutes.js';
import profileRoutes from './profileRoutes.js';
import projectsRoutes from './projectsRoutes.js';
import skillsRoutes from './skillsRoutes.js';

const router = Router();

router.use('/health', healthRoutes);
router.use('/profile', profileRoutes);
router.use('/skills', skillsRoutes);
router.use('/projects', projectsRoutes);
router.use('/education', educationRoutes);
router.use('/experience', experienceRoutes);
router.use('/contact', contactRoutes);

export default router;
