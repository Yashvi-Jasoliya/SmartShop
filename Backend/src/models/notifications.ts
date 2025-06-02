import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    type: { type: String, required: true },
    title: { type: String },
    message: { type: String, required: true },
    metadata: { type: Object },
    isRead: { type: Boolean, default: false },
    timestamp: { type: Date, default: Date.now },
});

export const Notification = mongoose.model('Notification', notificationSchema);
