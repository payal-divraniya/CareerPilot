# CareerPilot — Job Application Tracker

CareerPilot helps users organize job applications, track statuses, search and filter opportunities, and review progress from a personal dashboard. **This version has no AI functionality.**

## Stack
- React + Vite + Tailwind CSS
- Node.js + Express
- MongoDB + Mongoose
- JWT authentication + bcrypt password hashing

## Local setup

### 1. Backend
```bash
cd server
npm install
```
Copy `.env.example` to `.env` and set `MONGO_URI`, `JWT_SECRET` (at least 32 characters), and `CLIENT_URL`. Start local MongoDB or use a MongoDB Atlas connection string.

```bash
npm run dev
```
API: `http://localhost:5000`; health check: `http://localhost:5000/api/health`.

### 2. Frontend
In a second terminal:
```bash
cd client
npm install
```
Copy `.env.example` to `.env` if you want to configure the API URL. Then run:
```bash
npm run dev
```
Frontend: `http://localhost:5173`.

## Legacy JSON migration
The backend now uses MongoDB for users and applications. If you have data in the old JSON files, first back up your database and JSON files. Then from `server/`, run:
```bash
node scripts/migrateLegacyJson.js
```
The migration is optional and does not delete or modify the JSON files. It imports only applications that can be safely linked to a migrated user. Orphan applications are skipped instead of assigning them to the wrong account. Review the migration summary before removing any backups.

## Deployment notes
- Deploy `server/` as a Node web service and set `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`, and `PORT` in the hosting dashboard.
- Deploy `client/` as a static Vite site with build command `npm run build` and output directory `dist`.
- Set `VITE_API_URL` to the deployed API base URL ending in `/api` before building the frontend.
- Set `CLIENT_URL` to the exact deployed frontend origin. Do not use `*` for a public production deployment.
- Never commit `.env` files or production secrets. `.env.example` contains placeholders only.
- A successful local build does not itself prove a live deployment or remote MongoDB connectivity.

## Security and data notes
- Protected application endpoints check JWT authentication and scope queries to the authenticated user.
- Passwords are hashed; the API never returns the password hash.
- Legacy JSON data is retained as a backup until you verify migration results.
