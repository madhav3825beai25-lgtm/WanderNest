import packages from "../../data/packages";
import PackageCard from "./PackageCard";
import "../../styles/FeaturedPackages.css";

function FeaturedPackages() {
  return (
    <section className="featured-packages">
      <div className="featured-packages-heading">
        <span>TRAVEL WITH US</span>

        <h2>Popular Tour Packages</h2>

        <p>
          Choose from our carefully designed travel packages and
          make your next journey unforgettable.
        </p>
      </div>

      <div className="package-grid">
        {packages.map((packageItem) => (
          <PackageCard
            key={packageItem.id}
            packageItem={packageItem}
          />
        ))}
      </div>
    </section>
  );
}

export default FeaturedPackages;