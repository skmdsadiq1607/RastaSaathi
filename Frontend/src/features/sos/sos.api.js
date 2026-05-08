import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../../config/api';
export const sosApi = createApi({ reducerPath: 'sosApi', baseQuery: axiosBaseQuery(), tagTypes: ['SOS'], endpoints: (builder) => ({ triggerSos: builder.mutation({ query: (data) => ({ url: '/api/sos/trigger', method: 'post', data }), invalidatesTags: ['SOS'] }), cancelSos: builder.mutation({ query: (id) => ({ url: '/api/sos/' + id + '/cancel', method: 'post' }) }), history: builder.query({ query: (params) => ({ url: '/api/sos/history', params }), providesTags: ['SOS'] }) }) });
export const { useTriggerSosMutation, useCancelSosMutation, useHistoryQuery } = sosApi;
