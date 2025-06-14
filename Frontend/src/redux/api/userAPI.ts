import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import axios from 'axios';
import {
    AllUsersResponse,
    DeleteUserRequest,
    MessageResponse,
    UserResponse,
} from '../../types/api-types';
import { User } from '../../types/types';

export const userAPI = createApi({
    reducerPath: 'userApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/user/`,
        credentials: 'include',
    }),
    tagTypes: ['users'],
    endpoints: (builder) => ({
        login: builder.mutation<MessageResponse, User>({
            query: (user) => ({
                url: 'new',
                method: 'POST',
                body: user,
            }),
            invalidatesTags: ['users'],
        }),
        loginUser: builder.mutation({
            query: (credentials: { email: string; password: string }) => ({
                url: "login",
                method: "POST",
                body: credentials,
            }),
        }),
        register: builder.mutation<MessageResponse, Partial<User>>({
            query: (user) => ({
                url: 'register',
                method: 'POST',
                body: user,
            }),
            invalidatesTags: ['users'],
        }),
        deleteUser: builder.mutation<MessageResponse, DeleteUserRequest>({
            query: ({ userId, adminUserId }) => ({
                url: `${userId}?id=${adminUserId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['users'],
        }),
        allUsers: builder.query<AllUsersResponse, string>({
            query: (id) => `all?id=${id}`,
            providesTags: ['users'],
        }),
    }),
});

export const getUser = async (id: string) => {
    try {
        const { data }: { data: UserResponse } = await axios.get(
            `${import.meta.env.VITE_SERVER}/api/v1/user/${id}`
        );
        return data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || error.message);
        }
        throw new Error('Unknown error occurred');
    }
};

export const { useLoginMutation, useDeleteUserMutation, useAllUsersQuery, useRegisterMutation, useLoginUserMutation} =
    userAPI;
