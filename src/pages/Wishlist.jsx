import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Wishlist.css";

const initialWishlist = [
  {
    id: 1,
    name: "Paris",
    country: "France",
    type: "Destination",
    price: "₹45,000",
    image:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 2,
    name: "Bali Beach Resort",
    country: "Indonesia",
    type: "Hotel",
    price: "₹9,500 / night",
    image:
      "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 3,
    name: "Santorini",
    country: "Greece",
    type: "Destination",
    price: "₹55,000",
    image:
      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80",
  },
];

function Wishlist() {
  const [wishlist, setWishlist] = useState(initialWishlist);

  const removeItem = (id) => {
    setWishlist(wishlist.filter((item) => item.id !== id));
  };

  return (
    <section className="wishlist-page">

      <div className="wishlist-header">
        <h1>My Wishlist ❤️</h1>

        <p>
          Save your favourite destinations and stays for your next journey.
        </p>
      </div>

      {wishlist.length === 0 ? (
        <div className="empty-wishlist">

          <div className="empty-icon">💔</div>

          <h2>Your Wishlist is Empty</h2>

          <p>
            You haven't saved any destinations or hotels yet.
          </p>

          <Link to="/destinations" className="explore-button">
            Explore Destinations
          </Link>

        </div>
      ) : (
        <div className="wishlist-grid">

          {wishlist.map((item) => (
            <div className="wishlist-card" key={item.id}>

              <div className="wishlist-image-container">

                <img
                  src={item.image}
                  alt={item.name}
                  className="wishlist-image"
                />

                <button
                  className="remove-wishlist"
                  onClick={() => removeItem(item.id)}
                  title="Remove from wishlist"
                >
                  ❤️
                </button>

              </div>

              <div className="wishlist-content">

                <span className="wishlist-type">
                  {item.type}
                </span>

                <h2>{item.name}</h2>

                <p className="wishlist-location">
                  📍 {item.country}
                </p>

                <div className="wishlist-bottom">

                  <strong>{item.price}</strong>

                  <Link
                    to={
                      item.type === "Hotel"
                        ? `/hotels/${item.id}`
                        : `/destinations/${item.id}`
                    }
                    className="wishlist-view-button"
                  >
                    View Details
                  </Link>

                </div>

              </div>

            </div>
          ))}

        </div>
      )}

    </section>
  );
}

export default Wishlist;