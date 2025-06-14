import express from 'express';
import {
    deleteProduct,
    getAdminProduct,
    getAllCategories,
    getAllProducts,
    getLatestProduct,
    getProductStats,
    getSingleProduct,
    newProduct,
    updateProduct,
} from '../controllers/product.js';
import { isAdmin } from '../middlewares/auth.js';
import { multipleUpload } from '../middlewares/multer.js';
import { Product } from '../models/product.js';

const router = express.Router();

//To create a new product - /api/v1/product/new
router.post('/new', isAdmin, multipleUpload, newProduct);

//To get all products - /api/v1/product/all
router.get('/all', getAllProducts);

//To get latest 5 products - /api/v1/product/latest
router.get('/latest', getLatestProduct);

//To get all categories - /api/v1/product/categories
router.get('/categories', getAllCategories);

//To get all products of admin - /api/v1/product/admin-product
router.get('/admin-product', isAdmin, getAdminProduct);

//To get all stats of product stats - /api/v1/product/stats
router.get('/stats', getProductStats);

//To get, update and delete single product - /api/v1/product/:id
router
    .route('/:id')
    .get(getSingleProduct)
    .put(isAdmin, multipleUpload, updateProduct)
    .delete(isAdmin, deleteProduct);

export default router;
