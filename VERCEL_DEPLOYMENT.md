# Deploy AppleBD on Vercel

The frontend and Express API are separate Vercel projects. The frontend talks to the API over HTTP; MongoDB is only accessed by the backend.

## 1. Deploy the API

Create a Vercel project for this repository and set **Root Directory** to `Apple-BD-Backend`.

The backend's `vercel.json` sends requests to `index.js`, which exports the Express app without calling `listen()` in Vercel. Configure the following environment variables in the backend Vercel project (Production and Preview as needed):

| Variable | Purpose |
| --- | --- |
| `MONGODB_URI` | MongoDB Atlas connection string; ensure Atlas network access allows Vercel connections |
| `JWT_SECRET` | Strong random secret used to sign authentication tokens |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary account name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `STORE_ID` | SSLCommerz store ID (sandbox credentials are sufficient for a demo) |
| `STORE_PASSWORD` | SSLCommerz store password |
| `ALLOWED_ORIGINS` | Comma-separated frontend origins, e.g. `https://your-store.vercel.app,https://your-custom-domain.com` |
| `PUBLIC_UPLOAD_BASE` | Public backend origin used to form uploaded media URLs, e.g. `https://your-api.vercel.app` |

Other optional integrations (mail, courier, Redis, Firebase-related settings, etc.) only need values if the feature is being demonstrated. For Vercel preview URLs that change per deployment, set `VERCEL_PROJECT_PATTERN` to a carefully scoped regular expression matching only your frontend's preview URLs; do not use a pattern that accepts every origin.

After deployment, test the API at `https://your-api.vercel.app/`. It should return `Welcome to AppleBD Backend!`. Then test `https://your-api.vercel.app/api/homepage`; a working database connection returns JSON.

## 2. Deploy the frontend

Create a second Vercel project and set **Root Directory** to `Apple-BD`. Use the detected Next.js framework settings; the build command is `npm run build`.

Set this frontend environment variable for each environment and redeploy after changing it:

| Variable | Value |
| --- | --- |
| `NEXT_PUBLIC_API_URL` | Backend origin only, with no trailing slash, e.g. `https://your-api.vercel.app` |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase web app API key, if using Firebase sign-in |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase web app auth domain |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase project ID |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase web app ID |

The code defaults this value to `https://api.applebd.com`. If the API is deployed at another URL and this variable is absent, the deployed frontend will call the old domain. The backend's `ALLOWED_ORIGINS` must include the exact frontend origin (scheme and hostname) for browser API calls and cookie-based login to work.

## 3. Verify the connection

1. Open the API root and `/api/homepage` directly. Confirm the API root responds and the homepage endpoint returns JSON.
2. Open the frontend and check browser developer tools → Network. Requests should target the configured API origin, not `api.applebd.com` unless that is your deployed backend.
3. If the API works directly but the browser blocks it, check the backend's `ALLOWED_ORIGINS` and Vercel function logs. If API requests return server errors, check the backend's required environment variables and MongoDB Atlas connection/network settings.
4. Test login separately: requests using auth cookies need `credentials: "include"`; frontend and backend must both use HTTPS, and CORS must allow the frontend origin with credentials.

## Vercel-specific limitations to account for

- Vercel functions are not always-on servers. The backend disables `setInterval` jobs on Vercel and exposes cron tasks under `/api/cron/*`; those routes require `CRON_SECRET` and should only be called by a scheduler configured with that secret.
- The backend currently writes newly uploaded media to its local filesystem. Vercel function storage is ephemeral, so uploads made on Vercel are not durable. Use persistent object storage (such as Cloudinary) for production/demo uploads, or disable upload-dependent demo flows.
- Vercel's filesystem does not provide a shared persistent store between function instances. Do not rely on `/uploads` files surviving another invocation or deployment.

## Environment variable security

Never commit `.env` files or put backend secrets in frontend `NEXT_PUBLIC_*` variables. If a real credential has been included in a tracked file or shared, rotate it with its provider and update the Vercel environment variable.
