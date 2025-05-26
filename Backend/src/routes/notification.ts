import express from 'express';
import { getNotifications, createNotification, markAsRead } from '../controllers/notification.js';
import { isAdmin } from '../middlewares/auth.js';

const router = express.Router();

// Must be authenticated for all notification routes
router.use(isAdmin);

router.get('/', isAdmin, getNotifications);
router.post('/', isAdmin, createNotification);
router.patch('/:id/read', isAdmin, markAsRead);

export default router;
