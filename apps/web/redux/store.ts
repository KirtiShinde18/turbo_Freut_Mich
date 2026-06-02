import { configureStore } from '@reduxjs/toolkit';

import { TypedUseSelectorHook, useSelector } from 'react-redux';
import { authApi } from './api/auth.api';
import { productApi } from './api/product.api';
import { cartApi } from './api/cart.api';

const reduxStore = configureStore({
    reducer: {
        [authApi.reducerPath]: authApi.reducer,
        [productApi.reducerPath]: productApi.reducer,
        [cartApi.reducerPath]: cartApi.reducer,
    },
    middleware: (def) => def().concat(authApi.middleware, productApi.middleware, cartApi.middleware)
});

export type RootType = ReturnType<typeof reduxStore.getState>;
export const useAppSelector: TypedUseSelectorHook<RootType> = useSelector;

export default reduxStore;