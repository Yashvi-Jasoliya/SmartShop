import { Request, Response } from 'express';
import { Notification } from '../models/notifications.js';

export const getNotifications = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const notifications = await Notification.find({ userId }).sort({ timestamp: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch notifications' });
  }
};

export const markAllAsRead = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    await Notification.updateMany({ userId, isRead: false }, { isRead: true });
    res.status(200).json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to mark as read' });
  }
};

export const markOneAsRead = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await Notification.findByIdAndUpdate(id, { isRead: true });
    res.status(200).json({ message: 'Notification marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to mark notification as read' });
  }
};
