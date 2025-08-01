import mongoose from "mongoose";
import { trim } from "validator";

const orderSchema = new mongoose.Schema(
    {
        shippingInfo: {
            address: {
                type: String,
                required: true,
            },
            city:{
                type: String,
                required: true,
            },
            state: {
                type: String,
                required: true,
            },
            country: {
                type: String,
                required: true,
            },
            pinCode: {
                type: Number,
                required: true,
            },
            phoneNo: {
                type: Number,
                required: true,
                
            },
        },
        user: {
            type: String,
            ref: "User",
            required: true,
        },
        subTotal: {
            type: Number,
            required: true,
        },
        tax: {
            type: Number,
            required: true,
        },
        shippingCharge: {
            type: Number,
            required: true,
            default: 0,
        },
        discount: {
            type: Number,
            required: true,
            default: 0,
        },
        total: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ["Processing", "Shipped", "Delivered"],
            default: "Processing",
        },

        orderItems: [{
            name: String,
            image: String,
            price: Number,
            quantity: Number,
            productId:{
                type: mongoose.Types.ObjectId,
                ref: "Product",
            }
        }],
    },
    {
        timestamps: true,
    }
);

export const Order = mongoose.model("Order", orderSchema);
