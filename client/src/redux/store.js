import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import pizzaReducer from "./slices/pizzaSlice";
import cartReducer from "./slices/cartSlice";
import orderReducer from "./slices/orderSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    pizza: pizzaReducer,
    cart: cartReducer,
    order: orderReducer,
  },
});

export default store;
