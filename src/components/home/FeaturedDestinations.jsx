import destinations from "../../data/destinations";
import DestinationCard from "./DestinationCard";
import "../../styles/FeaturedDestinations.css";

function FeaturedDestinations() {
  return (
    <section className="featured-destinations">

      <div className="featured-destinations-heading">

        <span>EXPLORE THE WORLD</span>

        <h2>Featured Destinations</h2>

        <p>
          Discover amazing places around the world and find your
          next unforgettable adventure.
        </p>

      </div>

      <div className="destination-grid">

        {destinations.map((destination) => (
          <DestinationCard
            key={destination.id}
            destination={destination}
          />
        ))}

      </div>

    </section>
  );
}

export default FeaturedDestinations;