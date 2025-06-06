import { Request, Response } from 'express';
import Subscriber from '../models/subscriber.js';
import { sendSubscriptionMail } from '../utils/sendMailer.js';

// POST /api/subscribe
export const subscribeUser = async (req: Request, res: Response) => {
    const { email } = req.body;

    if (!email) {
         res.status(400).json({ message: 'Email is required' });
        return
    }

    try {
        const existing = await Subscriber.findOne({ email });
        if (existing) {
             res.status(400).json({ message: 'Already subscribed' });
            return
        }

        const newSubscriber = new Subscriber({ email });
        await newSubscriber.save();

        // Send confirm email
        await sendSubscriptionMail(email);

        res.status(201).json({ message: 'Subscribed successfully' });
    } catch (error) {
        console.error('Subscribe Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// GET /api/subscribe
export const getSubscribers = async (_req: Request, res: Response) => {
    try {
        const subscribers = await Subscriber.find();
        res.status(200).json(subscribers);
    } catch (error) {
        console.error('Fetch Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
