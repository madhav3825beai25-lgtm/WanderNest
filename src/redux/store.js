import { configureStore } from "@reduxjs/toolkit";
import wishlistReducer from "./wishlistSlice";

const loadWishlist = () => {
  try {
    const saved = localStorage.getItem("wandernest_wishlist");

    if (!saved) return undefined;

    const items = JSON.parse(saved);

    if (!Array.isArray(items)) return undefined;

    return {
      wishlist: {
        items,
      },
    };
  } catch (error) {
    console.error("Could not load wishlist:", error);
    return undefined;
  }
};

export const store = configureStore({
  reducer: {
    wishlist: wishlistReducer,
  },
  preloadedState: loadWishlist(),
});

store.subscribe(() => {
  try {
    const items = store.getState().wishlist.items;

    localStorage.setItem(
      "wandernest_wishlist",
      JSON.stringify(items)
    );
  } catch (error) {
    console.error("Could not save wishlist:", error);
  }
});
