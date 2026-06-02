// srtapi

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ADD_TO_CART_REQUEST, GET_CART_RESPONSE, COMMON_RESPONSE } from '@repo/types';

export const cartApi = createApi({
    reducerPath: 'cartApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `/api/cart`,
        credentials: 'include',
    }),
    tagTypes: ['Cart'],
    endpoints: (builder) => {
        return {

            // 📖 Get all cart items for a user (joined with product details)
            getCart: builder.query<GET_CART_RESPONSE, number>({
                query: (userId) => ({
                    url: `/${userId}`,
                    method: 'GET',
                }),
                providesTags: ['Cart'],
            }),

            // 🛒 Add item to cart (upsert: increments qty if already exists)
            addToCart: builder.mutation<COMMON_RESPONSE, ADD_TO_CART_REQUEST>({
                query: (body) => ({
                    url: '/add',
                    method: 'POST',
                    body,
                }),
                invalidatesTags: ['Cart'],
            }),

            // 🗑️ Remove a cart item by its cart row id
            removeFromCart: builder.mutation<COMMON_RESPONSE, number>({
                query: (id) => ({
                    url: `/${id}`,
                    method: 'DELETE',
                }),
                invalidatesTags: ['Cart'],
            }),

            // ✏️ Update the quantity of a cart item
            updateCartItem: builder.mutation<COMMON_RESPONSE, { id: number; quantity: number }>({
                query: ({ id, quantity }) => ({
                    url: `/${id}`,
                    method: 'PATCH',
                    body: { quantity },
                }),
                invalidatesTags: ['Cart'],
            }),

        };
    },
});

export const {
    useGetCartQuery,
    useAddToCartMutation,
    useRemoveFromCartMutation,
    useUpdateCartItemMutation,
} = cartApi;
