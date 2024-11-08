import { createSlice } from "@reduxjs/toolkit";

const offerSlice = createSlice({
  name: "offers",
  initialState: {},
  reducers: {
    setOffer(state, action) {
      const { productId, originalPrice, discount } = action.payload;
      state[productId] = { originalPrice, discount };
    },
    clearOffers(state) {
      return {}; // Clears all offers, e.g., when offers expire or are deactivated
    },
  },
});

export const { setOffer, clearOffers } = offerSlice.actions;
export default offerSlice.reducer;
