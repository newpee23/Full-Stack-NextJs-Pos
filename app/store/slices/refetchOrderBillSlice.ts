import { orderBills } from "@/types/fetchData";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface MyStateRefetchOrderBillSlice {
    orderBill: orderBills[];
    orderProcessCount: number;
    orderMakingCount: number;
    refetchDataOrder: boolean;
}

const initialState: MyStateRefetchOrderBillSlice = {
    orderBill: [],
    orderProcessCount: 0,
    orderMakingCount: 0,
    refetchDataOrder: true
};

const refetchOrderBillSlice = createSlice({
    name: "refetchOrderBillSlice",
    initialState,
    reducers: {
        setOrderBillDetail: (state, action: PayloadAction<orderBills[]>) => {
            state.orderBill = action.payload;
        },
        plusOrderProcessCount: (state) => {
            state.orderProcessCount += 1;
        },
        cleanOrderProcessCount: (state) => {
            state.orderProcessCount = 0;
        },
        plusOrderMakingCount: (state) => {
            state.orderMakingCount += 1;
        },
        cleanOrderMakingCount: (state) => {
            state.orderMakingCount = 0;
        }
    },
});

export const { setOrderBillDetail, plusOrderProcessCount , cleanOrderProcessCount , plusOrderMakingCount , cleanOrderMakingCount } = refetchOrderBillSlice.actions;
export default refetchOrderBillSlice.reducer;
