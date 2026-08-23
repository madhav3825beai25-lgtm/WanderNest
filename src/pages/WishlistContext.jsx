import { createContext, useContext, useState } from "react";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);

  const addToWishlist = (hotel) => {
    setWishlist((prevWishlist) => {
      const alreadyExists = prevWishlist.some(
        (item) => item.id === hotel.id
      );

      if (alreadyExists) {
        return prevWishlist;
      }

      return [...prevWishlist, hotel];
    });
  };

  const removeFromWishlist = (hotelId) => {
    setWishlist((prevWishlist) =>
      prevWishlist.filter((item) => item.id !== hotelId)
    );
  };

  const isInWishlist = (hotelId) => {
    return wishlist.some((item) => item.id === hotelId);
  };

  const clearWishlist = () => {
    setWishlist([]);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);

  if (!context) {
    throw new Error(
      "useWishlist must be used inside WishlistProvider"
    );
  }

  return context;
};