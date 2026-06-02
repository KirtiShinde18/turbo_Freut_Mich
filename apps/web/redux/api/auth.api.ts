// srtapi 

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { LOGIN_REQUEST, LOGIN_RESPONSE, LOGOUT_REQUEST, LOGOUT_RESPONSE, ME_RESPONSE, REGISTER_CUSTOMER_REQUEST, REGISTER_CUSTOMER_RESPONSE } from '@repo/types';

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({ 
        baseUrl: `/api/auth`, 
        credentials: 'include',
    }),
    tagTypes: ['Auth'],
    endpoints: (builder) => {
        return {

            // 🌸 getMe → detect current logged-in user on app load
            getMe: builder.query<{ data: ME_RESPONSE }, void>({
                query: () => ({
                    url: '/me',
                    method: 'GET',
                }),
                providesTags: ['Auth'],
            }),

            // 🌸 signin → let me in, bestie 💖✨
            signin: builder.mutation<LOGIN_RESPONSE, LOGIN_REQUEST>({
                query: (userdata) => ({
                    url: '/login',
                    method: 'POST',
                    body: userdata,
                }),
                invalidatesTags: ['Auth'],
            }),

            // 🎀 signout → bye bye cutie, see you soon 💕 👋🏻
            signout: builder.mutation<LOGOUT_RESPONSE, LOGOUT_REQUEST>({
                query: () => ({
                    url: '/logout',
                    method: 'POST',
                }),
                invalidatesTags: ['Auth'],
            }),

            // 🌸 register customer → adding a new customer to the team 💼
            registerCustomer: builder.mutation<REGISTER_CUSTOMER_RESPONSE, REGISTER_CUSTOMER_REQUEST>({
                query: userData => ({
                    url: "/register-customer",
                    method: "POST",
                    body: userData,
                }),
            }),

        }
    }
});

export const { 
    useGetMeQuery,
    useSigninMutation, 
    useSignoutMutation,
    useRegisterCustomerMutation,
} = authApi;