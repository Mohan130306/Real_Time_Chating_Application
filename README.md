# Real Time Chat Application

This project is a full-stack React + Express + Socket.IO chat app with MongoDB.

## Deployment Overview

### Firebase Hosting + Cloud Run

- Frontend is built with Vite and hosted on Firebase Hosting.
- Backend is deployed to Google Cloud Run.
- Firebase Hosting rewrites `/api/**` and `/socket.io/**` traffic to Cloud Run.

### Required production environment variables

Set these in Firebase / Cloud Run secrets:

- `MONGO_URI` — MongoDB Atlas connection string
- `JWT_SECRET` — JWT signing key
- `JWT_EXPIRES_IN` — e.g. `7d`
- `CLIENT_URL` — your Firebase Hosting URL, e.g. `https://your-app.web.app`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

### Deploy steps

1. Install Firebase CLI and Google Cloud SDK.
2. Run `firebase login` and `gcloud auth login`.
3. Build frontend:
   - `cd client`
   - `npm install`
   - `npm run build`
4. Deploy backend to Cloud Run:
   - `cd server`
   - `gcloud builds submit --tag gcr.io/<PROJECT-ID>/real-time-chat-backend`
   - `gcloud run deploy real-time-chat-backend --image gcr.io/<PROJECT-ID>/real-time-chat-backend --platform managed --region us-central1 --allow-unauthenticated --update-env-vars MONGO_URI="<your-atlas-uri>",JWT_SECRET="<secret>",CLIENT_URL="https://<your-app>.web.app"`
5. Deploy frontend to Firebase Hosting:
   - `cd client`
   - `firebase deploy --only hosting`

### Notes

- The backend requires Atlas in production. The local fallback to in-memory MongoDB is only for dev.
- Make sure your Atlas cluster allows connections from Cloud Run IP ranges or use VPC peering.
- For Socket.IO to work through Firebase, use Firebase Hosting rewrites to Cloud Run and maintain the `/socket.io` path.

## Local development

- `npm run dev:server`
- `npm run dev:client`

## Firebase-specific config

- `firebase.json` at repo root rewrites API and socket traffic to Cloud Run.
- `client/firebase.json` handles only static hosting.
