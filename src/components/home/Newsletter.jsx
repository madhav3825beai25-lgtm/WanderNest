import "../../styles/Newsletter.css";

function Newsletter() {
  return (
    <section className="newsletter">
      <div className="newsletter-content">
        <h2>Stay Updated with WanderNest</h2>

        <p>
          Subscribe to our newsletter and get the latest travel deals,
          destinations and exclusive offers.
        </p>

        <form className="newsletter-form">
          <input
            type="email"
            placeholder="Enter your email address"
            required
          />

          <button type="submit">
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}

export default Newsletter;