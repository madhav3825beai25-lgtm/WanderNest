import { Routes, Route } from "react-router-dom";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";

import Destinations from "./pages/Destinations";
import DestinationDetails from "./pages/DestinationDetails";

import Packages from "./pages/Packages";
import PackageDetails from "./pages/PackageDetails";

import Hotels from "./pages/Hotels";
import HotelDetails from "./pages/HotelDetails";

import Booking from "./pages/Booking";
import Wishlist from "./pages/Wishlist";

import NotFound from "./pages/NotFound";

function App() {
  return (
    <>
      <Navbar />

      <Routes>

        {/* HOME */}
        <Route
          path="/"
          element={<Home />}
        />

        {/* ABOUT */}
        <Route
          path="/about"
          element={<About />}
        />

        {/* CONTACT */}
        <Route
          path="/contact"
          element={<Contact />}
        />

        {/* DESTINATIONS */}
        <Route
          path="/destinations"
          element={<Destinations />}
        />

        <Route
          path="/destinations/:id"
          element={<DestinationDetails />}
        />

        {/* PACKAGES */}
        <Route
          path="/packages"
          element={<Packages />}
        />

        <Route
          path="/packages/:id"
          element={<PackageDetails />}
        />

        {/* HOTELS */}
        <Route
          path="/hotels"
          element={<Hotels />}
        />

        <Route
          path="/hotels/:id"
          element={<HotelDetails />}
        />

        {/* BOOKING */}
        <Route
          path="/booking"
          element={<Booking />}
        />

        {/* WISHLIST */}
        <Route
          path="/wishlist"
          element={<Wishlist />}
        />

        {/* 404 */}
        <Route
          path="*"
          element={<NotFound />}
        />

      </Routes>

      <Footer />
    </>
  );
}

export default App;