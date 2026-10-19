import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Hero.css";

function Hero() {
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  const destinations = {
    paris: 1,
    france: 1,

    bali: 2,
    indonesia: 2,

    dubai: 3,
    "united arab emirates": 3,
    uae: 3,

    switzerland: 4,
    swiss: 4,

    maldives: 5,

    tokyo: 6,
    japan: 6,

    london: 7,
    "united kingdom": 7,
    uk: 7,

    "new york": 8,
    usa: 8,

    santorini: 9,
    greece: 9,

    singapore: 10,

    rajasthan: 11,
    india: 11,

    kashmir: 12,

    goa: 13,

    kerala: 14,
  };

  const handleExplore = () => {
    const query = search.trim().toLowerCase();

    // Empty search
    if (!query) {
      navigate("/destinations");
      return;
    }

    // Destination search
    if (destinations[query]) {
      navigate(`/destinations/${destinations[query]}`);
      return;
    }

    // Website sections
    if (
      query.includes("hotel") ||
      query.includes("stay") ||
      query.includes("resort")
    ) {
      navigate("/hotels");
      return;
    }

    if (
      query.includes("package") ||
      query.includes("tour") ||
      query.includes("trip")
    ) {
      navigate("/packages");
      return;
    }

    if (
      query.includes("booking") ||
      query.includes("book")
    ) {
      navigate("/booking");
      return;
    }

    if (
      query.includes("wishlist") ||
      query.includes("favorite") ||
      query.includes("favourite")
    ) {
      navigate("/wishlist");
      return;
    }

    if (query.includes("about")) {
      navigate("/about");
      return;
    }

    if (
      query.includes("contact") ||
      query.includes("support") ||
      query.includes("help")
    ) {
      navigate("/contact");
      return;
    }

    // If nothing matches
    navigate("/destinations");
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleExplore();
    }
  };

  return (
    <section className="hero">
      <div className="hero-overlay">
        <div className="hero-content">

          <h1>Discover Your Next Adventure</h1>

          <p>
            Explore breathtaking destinations, book amazing tour packages,
            and create unforgettable memories with WanderNest.
          </p>

          <div className="hero-search">

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search destinations..."
            />

            <button
              type="button"
              onClick={handleExplore}
            >
              Explore Now
            </button>

          </div>

        </div>
      </div>
    </section>
  );
}

export default Hero;