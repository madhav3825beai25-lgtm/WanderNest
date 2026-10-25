WanderNest simulated flight search patch

Copy the backend/ and src/ folders into C:\Wandernest and allow overwrite of matching files.
Run backend: cd C:\Wandernest\backend && npm start (or node server.js)
Run frontend: cd C:\Wandernest && npm run dev

Adds 50-city domestic flight city-pair searches, sample international hub connections, and native city suggestions. Train inventory remains unchanged; no invented train routes. All fares/timings are simulated and NOT live. No real ticket is issued. Existing booking/payment/refund endpoints are retained.

NOTE: For any live airline integration, an authorized provider account and separate booking/payment integration are needed.
