import { Request, Response } from 'express';
import { IReview, Review } from '../models/review.js';
import { isGenuineReview } from '../utils/reviewUtils.js';
import { Product } from '../models/product.js';
import { socketIO } from '../app.js';
import { Notification } from '../models/notifications.js';
import mongoose from 'mongoose';
import { Order } from '../models/order.js';

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

export const createReview = async (req: Request, res: Response) => {
    try {
        const { productId, userName, rating, comment, date } = req.body;

        if (!productId || !userName || !rating || !comment) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // verified
        const hasPurchased = await Order.exists({
            "orderItems.productId": productId,
            status: "Delivered"
        });

        if (!hasPurchased) {
            return res.status(403).json({
                message: "Only customers who purchased this product can review"
            });
        }
        const isGenuine = await isGenuineReview({ comment, rating }, product);

        const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

        const newReview = new Review({
            productId,
            userName,
            rating,
            comment,
            date: date ? new Date(date) : new Date(),
            isGenuine,
            image: imagePath,
        });

        const savedReview = await newReview.save();

        const newNotif = await Notification.create({
            userId: "admin",
            type: "review",
            title: "New Review",
            message: `New review added by ${userName} on product ${product.name}`,
            timestamp: new Date(),
            isRead: false,
        });

        socketIO.emit("notification", newNotif);
        console.log("notification emmited ", newNotif)

        return res.status(201).json(savedReview);
    } catch (error) {
        console.error("Error creating review:", error);
        return res.status(500).json({ message: "Failed to create review" });
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

// Get review stats
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

export const getFilteredReviews = async (req: Request, res: Response) => {
    try {
        const { category, filter, page = 1, limit = 8, search = "" } = req.query;

        let productFilter: any = {};
        if (category && category !== "all") {
            productFilter.category = category;
        }

        const productIds = await Product.find(productFilter).select("_id");

        let reviewFilter: any = {
            productId: { $in: productIds.map((p) => p._id) },
        };

        if (filter === "genuine") reviewFilter.isGenuine = true;
        else if (filter === "fake") reviewFilter.isGenuine = false;

        if (search) {
            const matchingProducts = await Product.find({
                name: { $regex: search, $options: "i" },
            }).select("_id");

            const matchedIds = matchingProducts.map((p) =>
                new mongoose.Types.ObjectId(p._id)
            );
            reviewFilter.productId.$in = reviewFilter.productId.$in.filter((id: any) =>
                matchedIds.some((matchId) => matchId.equals(id))
            );
        }

        const total = await Review.countDocuments(reviewFilter);
        const totalPages = Math.ceil(total / Number(limit));
        const reviews = await Review.find(reviewFilter)
            .sort({ date: 1 })
            .skip((+page - 1) * +limit)
            .limit(+limit);

        res.status(200).json({ reviews, total, totalPages });
    } catch (error) {
        console.error("Failed to fetch filtered reviews", error);
        res.status(500).json({ message: "Server Error" });
    }
};


export const deleteAllfakereviews = async (req: Request, res: Response) => {
    try {
        const result = await Review.deleteMany({ isGenuine: false });
        res.status(200).json({ message: "All fake reviews deleted", deletedCount: result.deletedCount });
    } catch (err) {
        res.status(500).json({ message: "Failed to delete fake reviews" });
    }
};