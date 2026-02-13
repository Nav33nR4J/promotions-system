import { configureStore } from "@reduxjs/toolkit";
import promotionsReducer from "./slices/promotionsSlice";

export const store = configureStore({
  reducer: {
    promotions: promotionsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
