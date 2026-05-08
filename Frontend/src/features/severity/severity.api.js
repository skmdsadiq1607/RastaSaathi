import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../../config/api';
export const severityApi = createApi({ reducerPath: 'severityApi', baseQuery: axiosBaseQuery(), endpoints: (builder) => ({ predictSeverity: builder.mutation({ query: (data) => ({ url: '/api/severity/predict', method: 'post', data }) }) }) });
export const { usePredictSeverityMutation } = severityApi;
