import { Request, Response } from 'express';
import Notification from '../models/notification.js';

// GET /api/v1/notification
export const getNotifications = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        console.log("user id", userId)
        if (!userId){
          res.status(401).json({ message: 'Unauthorized' });
            return
        }

        const notifications = await Notification.find({ userId })
            .sort({ createdAt: -1 })
            .limit(50);

        res.status(200).json(notifications);
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ message: 'Failed to fetch notifications' });
    }
};

// POST /api/v1/notification
export const createNotification = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return
        } 

        const { type, title, message, metadata } = req.body;

        if (!type || !title || !message) {
             res.status(400).json({ message: 'Missing required fields' });
            return
        }

        const notification = new Notification({
            userId,
            type,
            title,
            message,
            metadata,
            isRead: false,
            timestamp: new Date()
        });

        const savedNotification = await notification.save();
        
        // Emit real-time notification if socket is available
        req.io?.emit(`notifications:${userId}`, savedNotification);

        res.status(201).json(savedNotification);
    } catch (error) {
        console.error('Error creating notification:', error);
        res.status(500).json({ message: 'Failed to create notification' });
    }
};

// PATCH /api/v1/notification/:id/read
export const markAsRead = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updated = await Notification.findByIdAndUpdate(id, { isRead: true }, { new: true });

        if (!updated) {
             res.status(404).json({ message: 'Notification not found' });
            return
        }

        res.status(200).json(updated);
    } catch (error) {
        console.error('Error marking notification as read:', error);
        res.status(500).json({ message: 'Failed to update notification' });
    }
};
