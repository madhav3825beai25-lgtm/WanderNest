import Hero from "../components/home/Hero";
import FeaturedDestinations from "../components/home/FeaturedDestinations";
import FeaturedPackages from "../components/home/FeaturedPackages";
import WhyChooseUs from "../components/home/WhyChooseUs";
import Testimonials from "../components/home/Testimonials";
import Newsletter from "../components/home/Newsletter";
import hotels, { formatHotelPrice } from "../data/hotels";
function Home() {
  return (
    <>
      <Hero />
      <FeaturedDestinations />
      <FeaturedPackages />
      <WhyChooseUs />
      <Testimonials />
      <Newsletter />
    </>
  );
}

export default Home;