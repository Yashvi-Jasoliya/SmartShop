import express from 'express';
import { isAdmin } from "../middlewares/auth.js";
import {createReview, deleteReview, getAllReviews, getFilteredReviews, getProductReviews, getstats, updateReview } from '../controllers/review.js';
import { multipleUpload, singleUpload } from "../middlewares/reviewmulter.js";

const router = express.Router();

// create review
router.post("/", multipleUpload, createReview);

// update review
router.put('/:id', isAdmin, updateReview);

// Get all reviews
router.get('/all', getAllReviews);

// delete review 
router.delete('/:id', isAdmin, deleteReview);

// stats
router.get('/stats',getstats);

// get particular product review
router.get("/:productId", getProductReviews);

// filter reviews (genuine, fake)
router.get("/", getFilteredReviews)

export default router;
