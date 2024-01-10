import { orderBills } from "@/types/fetchData";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface MyStateRefetchOrderBillSlice {
    orderBill: orderBills[];
    orderProcessCount: number;
    orderMakingCount: number;
    refetchDataOrder: boolean;
    refetchDataOrderMaking: boolean;
}

const initialState: MyStateRefetchOrderBillSlice = {
    orderBill: [],
    orderProcessCount: 0,
    orderMakingCount: 0,
    refetchDataOrder: true,
    refetchDataOrderMaking: true 
};

const refetchOrderBillSlice = createSlice({
    name: "refetchOrderBillSlice",
    initialState,
    reducers: {
        setOrderBillDetail: (state, action: PayloadAction<orderBills[]>) => {
            return {
                ...state,
                orderBill: action.payload,
            };
        },
        plusOrderProcessCount: (state, action: PayloadAction<number>) => {
            return {
                ...state,
                orderProcessCount: action.payload,
            };
        },
        cleanOrderProcessCount: (state) => {
            return {
                ...state,
                orderProcessCount: 0,
            };
        },
        plusOrderMakingCount: (state) => {
            return {
                ...state,
                orderMakingCount: state.orderMakingCount + 1,
            };
        },
        cleanOrderMakingCount: (state) => {
            return {
                ...state,
                orderMakingCount: 0,
            };
        },
        setRefetchDataOrder: (state, action: PayloadAction<boolean>) => {
            return {
                ...state,
                refetchDataOrder: action.payload,
            };
        },
        setRefetchDataOrderMaking: (state, action: PayloadAction<boolean>) => {
            return {
                ...state,
                refetchDataOrderMaking: action.payload,
            };
        },
    },
});

export const { setOrderBillDetail, plusOrderProcessCount, cleanOrderProcessCount, plusOrderMakingCount, cleanOrderMakingCount, setRefetchDataOrder , setRefetchDataOrderMaking} = refetchOrderBillSlice.actions;
export default refetchOrderBillSlice.reducer;
