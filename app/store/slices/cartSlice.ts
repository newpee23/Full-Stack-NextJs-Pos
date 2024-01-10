import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface itemCartType {
  productId?: number;
  promotionId?: number;
  promotionPrice?: number;
  name: string;
  qty: number;
  price: number;
  image: string | null;
}

export interface myStateCartItem {
  transactionId: string;
  itemCart: itemCartType[];
  totalPrice: number;
  totalQty: number;
}

const initialState: myStateCartItem = {
  transactionId: "", 
  itemCart: [],
  totalPrice: 0,
  totalQty: 0
};

const cartSlice = createSlice({
  name: "cartSlice",
  initialState,
  reducers: {
    cartIncrementItem: (state, action: PayloadAction<itemCartType>) => {
      const { productId, name, qty, price , image } = action.payload;
      const existingItem = state.itemCart.find(item => item.productId === productId);

      if (existingItem) {
        // If item already exists, update quantity and price
        existingItem.qty += qty;
        existingItem.price = price;
      } else {
        // If item does not exist, add it to the cart with qty 1
        state.itemCart.push({ productId: productId, name: name, qty: qty, price: price , image: image});
      }

      // Update the total price
      state.totalPrice += (price * qty);
      state.totalQty += qty;
    },
    cartDecrementItem: (state, action: PayloadAction<number>) => {
      const productIdToRemove = action.payload;
      const itemToRemoveIndex = state.itemCart.findIndex(item => item.productId === productIdToRemove);
      
      if (itemToRemoveIndex !== -1) {
        const itemToRemove = state.itemCart[itemToRemoveIndex];
        
        // Subtract removed item's price from total price
        state.totalPrice -= itemToRemove.price;
        state.totalQty -= 1;
        // Update the quantity or remove the item
        if (itemToRemove.qty > 1) {
          // If quantity is greater than 1, just decrease the quantity
          state.itemCart[itemToRemoveIndex].qty -= 1;
        } else {
          // If quantity is 1 or less, remove the item from the cart
          state.itemCart.splice(itemToRemoveIndex, 1);
        }
      }
    },
    removeCartItem: (state, action: PayloadAction<{productId?: number, promotionId?: number}>) => {
      const { productId , promotionId } = action.payload;
      let itemToRemoveIndex = 0;
      if(productId){
        itemToRemoveIndex = state.itemCart.findIndex(item => item.productId === productId);
      }else{
        itemToRemoveIndex = state.itemCart.findIndex(item => item.promotionId === promotionId);
      }
    
      if (itemToRemoveIndex !== -1) {
        const itemToRemove = state.itemCart[itemToRemoveIndex];

        state.totalPrice -= (itemToRemove.price * itemToRemove.qty);
        state.totalQty -= itemToRemove.qty;
        state.itemCart.splice(itemToRemoveIndex, 1);
      }
    },
    cleanCart: (state): myStateCartItem => {
      return {
        ...initialState,
        transactionId: state.transactionId
      };
    },
    cartPromotionIncrementItem: (state, action: PayloadAction<itemCartType>) => {
      const { promotionId, name, qty, price , image } = action.payload;
      const existingItem = state.itemCart.find(item => item.promotionId === promotionId);

      if (!existingItem) {
        state.totalQty += 1;
        state.totalPrice += price;
        state.itemCart.push({promotionId: promotionId, name: name, price: price, qty: qty, image: image});
      } 
    },
    setTransactionId: (state, action: PayloadAction<string>) => {
      state.transactionId = action.payload;
    },
  }
});

export const { cartIncrementItem, cartDecrementItem , removeCartItem , cleanCart , cartPromotionIncrementItem , setTransactionId} = cartSlice.actions;
export default cartSlice.reducer;
