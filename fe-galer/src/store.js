// src/store.js
import { configureStore } from '@reduxjs/toolkit';
// import rootReducer from './reducers'; // You will create this file next
import authReducer from './features/authSlice.js';

const store = configureStore({
    // reducer: rootReducer,
    reducer: {
        auth: authReducer
    },
});

export default store;