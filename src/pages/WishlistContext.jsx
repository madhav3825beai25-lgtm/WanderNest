import { useDispatch, useSelector } from "react-redux";
import {
  addToWishlist as addWishlistAction,
  removeFromWishlist as removeWishlistAction,
  clearWishlist as clearWishlistAction,
} from "../redux/wishlistSlice";

export const WishlistProvider = ({ children }) => {
  return children;
};

export const useWishlist = () => {
  const dispatch = useDispatch();

  const wishlist = useSelector(
    (state) => state.wishlist.items
  );

  const addToWishlist = (hotel) => {
    dispatch(addWishlistAction(hotel));
  };

  const removeFromWishlist = (hotelId) => {
    dispatch(removeWishlistAction(hotelId));
  };

  const isInWishlist = (hotelId) => {
    return wishlist.some(
      (item) => item.id === hotelId
    );
  };

  const toggleWishlist = (hotel) => {
    if (wishlist.some((item) => item.id === hotel.id)) {
      dispatch(removeWishlistAction(hotel.id));
    } else {
      dispatch(addWishlistAction(hotel));
    }
  };

  const clearWishlist = () => {
    dispatch(clearWishlistAction());
  };

  return {
    wishlist,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
    clearWishlist,
  };
};
