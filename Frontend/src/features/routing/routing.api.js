import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../../config/api';
export const routingApi = createApi({ reducerPath: 'routingApi', baseQuery: axiosBaseQuery(), endpoints: (builder) => ({ calculateRoute: builder.mutation({ query: (data) => ({ url: '/api/routing/calculate', method: 'post', data }) }) }) });
export const { useCalculateRouteMutation } = routingApi;
