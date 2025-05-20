import mongoose, { Schema, model, Document } from 'mongoose';

export interface IReview {
    id?: string;
    productId: string;
    userName: string;
    rating: number;
    comment: string;
    date: Date;
    isGenuine?: boolean;
}

const reviewSchema = new mongoose.Schema<IReview>({
    productId: {
        type: String,
        ref: 'Product',
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    isGenuine: {
        type: Boolean,
        default: false
    }
});

export const Review = model<IReview>('Review', reviewSchema);