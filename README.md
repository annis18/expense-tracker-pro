# Expense Tracker Pro

A full-stack MERN expense tracking application with JWT authentication, real-time CRUD operations, and interactive data visualization.

## Tech Stack
* **Frontend:** React (Vite), Tailwind CSS, React Router, Recharts, Axios, Lucide Icons
* **Backend:** Node.js, Express, MongoDB (Atlas), Mongoose
* **Auth:** JWT with bcrypt password hashing

## Features
* User registration and login with JWT-based authentication
* Protected routes — unauthenticated users are redirected to login
* Full CRUD on transactions (create, read, update, delete)
* Real-time search, category filtering, and multi-field sorting
* Dashboard with live summary cards and recent transaction feed
* Interactive Pie, Bar, and Area charts for spending analysis
* Fully responsive dark-themed UI

## Project Structure
* `expense-tracker-pro/` → React frontend (Vite)
* `server/` → Express backend + MongoDB

## Running Locally

**Backend:**
```bash
cd server
npm install
npm run dev
```

**Frontend:**
```bash
cd expense-tracker-pro
npm install
npm run dev
```

The frontend expects the backend running on `http://localhost:5000`.
Create a `.env` file in `server/` based on `.env.example` with your own
MongoDB Atlas connection string and JWT secret.

## Live Demo

Frontend: _(Vercel URL goes here after Step 3)_
Backend API: _(Render URL goes here after Step 3)_

## Live Demo

Frontend: https://expense-tracker-pro-indol.vercel.app
Backend API: https://expense-tracker-api-wlyu.onrender.com/api/health