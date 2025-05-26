import { Request, Response } from 'express';
import { IReview, Review } from '../models/review.js';
import { isGenuineReview } from '../utils/reviewUtils.js';
import { Product } from '../models/product.js';
import { socketIO } from '../app.js';

// Get product reviews
export const getProductReviews = async (req: Request, res: Response) => {
    try {
        const { productId } = req.params;
        const reviews = await Review.find({ productId }).sort({ date: -1 });
         res.status(200).json(reviews);
        return;
    } catch (error) {
        console.error("Error getting reviews:", error);
        res.status(500).json({ message: "Failed to fetch reviews" });
        return;
    }
};

// Create a new review with genuine check
export const createReview = async (req: Request, res: Response) => {
    try {
        const { productId, userName, rating, comment, date } = req.body;

        if (!productId || !userName || !rating || !comment) {
             res.status(400).json({ message: "All fields are required" });
            return;
        }

        // Get product details for genuine check
        const product = await Product.findById(productId);
        if (!product) {
             res.status(404).json({ message: "Product not found" });
            return;
        }

        // Run genuine review check
        const isGenuine = isGenuineReview(
            { comment, rating, date: date ? new Date(date) : new Date(), reviewer: userName },
            { name: product.name, brand: product.brand }
        );

        const newReview = new Review({
            productId,
            userName,
            rating,
            comment,
            date: date ? new Date(date) : new Date(),
            isGenuine,
        });

        socketIO.emit('notification', {
            type: 'review',
            message: `New review added by ${userName || 'a user'} on Product ${product.name} ⭐`,
            time: new Date(),
        });

        const savedReview = await newReview.save();
        res.status(201).json(savedReview);

    } catch (error) {
        console.error("Error creating review:", error);
        res.status(500).json({ message: "Failed to create review" });
    }
};

// Update a review
export const updateReview = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updateData: Partial<IReview> = req.body;

        updateData.date = new Date();

        const updatedReview = await Review.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        });

        if (!updatedReview) {
             res.status(404).json({ message: 'Review not found' });
            return
        }

        res.json(updatedReview);
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ message: error.message });
        } else {
            res.status(400).json({ message: 'Unknown error occurred' });
        }
    }
};

// Get all reviews
export const getAllReviews = async (req: Request, res: Response) => {
    try {
        const reviews = await Review.find();
        res.status(200).json(reviews);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Unknown error occurred' });
        }
    }
};

// Delete a review
export const deleteReview = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const deletedReview = await Review.findByIdAndDelete(id);

        if (!deletedReview) {
             res.status(404).json({ message: 'Review not found' });
            return
        }

        res.status(200).json({ message: 'Review deleted successfully' });
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Unknown error occurred' });
        }
    }
};

// Get review stats: total, genuine, fake counts
export const getstats = async (req: Request, res: Response) => {
    try {
        const total = await Review.countDocuments();
        const genuine = await Review.countDocuments({ isGenuine: true });
        const fake = await Review.countDocuments({ isGenuine: false });

        res.status(200).json({ total, genuine, fake });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch review stats' });
    }
};
