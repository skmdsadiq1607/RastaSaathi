import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../../config/api';
export const incidentApi = createApi({ reducerPath: 'incidentApi', baseQuery: axiosBaseQuery(), tagTypes: ['Incident'], endpoints: (builder) => ({ listIncidents: builder.query({ query: (params) => ({ url: '/api/incidents', params }), providesTags: ['Incident'] }), getIncident: builder.query({ query: (id) => ({ url: '/api/incidents/' + id }), providesTags: ['Incident'] }), markArrived: builder.mutation({ query: (id) => ({ url: '/api/incidents/' + id + '/arrived', method: 'post' }), invalidatesTags: ['Incident'] }) }) });
export const { useListIncidentsQuery, useGetIncidentQuery, useMarkArrivedMutation } = incidentApi;
