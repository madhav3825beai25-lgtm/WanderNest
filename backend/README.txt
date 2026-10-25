WANDERNEST RAZORPAY TEST CANCELLATION - BACKEND

Copy files into C:\Wandernest\backend preserving folders. Back up originals first.

IMPORTANT: The supplied server.js in chat must be modified: immediately BEFORE
app.use(express.json({ limit: "1mb" })); insert:

const refundWebhookRoutes = require("./routes/refundWebhook");
app.use("/api/webhooks/razorpay", express.raw({ type: "application/json" }), refundWebhookRoutes);

Add RAZORPAY_WEBHOOK_SECRET to backend/.env. Never commit/share it.
Webhook URL for deployed backend: https://YOUR_DOMAIN/api/webhooks/razorpay
Subscribe to refund.processed and refund.failed. Localhost needs a secure tunnel to receive webhooks.

TEST MODE ONLY: services/razorpayClient.js rejects non-test key IDs.

Cancellation endpoint: PATCH /api/bookings/:bookingId/cancel (Bearer token).
Quote endpoint: GET /api/bookings/:bookingId/cancellation-quote (Bearer token).

SECURITY / OPERATIONAL NOTES:
- Payment order creation can remain pending if Razorpay creation fails. Resolve manually before retrying.
- Refund API uncertain responses intentionally move to review_required; NEVER blindly retry.
- Refund processing can be asynchronous. Use webhook to reconcile.
- If payment status is authorized/in progress, cancellation is blocked.
- Legacy orders and multiple captured payments require manual review.
- MongoDB state lock is not a full distributed transaction across Razorpay; deploy a reconciliation job before production.
- Test mode is for college demo, not production deployment.
- Make a full backup and test with fresh TEST-mode bookings before modifying existing data.

Check syntax in PowerShell:
node --check models/Booking.js
node --check services/cancellationPolicy.js
node --check services/razorpayClient.js
node --check routes/bookings.js
node --check routes/payments.js
node --check routes/refundWebhook.js

Backend start: node server.js
