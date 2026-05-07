import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../../config/api';
export const firstAidApi = createApi({ reducerPath: 'firstAidApi', baseQuery: axiosBaseQuery(), endpoints: (builder) => ({ guide: builder.mutation({ query: (data) => ({ url: '/api/firstaid/guide', method: 'post', data }) }), followup: builder.mutation({ query: (data) => ({ url: '/api/firstaid/followup', method: 'post', data }) }) }) });
export const { useGuideMutation, useFollowupMutation } = firstAidApi;
