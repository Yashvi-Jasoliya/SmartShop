// utils/sendMail.ts
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const sendSubscriptionMail = async (to: string) => {
    await transporter.sendMail({
        from: `"SmartShop" <${process.env.EMAIL_USER}>`,
        to,
        subject: 'Thanks for subscribing!',
        html: `<h2>🎉 Thank you for subscribing to our Smartshop website!! 🛍️</h2><p>We'll keep you updated with our latest offers and products.</p>`,
    });
};



