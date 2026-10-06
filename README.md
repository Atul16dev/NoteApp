# 📝 Notely

Notely is a full-stack personal note management application for creating, organizing, and managing private notes.

It uses a **React/Vite frontend** and a **Node.js/Express REST API** backed by **MongoDB**, with JWT-based authentication for secure user sessions.

## ✨ Features

* 🔐 User registration and login
* 🔑 JWT-based authentication
* 📝 Create, edit, and delete private notes
* 🏷️ Organize notes using categories
* 🔍 Search notes by title, description, or category
* ↕️ Sort notes by recently updated or oldest
* 🛡️ Protected API routes
* 🌙 Dark/light theme support
* 📱 Responsive dashboard
* ⌨️ Keyboard-accessible dialogs
* ✅ Confirmation dialog before deleting notes
* 🔔 User-friendly notifications

## 🛠️ Tech Stack

### Frontend

* React
* React Router
* Vite
* Tailwind CSS
* Axios
* Lucide Icons

### Backend

* Node.js
* Express.js
* Mongoose
* MongoDB
* JSON Web Token (JWT)
* bcrypt

## 📁 Project Structure

```text
Notely/
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── context/
│       ├── pages/
│       └── services/
│
├── server/
│   ├── db/
│   ├── routes/
│   ├── middleware.js
│   └── index.js
│
├── .gitignore
└── README.md
```

## 🚀 Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/Atul16dev/NoteApp.git
cd NoteApp
```

### 2. Configure the backend

Create the environment file:

```bash
cd server
```

Copy `.env.example` to `.env`.

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Then configure your `.env`:

```env
MONGO_URI=mongodb://localhost:27017/note_app
JWT_SECRET=your_random_secret
PORT=5000
```

> Keep `server/.env` private. Never commit it to GitHub.

For a stronger JWT secret, you can generate one using:

```bash
node -e "console.log(require('node:crypto').randomBytes(48).toString('base64url'))"
```

### 3. Install backend dependencies

```bash
cd server
npm install
```

Start the backend:

```bash
npm start
```

The API runs on:

```text
http://localhost:5000
```

### 4. Install frontend dependencies

Open another terminal:

```bash
cd frontend
npm install
```

Start the development server:

```bash
npm run dev
```

Vite will display the frontend URL, normally:

```text
http://localhost:5173
```

The frontend uses the backend API:

```text
http://localhost:5000/api
```

You can configure a different API URL using:

```env
VITE_API_URL=your_api_url
```

## 🔐 Environment Variables

### Backend

Create `server/.env`:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

### Frontend

If required, create a frontend environment file:

```env
VITE_API_URL=your_backend_api_url
```

**Never upload real secrets, database credentials, or JWT secrets to GitHub.**

The repository contains `.env.example` files as configuration templates.

## 🧪 Checks

From the `frontend` directory, run:

```bash
npm run build
```

To run lint checks:

```bash
npm run lint
```

Both commands should complete successfully before deployment.

## 🌐 Deployment

The application can be deployed using:

* **Frontend:** Vercel
* **Backend:** Render
* **Database:** MongoDB Atlas

Production environment variables must be configured on the hosting platforms.

## 📸 Screenshots

Add screenshots of the main application screens here:

* Login
* Signup
* Notes Dashboard
* Create/Edit Note
* Dark Mode

## 👨‍💻 Author

**Atul Kumar**

GitHub: https://github.com/Atul16dev
