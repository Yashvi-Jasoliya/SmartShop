import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
    BarResponse,
    LineResponse,
    PieResponse,
    StatsResponse,
} from '../../types/api-types';

export const dashboardAPI = createApi({
    reducerPath: 'dashboardAPI',
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/dashboard`,
    }),
    endpoints: (builder) => ({
        stats: builder.query<StatsResponse, string>({
            query: (id) => `statistics?id=${id}`,
            keepUnusedDataFor: 0,
        }),
        pie: builder.query<PieResponse, string>({
            query: (id) => `pie?id=${id}`,
            keepUnusedDataFor: 0,
        }),
        bar: builder.query<BarResponse, string>({
            query: (id) => `bar?id=${id}`,
            keepUnusedDataFor: 0,
        }),
        line: builder.query<LineResponse, string>({
            query: (id) => `line?id=${id}`,
            keepUnusedDataFor: 0,
        }),
    }),
});

export const { useBarQuery, usePieQuery, useLineQuery, useStatsQuery } =
    dashboardAPI;
