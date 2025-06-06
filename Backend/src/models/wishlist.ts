import mongoose, { Schema } from 'mongoose';
import { Product } from './product.js';

const wishlistSchema = new mongoose.Schema(
    {
        user: {
            type: String,
            ref: 'User', 
            required: [true, 'User ID is required'],
            unique: true,
        },
        items: [
            {
                product: {
                    type: Schema.Types.ObjectId,
                    ref: 'Product', 
                    required: [true, 'Product ID is required'],
                },
                addedAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

wishlistSchema.virtual('products', {
    ref: 'Product',
    localField: 'items.product',
    foreignField: '_id',
    justOne: false,
});

export const Wishlist = mongoose.model('Wishlist', wishlistSchema);
