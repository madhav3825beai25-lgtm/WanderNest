WanderNest Premium + Round Trip Patch

Backup C:\Wandernest and C:\Wandernest\backend before replacing.
Copy the src and backend folders from ZIP into C:\Wandernest (merge and replace).
Frontend: cd C:\Wandernest ; npm run dev
Backend: cd C:\Wandernest\backend ; node server.js

NEW FILES: src/styles/PremiumTheme.css, src/styles/RoundTrip.css
REPLACE: src/main.jsx, src/pages/Travel.jsx, src/pages/TravelBookings.jsx, backend/models/TravelBooking.js, backend/routes/travel.js, backend/routes/travelPdf.js

Round trip: only flight routes with matching reverse city pairs in sample inventory. Server calculates both fares using class factors and passenger count. One Razorpay test order/payment covers both legs. PDF includes both legs. Cancellation is BOTH legs only, and policy uses ONWARD departure date (earliest leg), with one refund on the total payment. Partial leg cancellation is not supported.

IMPORTANT: Demo inventory/tickets are NOT real travel bookings. Do not use live Razorpay keys. Existing backend refund processing should be tested with a small Test Mode transaction before reliance. No live end-to-end payment tests performed here.
