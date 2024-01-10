import { configureStore } from "@reduxjs/toolkit";
import { useSelector, useDispatch, TypedUseSelectorHook } from "react-redux";
import loadingSlice from "@/app/store/slices/loadingSlice";
import cartSlice from "./slices/cartSlice";
import showSlice from "./slices/showSlice";
import refetchOrderBillSlice from "./slices/refetchOrderBillSlice";

export const store = configureStore({
  reducer: {
    loadingSlice,
    cartSlice,
    refetchOrderBillSlice,
    showSlice, 
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch = () => useDispatch<AppDispatch>();

export default store;
