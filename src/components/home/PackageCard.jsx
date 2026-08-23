import "../../styles/PackageCard.css";

function PackageCard({ packageItem }) {
  return (
    <article className="package-card">
      <div className="package-image-container">
        <img
          src={packageItem.image}
          alt={packageItem.title}
          className="package-card-image"
        />

        <span className="package-duration">
          {packageItem.duration}
        </span>
      </div>

      <div className="package-card-content">
        <span className="package-location">
          {packageItem.location}
        </span>

        <h3>{packageItem.title}</h3>

        <p>{packageItem.description}</p>

        <div className="package-card-bottom">
          <div>
            <span className="package-price-label">Starting from</span>
            <strong>{packageItem.price}</strong>
          </div>

          <button>View Details</button>
        </div>
      </div>
    </article>
  );
}

export default PackageCard;