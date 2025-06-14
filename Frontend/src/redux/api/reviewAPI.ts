import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
    IReview,
    ReviewResponse,
    MessageResponse
} from '../../types/api-types';

type ReviewStats = {
    total: number;
    genuine: number;
    fake: number;
};

export interface ReviewFilterOptions {
    category?: string;
    filter?: "all" | "genuine" | "fake";
    page?: number;
    limit?: number;
    search?: string;
}

export interface PaginatedReviewResponse {
    reviews: IReview[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export const reviewAPI = createApi({
    reducerPath: 'reviewApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/review/`,
    }),
    tagTypes: ['reviews'],
    endpoints: (builder) => ({
        // Create review
        createReview: builder.mutation<ReviewResponse, IReview>({
            query: (review) => ({
                url: '',
                method: 'POST',
                body: review,
            }),
            invalidatesTags: ['reviews'],
        }),
        getProductReviews: builder.query<IReview[], string>({
            query: (productId) => `/${productId}`,
            providesTags: ['reviews'],
        }),

        // Update review
        updateReview: builder.mutation<ReviewResponse, { id: string; data: Partial<IReview> }>({
            query: ({ id, data }) => ({
                url: `${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['reviews'],
        }),

        // Get all reviews
        getAllReviews: builder.query<ReviewResponse[], void>({
            query: () => 'all',
            providesTags: ['reviews'],
        }),

        getReviewStats: builder.query<ReviewStats, void>({
            query: () => 'stats',
            providesTags: ['reviews'],
        }),

        // Delete review
        deleteReview: builder.mutation<MessageResponse, string>({
            query: (id) => ({
                url: `${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['reviews'],
        }),

        getFilteredReviews: builder.query<PaginatedReviewResponse, ReviewFilterOptions>({
            query: (params) => ({
                url: "",
                params,
            }),
            providesTags: ["reviews"],
        }),
        
        deleteAllFakeReviews: builder.mutation<MessageResponse, void>({
            query: () => ({
                url: '',
                method: 'DELETE',
            }),
            invalidatesTags: ['reviews'],
        }),

    }),
});

export const {
    useCreateReviewMutation,
    useUpdateReviewMutation,
    useGetAllReviewsQuery,
    useDeleteReviewMutation,
    useGetReviewStatsQuery,
    useGetProductReviewsQuery,
    useGetFilteredReviewsQuery,
    useDeleteAllFakeReviewsMutation
} = reviewAPI;
