import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../../config/api';
export const summaryApi = createApi({ reducerPath: 'summaryApi', baseQuery: axiosBaseQuery(), tagTypes: ['Summary'], endpoints: (builder) => ({ generateSummary: builder.mutation({ query: (incidentId) => ({ url: '/api/summary/generate', method: 'post', data: { incidentId } }), invalidatesTags: ['Summary'] }), getSummary: builder.query({ query: (incidentId) => ({ url: '/api/summary/' + incidentId }), providesTags: ['Summary'] }) }) });
export const { useGenerateSummaryMutation, useGetSummaryQuery } = summaryApi;
