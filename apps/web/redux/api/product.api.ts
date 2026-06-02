// srtapi 

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { APP_URL } from '../../config/env';
import { COMMON_RESPONSE, DELETE_PRODUCT_REQUEST, READ_PRODUCT_RESPONSE, UPDATE_PRODUCT_REQUEST } from '@repo/types';

export const productApi = createApi({
    reducerPath: 'productApi',
    baseQuery: fetchBaseQuery({ 
        // baseUrl: `${APP_URL}/api/auth`, 
        baseUrl: `/api/product`, 
        credentials: 'include' }),

        tagTypes: ["product"],
    endpoints: (builder) => {
        return {

      // ======================================================
      // CREATE PRODUCT
      // ======================================================

      createProduct: builder.mutation< COMMON_RESPONSE, FormData>({
        query: (productData) => {

          return {
            url: "/create-product",
            method: "POST",
            body: productData,
          };
        },

        invalidatesTags: ["product"],
      }),


      // ======================================================
      // GET PRODUCTS
      // ======================================================

      getProducts: builder.query< READ_PRODUCT_RESPONSE, void>({
        query: () => {

          return {
            url: "/get-products",
            method: "GET",
          };
        },

        providesTags: ["product"],
      }),


      // ======================================================
      // UPDATE PRODUCT
      // ======================================================

      updateProduct: builder.mutation< COMMON_RESPONSE, UPDATE_PRODUCT_REQUEST>({
        query: ({ id, body,}) => {

          return {
            url: `/update-product/${id}`,
            method: "PUT",
            body
          };
        },

        invalidatesTags: ["product"],
      }),


      // ======================================================
      // DELETE PRODUCT
      // ======================================================

      deleteProduct: builder.mutation< COMMON_RESPONSE, DELETE_PRODUCT_REQUEST>({
        query: ({ id }) => {

          return {
            url: `/delete-product/${id}`,
            method: "DELETE",
          };
        },

        invalidatesTags: ["product"],
      }),

        }
    }
});

export const { 
    useGetProductsQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation
} = productApi;