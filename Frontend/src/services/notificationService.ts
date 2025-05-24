// src/services/notificationService.ts
import io from 'socket.io-client';
import type { Socket } from 'socket.io-client';
import type { Notification } from '../types/types';

class NotificationService {
    private socket: typeof Socket | null = null;
    private apiBaseUrl: string;

    constructor() {
        this.apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    }

    connect(userId: string) {
        this.socket = io(this.apiBaseUrl, {
            transports: ['websocket'],
            autoConnect: true,
            auth: { userId },
        });
    }

    disconnect() {
        this.socket?.disconnect();
    }

    subscribe(callback: (notification: Notification) => void) {
        this.socket?.on('notification', callback);
        return () => this.socket?.off('notification', callback);
    }

    async getNotifications(userId: string): Promise<Notification[]> {
        const response = await fetch(`${this.apiBaseUrl}/api/notifications?userId=${userId}`);
        console.log(userId)
        if (!response.ok) throw new Error('Failed to fetch notifications');
        return await response.json();
    }

    async markAsRead(id: string): Promise<void> {
        await fetch(`${this.apiBaseUrl}/api/notifications/${id}/read`, {
            method: 'PATCH',
            credentials: 'include',
        });
    }

    getNotificationIcon(type: string) {
        switch (type) {
            case 'new_review':
                return { icon: '⭐', color: '#f59e0b' };
            case 'transaction':
                return { icon: '💰', color: '#10b981' };
            case 'user_registration':
                return { icon: '👤', color: '#3b82f6' };
            case 'user_login':
                return { icon: '🔑', color: '#8b5cf6' };
            case 'system':
                return { icon: '⚙️', color: '#64748b' };
            default:
                return { icon: '🔔', color: '#6b7280' };
        }
    }
}

export const notificationService = new NotificationService();
