import "../../styles/DestinationCard.css";

function DestinationCard({ destination }) {
  return (
    <article className="destination-card">
      <img
        src={destination.image}
        alt={destination.name}
        className="destination-card-image"
      />

      <div className="destination-card-content">
        <span className="destination-country">
          {destination.country}
        </span>

        <h3>{destination.name}</h3>

        <p>{destination.description}</p>

        <div className="destination-card-bottom">
          <span className="destination-price">
            From {destination.price}
          </span>

          <button>Explore</button>
        </div>
      </div>
    </article>
  );
}

export default DestinationCard;