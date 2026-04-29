import { configureStore } from "@reduxjs/toolkit";
import customerSlice from "./slices/customerSlice"
import cartSlice from "./slices/cartSlice";
import userSlice from "./slices/userSlice";
import themeSlice from "./slices/themeSlice";

const store = configureStore({
    reducer: {
        customer: customerSlice,
        cart : cartSlice,
        user : userSlice,
        theme: themeSlice
    },

    devTools: import.meta.env.NODE_ENV !== "production",
});

export default store;
