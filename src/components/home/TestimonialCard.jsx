import { FaStar, FaQuoteLeft } from "react-icons/fa";
import "../../styles/TestimonialCard.css";

function TestimonialCard({ name, location, rating, review }) {
  return (
    <div className="testimonial-card">

      <div className="testimonial-quote">
        <FaQuoteLeft />
      </div>

      <div className="testimonial-stars">
        {Array.from({ length: rating }).map((_, index) => (
          <FaStar key={index} />
        ))}
      </div>

      <p className="testimonial-text">
        "{review}"
      </p>

      <h3 className="testimonial-name">
        {name}
      </h3>

      <p className="testimonial-location">
        {location}
      </p>

    </div>
  );
}

export default TestimonialCard;