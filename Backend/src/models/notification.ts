// server/models/Notification.ts
import mongoose, { Document, Schema } from 'mongoose';

interface INotification extends Document {
    userId: string;
    type: string;
    title: string;
    message: string;
    metadata?: any;
    isRead: boolean;
    createdAt: Date;
}

const NotificationSchema: Schema = new Schema({
    userId: { type: String, required: true },
    type: { type: String, required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    metadata: { type: Schema.Types.Mixed },
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<INotification>('Notification', NotificationSchema);