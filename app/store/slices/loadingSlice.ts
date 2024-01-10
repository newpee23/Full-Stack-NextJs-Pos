import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface MyStateLoading {
  loadingAction: number;
  showLoading: boolean;
  loadingOrderDetail: boolean;
}

const initialState: MyStateLoading = {
  loadingAction: 0,
  showLoading: false,
  loadingOrderDetail: false 
};

const loadingSlice = createSlice({
  name: "loadingSlice",
  initialState,
  reducers: { 
    setLoading: (state, action: PayloadAction<{loadingAction: number,showLoading: boolean}>) => {
      state.loadingAction = action.payload.loadingAction;
      state.showLoading = action.payload.showLoading;
    },
    setLoadingOrderDetail: (state, action: PayloadAction<boolean>) => {
      state.loadingOrderDetail = action.payload
    },
  },
});

export const { setLoading, setLoadingOrderDetail } = loadingSlice.actions;
export default loadingSlice.reducer;
