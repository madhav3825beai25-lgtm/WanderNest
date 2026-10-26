import { createSlice } from "@reduxjs/toolkit";

const wishlistSlice = createSlice({
  name: "wishlist",

  initialState: {
    items: [],
  },

  reducers: {
    addToWishlist: (state, action) => {
      const hotel = action.payload;

      const alreadyExists = state.items.some(
        (item) => item.id === hotel.id
      );

      if (!alreadyExists) {
        state.items.push(hotel);
      }
    },

    removeFromWishlist: (state, action) => {
      state.items = state.items.filter(
        (item) => item.id !== action.payload
      );
    },

    clearWishlist: (state) => {
      state.items = [];
    },
  },
});

export const {
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;
