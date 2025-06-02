import express from 'express';
import {
    deleteUser,
    getAllUsers,
    getUser,
    newUser,
} from "../controllers/user.js";
import { isAdmin } from "../middlewares/auth.js";
import {createReview, deleteReview, getAllReviews, getProductReviews, getstats, updateReview } from '../controllers/review.js';
import { singleUpload } from "../middlewares/reviewmulter.js";

const router = express.Router();

// router.post('/', createReview);

router.post("/", singleUpload, createReview);

router.put('/:id', updateReview);
router.get('/all', getAllReviews);
router.delete('/:id', deleteReview);
router.get('/stats',getstats);

router.get("/:productId", getProductReviews);

export default router;
