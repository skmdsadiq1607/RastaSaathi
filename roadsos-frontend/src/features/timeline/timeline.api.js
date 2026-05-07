import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../../config/api';
export const timelineApi = createApi({ reducerPath: 'timelineApi', baseQuery: axiosBaseQuery(), tagTypes: ['Timeline'], endpoints: (builder) => ({ getTimeline: builder.query({ query: (incidentId) => ({ url: '/api/timeline/' + incidentId }), providesTags: ['Timeline'] }) }) });
export const { useGetTimelineQuery } = timelineApi;
