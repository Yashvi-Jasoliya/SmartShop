import { useEffect, useState } from 'react';
import { Notification } from '../types/types';
import { notificationService } from '../services/notificationService';

export const useNotifications = (userId: string) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        if (!userId) return; 
        notificationService.connect(userId);
        notificationService.getNotifications(userId).then((data) => {
            setNotifications(data);
            setLoading(false);
        });

        const unsubscribe = notificationService.subscribe((notification) => {
            setNotifications((prev) => [notification, ...prev]);
        });

        return () => {
            unsubscribe();
            notificationService.disconnect();
        };
    }, [userId]);
    const unreadCount = notifications.filter((n) => !n.isRead).length;

    const markAsRead = async (id: string) => {
        await notificationService.markAsRead(id);
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
        );
    };

    const markAllAsRead = async () => {
        try {
            setLoading(true);
            await fetch(`/api/notifications/mark-all-read/${userId}`, {
                method: 'POST',
            });
            setNotifications((prev) =>
                prev.map((notif) => ({ ...notif, isRead: true }))
            );
        } catch (err) {
            console.error("Failed to mark all as read:", err);
        } finally {
            setLoading(false);
        }
    };


    return { notifications, unreadCount, loading, markAsRead, markAllAsRead };
};