
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

import About from "./pages/About";
import Contact from "./pages/Contact";

import Destinations from "./pages/Destinations";
import DestinationDetails from "./pages/DestinationDetails";

import Packages from "./pages/Packages";
import PackageDetails from "./pages/PackageDetails";

import Hotels from "./pages/Hotels";
import HotelDetails from "./pages/HotelDetails";

import Booking from "./pages/Booking";
import MyBookings from "./pages/MyBookings.jsx";

import Wishlist from "./pages/Wishlist";
import NotFound from "./pages/NotFound";
import Travel from "./pages/Travel";
import TravelBookings from "./pages/TravelBookings";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/signup" element={<Signup />} />

        <Route path="/about" element={<About />} />

        <Route path="/contact" element={<Contact />} />

        <Route
          path="/destinations"
          element={<Destinations />}
        />

        <Route
          path="/destinations/:id"
          element={<DestinationDetails />}
        />

        <Route path="/packages" element={<Packages />} />

        <Route
          path="/packages/:id"
          element={<PackageDetails />}
        />

        <Route path="/hotels" element={<Hotels />} />

        <Route
          path="/hotels/:id"
          element={<HotelDetails />}
        />

        {/* New booking form */}
        <Route path="/booking" element={<Booking />} />

        {/* Existing bookings */}
        <Route
          path="/my-bookings"
          element={<MyBookings />}
        />

        <Route
          path="/wishlist"
          element={<Wishlist />}
        />

        <Route path="/travel/:kind" element={<Travel />} />
        <Route path="/my-travel-bookings" element={<TravelBookings />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;
