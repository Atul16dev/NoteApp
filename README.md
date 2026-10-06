# Notely

Notely is a personal note management app for capturing and organizing ideas. It
uses a React/Vite client and an Express API backed by MongoDB.

## Features

- Create an account, sign in, and resume a token-verified session.
- Create, edit, and delete private notes with a title, description, and category.
- Search note titles, descriptions, and categories.
- Filter by category and sort by most recently updated or oldest.
- Responsive dashboard, keyboard-accessible dialogs, and dark/light themes.

## Tech stack

- Frontend: React, React Router, Vite, Tailwind CSS, Lucide icons.
- Backend: Node.js, Express, Mongoose, MongoDB, JWT, and bcrypt.

## Run locally

1. Start a local MongoDB instance, then create the backend environment file:

   ```sh
   cd server
   cp .env.example .env
   ```

   Set `MONGO_URI` to `mongodb://localhost:27017/note_app` for local MongoDB.
   Set `JWT_SECRET` to a random secret; for example, generate one with:

   ```sh
   node -e "console.log(require('node:crypto').randomBytes(48).toString('base64url'))"
   ```

   Keep `server/.env` private and out of version control.

2. In one terminal, install and start the API:

   ```sh
   cd server
   npm install
   npm start
   ```

3. In another terminal, install and start the frontend:

   ```sh
   cd frontend
   npm install
   npm run dev
   ```

The API listens on port `5000`; Vite prints the frontend URL when it starts. The
frontend uses `http://localhost:5000/api` by default. Set `VITE_API_URL` to a
different API base URL when needed.

## Checks

Run the frontend production build and lint checks from `frontend`:

```sh
npm run build
npm run lint
```
