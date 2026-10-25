# WanderNest backend — Step 1 (MongoDB + protected booking API)

This is an additive patch for the existing React/Vite app. Keep your current Home page and existing styles. Do not copy `.env`, `.git`, or `node_modules` from any archive.

## Files in this patch

- `lib/server/db.js`: reused MongoDB connection for Vercel Node functions.
- `lib/server/firebase.js`: Firebase Admin ID-token verification helper.
- `lib/server/http.js`: shared API helpers.
- `api/health.js`: `GET /api/health` checks the database connection.
- `api/destinations.js`: `GET /api/destinations` reads seeded destinations.
- `api/hotels.js`: `GET /api/hotels` searches/filter/sorts MongoDB hotel listings.
- `api/booking.js`: authenticated `GET` lists a user's bookings; authenticated `POST` creates a pending booking using prices read from MongoDB, not a client-supplied price.
- `src/data/hotels.js`: creates eight sample hotel listings for each destination.
- `scripts/seed-mongodb.js`: loads local destination/package/hotel sample data into MongoDB.

## 1. Copy files

Extract this patch into your existing project root, allowing the listed files to be added. It includes a replacement `src/data/hotels.js` only; keep your existing `src/data/destinations.js` and `src/data/packages.js`.

## 2. Install packages

Run from your project root:

```bash
npm install mongodb firebase-admin dotenv
```

## 3. Configure local environment

Copy `.env.example` to `.env`, then fill in the values from your own MongoDB Atlas and Firebase projects. Do not share `.env` or commit it. The Admin service-account private key is server-only and must never be exposed through `VITE_` variables.

In MongoDB Atlas, create a database user and allow network access for development and deployment. Use the narrowest practical access rules; do not leave a production database open to everyone.

In Firebase Console, enable an authentication provider (for example Email/Password) and create a service account for the server-side Admin SDK. Copy only the required values into environment variables.

## 4. Seed the sample catalogue

```bash
npm run seed:db
```

The seed script upserts destinations, packages and sample hotels. It labels its own records with `seedSource: "wandernest-sample"` and removes only obsolete records with that same seed label. It does not erase non-seed records.

## 5. Test backend locally

Vite alone does not run Vercel `api/` functions. Use Vercel CLI to run the app and functions together:

```bash
npx vercel dev
```

Then open `http://localhost:3000/api/health`. A successful response includes `"database":"connected"`. If the environment is incomplete, the API returns an error without revealing credentials.

Test public catalog endpoints:

- `http://localhost:3000/api/destinations`
- `http://localhost:3000/api/hotels?destinationId=5&limit=8`
- `http://localhost:3000/api/hotels?q=Bali&sort=priceAsc`

`GET /api/booking` and `POST /api/booking` require `Authorization: Bearer <Firebase ID token>`. The frontend must sign in with Firebase and send `await currentUser.getIdToken()` before using them.

## Booking/payment status

The `POST /api/booking` endpoint creates a `pending_payment` booking record. It does not yet create a Razorpay order or confirm that payment was received. That is deliberately the next integration step. Do not treat these sample catalogue listings/prices as real inventory. The tax rate is only an illustrative default and must be confirmed before production.

## Deployment notes

Configure the same server-side environment variables in Vercel Project Settings before deployment. After adding the files, redeploy. Keep `MONGODB_URI`, `FIREBASE_PRIVATE_KEY`, and all payment secrets as server-side environment variables.
