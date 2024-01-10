import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface MyStateshowSlice {
    showOrderBillProcess: boolean;
    showOrderBillMaking: boolean;
}

const initialState: MyStateshowSlice = {
    showOrderBillProcess: false,
    showOrderBillMaking:false
};

const showSlice = createSlice({
  name: "showSlice",
  initialState,
  reducers: { 
    setShowOrderBillProcess: (state, action: PayloadAction<boolean>) => {
        state.showOrderBillProcess = action.payload
    }, 
    setShowOrderBillMaking: (state, action: PayloadAction<boolean>) => {
        state.showOrderBillMaking = action.payload
    },
  },
});

export const { setShowOrderBillProcess, setShowOrderBillMaking } = showSlice.actions;
export default showSlice.reducer;
