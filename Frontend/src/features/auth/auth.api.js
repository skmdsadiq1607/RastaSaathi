import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../../config/api';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Auth'],
  endpoints: (builder) => ({
    register: builder.mutation({ query: (data) => ({ url: '/api/auth/register', method: 'post', data }) }),
    login: builder.mutation({ query: (data) => ({ url: '/api/auth/login', method: 'post', data }) }),
    refresh: builder.mutation({ query: () => ({ url: '/api/auth/refresh', method: 'post', data: {} }) }),
    logout: builder.mutation({ query: () => ({ url: '/api/auth/logout', method: 'post' }) }),
    me: builder.query({ query: () => ({ url: '/api/auth/me' }), providesTags: ['Auth'] }),
    sendFcmToken: builder.mutation({ query: (token) => ({ url: '/api/auth/fcm-token', method: 'post', data: { token } }) }),
    forgotPassword: builder.mutation({ query: (data) => ({ url: '/api/auth/forgot-password', method: 'post', data }) }),
    resetPassword: builder.mutation({ query: (data) => ({ url: '/api/auth/reset-password', method: 'post', data }) })
  })
});
export const { useRegisterMutation, useLoginMutation, useRefreshMutation, useLogoutMutation, useMeQuery, useSendFcmTokenMutation, useForgotPasswordMutation, useResetPasswordMutation } = authApi;
