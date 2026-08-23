import "../../styles/Hero.css";

function Hero() {
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
              placeholder="Search destinations..."
            />

            <button>Explore Now</button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;