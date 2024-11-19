import { configureStore } from '@reduxjs/toolkit';
import cartReducer from "./cartreducer"

export const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
});
