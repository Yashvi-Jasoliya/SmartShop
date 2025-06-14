import { configureStore } from '@reduxjs/toolkit';
import { userAPI } from './api/userAPI';
import { userReducer } from './reducer/userReducer';
import { productAPI } from './api/productAPI';
import { cartReducer } from './reducer/cartReducer';
import { orderAPI } from './api/orderAPI';
import { dashboardAPI } from './api/dashboardAPI';
import { wishlistAPI } from './api/wishlistAPI';
import { reviewAPI } from './api/reviewAPI';

export const server = import.meta.env.VITE_SERVER;

export const store = configureStore({
    reducer: {
        [userAPI.reducerPath]: userAPI.reducer,
        [productAPI.reducerPath]: productAPI.reducer,
        [orderAPI.reducerPath]: orderAPI.reducer,
        [reviewAPI.reducerPath]: reviewAPI.reducer,
        [dashboardAPI.reducerPath]: dashboardAPI.reducer,
        [wishlistAPI.reducerPath]: wishlistAPI.reducer,
        [userReducer.name]: userReducer.reducer,
        [cartReducer.name]: cartReducer.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(userAPI.middleware)
            .concat(productAPI.middleware)
            .concat(orderAPI.middleware)
            .concat(reviewAPI.middleware)
            .concat(dashboardAPI.middleware)
            .concat(wishlistAPI.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
