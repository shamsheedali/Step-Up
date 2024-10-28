import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    quantities: {},
    calculatedSubtotal: 0,
}

const bagSlice = createSlice({
    name: 'bag',
    initialState,
    reducers:{
        updateQuantity: (state, action) => {
            const {productId, quantity} = action.payload;
            if(quantity > 0) {
                state.quantities[productId] = quantity;
            }else {
                delete state.quantities[productId];
            }
        },
        removeProduct: (state, action) => {
            const {productId} = action.payload;
            delete state.quantities[productId];
        },
        storeSubtotal: (state, action) => {
            state.calculatedSubtotal = action.payload.subtotal;
        }
    }
})


export const {updateQuantity, storeSubtotal, removeProduct} = bagSlice.actions;
export default bagSlice.reducer;