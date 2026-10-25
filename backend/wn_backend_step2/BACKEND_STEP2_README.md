# WanderNest backend – Step 2: catalogue APIs

This overlay adds MongoDB models, read APIs, and a seed script. It does not touch the existing React home page.

## Copy files
Copy the `backend/models` directory, `backend/scripts/seed-mongodb.js`, and replacement `backend/server.js` into the existing `C:\Wandernest` project, merging folders rather than deleting existing files.

## Check `backend/.env`
Keep your existing MongoDB URI. Ensure these keys are set:

```env
PORT=5000
MONGO_URI=YOUR_EXISTING_MONGODB_CONNECTION_STRING
MONGO_DB_NAME=wandernest
FRONTEND_ORIGIN=http://localhost:5173
```

Do not share or commit `.env`. The server also allows `http://localhost:5174` for the Vite fallback port.

## Seed sample data
Run from `C:\Wandernest\backend`:

```powershell
node scripts/seed-mongodb.js
```

This imports `src/data/destinations.js`, upserts every destination into MongoDB, and creates eight sample hotel listings per destination (30 destinations means 240 listings). Re-running safely updates rows using numeric IDs. All hotel prices, ratings, and inventory are sample data, not live supplier data.

## Start the API
Run from `C:\Wandernest\backend`:

```powershell
node server.js
```

## Endpoints
- `GET http://localhost:5000/api/health`
- `GET http://localhost:5000/api/destinations`
- `GET http://localhost:5000/api/destinations?q=bal`
- `GET http://localhost:5000/api/destinations/5`
- `GET http://localhost:5000/api/hotels?destinationId=5`
- `GET http://localhost:5000/api/hotels?q=Bali&sort=priceAsc`
- `GET http://localhost:5000/api/hotels/501`

API response format for lists is `{ success, count, data }`.

This step does not implement bookings or Razorpay. Booking writes and payments will be added only after catalogue APIs work.
