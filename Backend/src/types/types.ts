import { NextFunction, Request, Response } from 'express';
import { Product } from '../models/product.js';
import { Document } from 'mongoose';

export interface NewUserRequestBody {
    name: string;
    email: string;
    gender: string;
    photo: string;
    _id: string;
    dob: Date;
}

export interface NewProductRequestBody {
    name: string;
    price: number;
    originalPrice: number;
    stock: number;
    category: string;
    brand: string;
    description: string;
    features: string[] | string;
    colors: string[] | string;
}

export type ControllerType = any;


export type SearchRequestQuery = {
    search?: string;
    price?: string;
    category?: string;
    sort?: string;
    page?: string;
    dateSort?: string;
};

export interface BaseQuery {
    name?: {
        $regex: string;
        $options: string;
    };
    price?: {
        $lte: number;
    };
    category?: string;
}

export type InvalidateCacheProps = {
    product?: boolean;
    order?: boolean;
    admin?: boolean;
    userId?: string;
    orderId?: string;
    productId?: string | string[];
};

export type OrderItemType = {
    name: string;
    image: string;
    price: number;
    quantity: number;
    productId: string;
};

export type ShippingInfoType = {
    address: string;
    city: string;
    state: string;
    country: string;
    pinCode: number;
};

export interface NewOrderRequestBody {
    shippingInfo: ShippingInfoType;
    user: string;
    subTotal: number;
    tax: number;
    shippingCharges: number;
    discount: number;
    total: number;
    orderItems: OrderItemType[];
}

// export type ReviewType = {
//     name: string,
//     rating: number;
//     comment: string;
//     createdAt?: Date;
// }


export interface User {
    _id: string;
    name: string;
    email: string;
}

export interface Product extends Document {
    _id: string;
    title: string;
    description: string;
    price: number;
    category: string;
}

export interface Review extends Document {
    _id: string;
    product: Product | string;
    user: User | string;
    text: string;
    rating: number;
    isMismatched: boolean;
    mismatchScore: number;
    createdAt: Date;
}