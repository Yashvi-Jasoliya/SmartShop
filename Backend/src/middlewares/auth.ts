import { NextFunction, Request, Response } from "express";
import errorHandler from "../utils/utilityClass.js";
import { User } from "../models/user.js";
import jwt from "jsonwebtoken";

//middleware to check if user is admin only
export const isAdmin = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { id } = req.query;

    if (!id) return next(new errorHandler("Login first", 401));

    const user = await User.findById(id);

    if (!user) return next(new errorHandler("User not found", 404));

    if (user.role !== "admin")
        return next(new errorHandler("Not authorized", 401));

    next();
};


// const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// interface AuthenticatedRequest extends Request {
//     userId?: string;
// }

// export const protect = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
//     try {
//         const token = req.cookies.token;

//         if (!token) return next(new errorHandler("Not authorized, no token", 401));

//         const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
//         req.userId = decoded.id;
//         next();
//     } catch (error) {
//         next(new errorHandler("Not authorized", 401));
//     }
// };


// import { Request, Response, NextFunction } from "express";
// import jwt from "jsonwebtoken";
// import { User } from "../models/user.js";
// import errorHandler from "../utils/utilityClass.js";

// const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// interface AuthRequest extends Request {
//     userId?: string;
// }

// export const isAdmin = async (
//     req: AuthRequest,
//     res: Response,
//     next: NextFunction
// ) => {
//     const token = req.cookies.token;

//     if (!token) {
//         return next(new errorHandler("Not authenticated", 401));
//     }

//     try {
//         const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
//         const user = await User.findById(decoded.id);

//         if (!user) return next(new errorHandler("User not found", 404));
//         if (user.role !== "admin") return next(new errorHandler("Access denied", 403));

//         req.userId = user._id.toString(); // Optionally forward userId for use in controller
//         next();
//     } catch (error) {
//         return next(new errorHandler("Invalid token", 401));
//     }
// };
