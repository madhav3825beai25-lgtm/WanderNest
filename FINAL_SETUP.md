# WanderNest Integrated College Project

## Modules
- 50 domestic + 60 international **sample flight routes**
- 110 domestic + 60 international **sample train routes**
- Google Places address autocomplete, Google Routes driving distance and demo cab fares
- Razorpay **Test Mode** orders, server verification, cancellation/refund reconciliation
- PDF invoice, demo travel ticket, cancellation receipt
- Existing hotel/package booking/payment/refund files preserved, with PDF buttons added

## Run
1. Frontend: `npm install`, `npm run dev`
2. Backend: `cd backend`, `npm install`, `node server.js`
3. Set secrets in `backend/.env` (copy keys from your original safe local .env). Never upload secrets.
4. Frontend optional `.env`: `VITE_API_URL=http://localhost:5000`, `VITE_GOOGLE_MAPS_BROWSER_KEY=...`
5. Google Cloud: enable **Places API (New)** and **Routes API**; enable billing. Restrict browser key by HTTP referrer and API; restrict server key by API and server egress IP where applicable. Browser key is public; do not put a secret key there.
6. Routes: `/travel/flight`, `/travel/train`, `/travel/cab`, `/my-travel-bookings`, `/my-bookings`.

## Limitations / safety
- Flight and train data are illustrative; NOT live schedules, availability, ticket inventory, or valid PNR. No real ticket issued.
- Cab quote is from actual Google driving route where supported, but fare and cab dispatch are DEMO. Google APIs may charge fees.
- New travel booking refunds are handled by a dedicated route. If refund request outcome is uncertain, booking enters manual review rather than retrying.
- Razorpay is Test Mode; no real money.
- Cab quote cache is in memory and expires after 10 minutes; restart clears quotes. For production use Redis and persistent booking/payment idempotency.
- Verify payments/refunds in Razorpay test dashboard; end-to-end live credentials and Google keys were not provided, so live integrations could not be exercised here.
- Hotel/package invoices show the existing booking record, not statutory GST invoices.
