import { Link } from "react-router-dom";
import { useWishlist } from "./WishlistContext";
import "../styles/Wishlist.css";

function Wishlist() {
  const { wishlist, removeFromWishlist } = useWishlist();

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
                  type="button"
                  className="remove-wishlist"
                  onClick={() => removeFromWishlist(item.id)}
                  title="Remove from wishlist"
                  aria-label={`Remove ${item.name} from wishlist`}
                >
                  ❤️
                </button>
              </div>

              <div className="wishlist-content">
                <span className="wishlist-type">
                  {item.type || "Hotel"}
                </span>

                <h2>{item.name}</h2>

                <p className="wishlist-location">
                  📍 {item.country || item.location || ""}
                </p>

                <div className="wishlist-bottom">
                  <strong>
                    {item.price || "Price available on details"}
                  </strong>

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
