import { Router } from 'express';
import { createContactMessage } from '../controllers/contactController.js';
import { noStore } from '../middleware/cacheControl.js';
import { contactLimiter } from '../middleware/rateLimiters.js';
import { validateContact } from '../middleware/validateContact.js';

const router = Router();
router.post('/', noStore, contactLimiter, validateContact, createContactMessage);
export default router;
