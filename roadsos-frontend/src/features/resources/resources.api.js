import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../../config/api';
export const resourcesApi = createApi({ reducerPath: 'resourcesApi', baseQuery: axiosBaseQuery(), tagTypes: ['Resources'], endpoints: (builder) => ({ listResources: builder.query({ query: () => ({ url: '/api/resources' }), providesTags: ['Resources'] }), matchResources: builder.query({ query: (params) => ({ url: '/api/resources/match', params }) }), updateResources: builder.mutation({ query: (data) => ({ url: '/api/resources/update', method: 'post', data }), invalidatesTags: ['Resources'] }) }) });
export const { useListResourcesQuery, useMatchResourcesQuery, useUpdateResourcesMutation } = resourcesApi;
