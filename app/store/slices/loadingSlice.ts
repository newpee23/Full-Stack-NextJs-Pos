import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface MyStateLoading {
  loadingAction: number;
  showLoading: boolean;
}

const initialState: MyStateLoading = {
  loadingAction: 0,
  showLoading: false
};

const loadingSlice = createSlice({
  name: "loadingSlice",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<{loadingAction: number,showLoading: boolean}>) => {
      state.loadingAction = action.payload.loadingAction;
      state.showLoading = action.payload.showLoading;
    },
  },
});

export const { setLoading } = loadingSlice.actions;
export default loadingSlice.reducer;
