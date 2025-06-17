import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './utils/features.js';
import { errorMiddleware } from './middlewares/error.js';
import NodeCache from 'node-cache';
import morgan from 'morgan';
import Stripe from 'stripe';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import path from "path";
import { fileURLToPath } from 'url';

// Import routes
import userRoute from './routes/user.js';
import productRoute from './routes/products.js';
import orderRoute from './routes/order.js';
import paymentRoute from './routes/payment.js';
import dashboardRoute from './routes/statistics.js';
import wishlistRoute from './routes/wishlist.js';
import reviewRoute from './routes/review.js';
import notificationRoute from './routes/notifications.js';
import subscribeRoute from "./routes/subscriber.js"
import geminiRoutes from "./routes/aiAssistant.js"

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST'],
        credentials: true,
    },
});

const port = process.env.PORT || 3005;
const mongoURI = process.env.MONGO_URI || '';
const stripeKey = process.env.STRIPE_KEY || '';

export const stripe = new Stripe(stripeKey);
export const myCache = new NodeCache();
export const socketIO = io;

// DB connect
connectDB(mongoURI);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser());
app.use(
    cors({
        origin: 'http://localhost:5173',
        credentials: true,
    })
);

io.on('connection', (socket) => {
    console.log('Admin connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('Admin disconnected:', socket.id);
    });
    return;
});

app.get('/', (req, res) => {
    res.send(`Server running at http://localhost:${port}`);
});

app.use('/api/v1/user', userRoute);
app.use('/api/v1/product', productRoute);
app.use('/api/v1/order', orderRoute);
app.use('/api/v1/payment', paymentRoute);
app.use('/api/v1/dashboard', dashboardRoute);
app.use('/api/v1/review', reviewRoute);
app.use('/api/v1/wishlist', wishlistRoute);
app.use('/uploads', express.static('uploads'));
app.use('/api/notifications', notificationRoute)
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use('/api/subscribe', subscribeRoute);
app.use("/api/ai", geminiRoutes);

// Error Middleware
app.use(errorMiddleware);

// Start server
server.listen(port, () => {
    console.log(`** Server running at http://localhost:${port}`);
});
