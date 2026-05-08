import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../../config/api';
export const transparencyApi = createApi({ reducerPath: 'transparencyApi', baseQuery: axiosBaseQuery(), endpoints: (builder) => ({ getDecisions: builder.query({ query: (incidentId) => ({ url: '/api/transparency/' + incidentId }) }) }) });
export const { useGetDecisionsQuery } = transparencyApi;
