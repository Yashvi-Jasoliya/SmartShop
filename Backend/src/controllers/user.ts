import { NextFunction, Request, Response } from "express";
import { User } from "../models/user.js";
import { NewUserRequestBody } from "../types/types.js";
import { TryCatch } from "../middlewares/error.js";
import errorHandler from "../utils/utilityClass.js";
import bcrypt from "bcrypt";
import admin from "firebase-admin";
import { socketIO } from '../app.js';

export const registerUser = async (req: Request, res: Response) => {
    try {
        const { name, email, password, gender, dob, photo } = req.body;

        if (!name || !email || !password || !gender || !dob || !photo) {
            res.status(400).json({ message: "All fields are required" });
            return
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(409).json({ message: "User already exists" });
            return
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            email,
            password: hashedPassword,
            gender,
            dob,
            photo: "https://example.com/default-photo.png",
        });

        await user.save();

        socketIO.emit('notification', {
            type: 'Transaction',
            message: `New user ${user.name} has registered`,
            time: new Date(),
        });

        res.status(201).json({ message: "User registered successfully", user });
    } catch (error) {
        console.error("Register error:", error);
        res.status(500).json({ message: "Internal server error" });
        return;
    }
};

// validateTokenAndRespond.ts
export const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        console.log(email, password)

        if (!email || !password) {
            res.status(400).json({ message: "Email and password are required" });
            return;
        }

        const user = await User.findOne({ email });
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        console.log(user, email)

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(401).json({ message: "Invalid credentials" });
            return;
        }

        res.status(200).json({
            success: true,
            message: `Welcome back, ${user.name}`,
            user,
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const newUser = TryCatch(
    async (
        req: Request<{}, {}, NewUserRequestBody>,
        res: Response,
        next: NextFunction
    ) => {
        const { name, email, gender, photo, _id, dob } = req.body;

        let user = await User.findById(_id);

        if (user)
            return res.status(200).json({
                success: false,
                message: `Welcome back, ${user.name}`,
            });

        if (!_id || !name || !email || !gender || !photo || !dob)
            return next(new errorHandler("All fields are required", 400));

        user = await User.create({
            name,
            email,
            gender,
            photo,
            _id,
            dob: new Date(dob),
        });

        socketIO.emit('notification', {
            type: 'Transaction',
            message: `New user ${user.name} has registered 👤`,
            time: new Date(),
        });

        res.status(201).json({
            success: true,
            message: `Welcome, ${user.name} at Ecommerce`,
        });
    }
);

export const getAllUsers = TryCatch(
    async (req: Request, res: Response, next: NextFunction) => {
        const users = await User.find();
        return res.status(200).json({
            success: true,
            users,
        });
    }
);

export const getUser = TryCatch(
    async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;

        const user = await User.findById(id);

        if (!user) return next(new errorHandler("User not found", 404));

        return res.status(200).json({
            success: true,
            user,
        });
    }
);

export const deleteUser = TryCatch(
    async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;

        const user = await User.findById(id);

        if (!user) return next(new errorHandler("User not found", 404));

        await user.deleteOne();

        return res.status(200).json({
            success: true,
            message: "User deleted successfully",
        });
    }
);
