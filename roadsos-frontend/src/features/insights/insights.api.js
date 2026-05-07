import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../../config/api';
export const insightsApi = createApi({ reducerPath: 'insightsApi', baseQuery: axiosBaseQuery(), endpoints: (builder) => ({ hotspots: builder.query({ query: (period = '30d') => ({ url: '/api/insights/hotspots', params: { period } }) }), trends: builder.query({ query: (period = '30d') => ({ url: '/api/insights/trends', params: { period } }) }) }) });
export const { useHotspotsQuery, useTrendsQuery } = insightsApi;
