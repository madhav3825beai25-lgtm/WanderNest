WANDERNEST - ONLY NEW & REPLACEMENT FILES

This is a PATCH ZIP, not a full project. Based on comparison of your uploaded WanderNest_Project(1).zip with the previously supplied integrated project ZIP.

HOW TO USE
1. BACK UP C:\Wandernest first.
2. Extract THIS ZIP directly into C:\Wandernest (not into an extra Wandernest subfolder).
3. Allow Windows to replace existing files when prompted.
4. Existing files not in this ZIP remain unchanged.
5. Do NOT delete your original backend/.env. Configure Google Maps keys locally as described in FINAL_SETUP.md.
6. Run npm install in frontend and backend, then start both servers.
7. Test hotel/package payment and refund before using the new travel features.

IMPORTANT: The added travel flows are a development/demo build; Google Maps and Razorpay end-to-end integration have not been verified with your credentials. Keep your working backup.

REPLACE FILES:
  backend/package.json
  backend/server.js
  index.html
  src/App.jsx
  src/components/layout/Navbar.jsx
  src/pages/MyBookings.jsx

NEW FILES:
  .env.example
  FINAL_SETUP.md
  backend/.env.example
  backend/data/travelInventory.json
  backend/models/TravelBooking.js
  backend/routes/travel.js
  backend/routes/travelPdf.js
  src/components/BookingPdfButtons.jsx
  src/pages/Travel.jsx
  src/pages/TravelBookings.jsx
  src/styles/Travel.css
