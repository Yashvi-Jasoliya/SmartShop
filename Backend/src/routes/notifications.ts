import express from 'express';
import { getNotifications, markAllAsRead, markOneAsRead } from '../controllers/notifications.js';
import { Notification } from '../models/notifications.js';

const router = express.Router();

router.get('/:userId', async (req, res) => {
    const notifications = await Notification.find({ userId: req.params.userId }).sort({ timestamp: -1 });
    res.json(notifications);
});
router.patch('/:id/read', async (req, res) => {
    await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
    res.sendStatus(200);
});

router.post('/mark-all-read/:userId', async (req, res) => {
    await Notification.updateMany({ userId: req.params.userId }, { isRead: true });
    res.sendStatus(200);
})

export default router;
