import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../../config/api';
export const hospitalApi = createApi({ reducerPath: 'hospitalApi', baseQuery: axiosBaseQuery(), tagTypes: ['Hospital'], endpoints: (builder) => ({ listHospitals: builder.query({ query: () => ({ url: '/api/hospital' }), providesTags: ['Hospital'] }), getHospital: builder.query({ query: (id) => ({ url: '/api/hospital/' + id }), providesTags: ['Hospital'] }), selectHospital: builder.mutation({ query: (data) => ({ url: '/api/hospital/select', method: 'post', data }) }) }) });
export const { useListHospitalsQuery, useGetHospitalQuery, useSelectHospitalMutation } = hospitalApi;
