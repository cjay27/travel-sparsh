# ✈️ Travel Sparsh

A modern flight booking affiliate website powered by [Adivaha](https://www.adivaha.com/) as the booking engine partner. Built with React, Node.js, Express, and MongoDB.

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Local Development Setup](#-local-development-setup)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
- [Deployment Guide](#-deployment-guide)
  - [Deploy Backend to Render](#deploy-backend-to-render-free)
  - [Deploy Frontend to Vercel](#deploy-frontend-to-vercel-free)
  - [Deploy with Docker](#deploy-with-docker)
- [Default Admin Account](#-default-admin-account)
- [Adivaha Integration](#-adivaha-integration)

---

## ✨ Features

- **Flight Search** — Search flights redirected to Adivaha white-label booking engine
- **PNR Status** — Check PNR and live booking status
- **Booking History** — Full booking history management per user
- **Last Minute Deals** — Live deals fetched from Adivaha API
- **Auth System** — Admin / User / Guest roles with JWT
- **Dark / Light Theme** — Auto-detects system preference, persists in localStorage
- **Responsive Design** — Mobile, tablet, and desktop ready
- **Secure API** — NoSQL injection prevention, XSS clean, rate limiting, Helmet headers
- **Admin Dashboard** — Manage users, bookings, and contact submissions
- **Contact Page** — Customer enquiry form saved to database

---

## 🛠 Tech Stack

| Layer      | Technology                                      |
|------------|-------------------------------------------------|
| Frontend   | React 18, Vite, Tailwind CSS, React Router v6   |
| Backend    | Node.js, Express.js                             |
| Database   | MongoDB (Mongoose ODM)                          |
| Auth       | JSON Web Tokens (JWT), bcryptjs                 |
| Security   | Helmet, express-mongo-sanitize, xss-clean, HPP  |
| Payment    | Razorpay (optional) / Adivaha handles payment   |
| Deployment | Render (backend), Vercel (frontend)             |

---

## 📁 Project Structure

```
Travel Sparsh/
├── backend/
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── bookingController.js
│   │   ├── adminController.js
│   │   └── dealController.js
│   ├── middleware/
│   │   ├── auth.js                # JWT verify + role guard
│   │   └── sanitize.js            # Global error handler
│   ├── models/
│   │   ├── User.js
│   │   ├── Booking.js
│   │   └── Contact.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── bookings.js
│   │   ├── admin.js
│   │   ├── deals.js
│   │   └── contact.js
│   ├── .env                       # Your local env (git-ignored)
│   ├── .env.example               # Template for env vars
│   ├── package.json
│   └── server.js                  # Express entry point
│
└── frontend/
    ├── src/
    │   ├── components/            # Reusable UI components
    │   ├── context/               # Auth + Theme context
    │   ├── pages/                 # Page-level components
    │   └── utils/
    │       └── api.js             # Axios instance + interceptors
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    └── package.json
```

---

## 📦 Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) v18 or higher
- [MongoDB](https://www.mongodb.com/try/download/community) (local) **or** a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster
- npm v9 or higher

Verify with:
```bash
node -v
npm -v
```

---

## 🚀 Local Development Setup

### 1. Clone / Download the project

```bash
cd "e:/Adivaha Travel Sparsh"
```

### 2. Setup the Backend

```bash
cd backend

# Install dependencies
npm install

# Copy the env template and fill in your values
cp .env.example .env
```

Edit `backend/.env` (see [Environment Variables](#-environment-variables) section below).

```bash
# Start backend in development mode (auto-reload)
npm run dev
```

Backend runs at: **http://localhost:5000**

Health check: **http://localhost:5000/api/health**

---

### 3. Setup the Frontend

Open a **new terminal**:

```bash
cd frontend

# Install dependencies
npm install

# Start frontend dev server
npm run dev
```

Frontend runs at: **http://localhost:5173**

> The Vite dev server automatically proxies all `/api` requests to `http://localhost:5000` — no CORS issues during development.

---

## 🔐 Environment Variables

Create `backend/.env` based on `backend/.env.example`:

```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB — Use local or Atlas URI
MONGO_URI=mongodb://localhost:27017/travel_sparsh
# Atlas example:
# MONGO_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/travel_sparsh?retryWrites=true&w=majority

# JWT — Change this to a long random string in production
JWT_SECRET=replace_this_with_a_very_long_random_secret_key_min_32_chars
JWT_EXPIRE=7d

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
# Production example:
# FRONTEND_URL=https://travelsparsh.vercel.app

# Adivaha Affiliate Settings
ADIVAHA_AFFILIATE_ID=TRAVEL_SPARSH
ADIVAHA_CLIENT_URL=https://booking.adivaha.com
# Get these from your Adivaha partner account dashboard
```

> **Never commit `.env` to git.** It is already listed in `.gitignore`.

---

## 📡 API Reference

Base URL: `http://localhost:5000/api`

| Method | Endpoint                     | Auth     | Description                     |
|--------|------------------------------|----------|---------------------------------|
| GET    | `/health`                    | None     | Server health check             |
| POST   | `/auth/register`             | None     | Register new user               |
| POST   | `/auth/login`                | None     | Login and get JWT token         |
| GET    | `/auth/me`                   | User     | Get current user profile        |
| GET    | `/bookings`                  | User     | Get user's booking history      |
| POST   | `/bookings`                  | User     | Save a booking                  |
| GET    | `/bookings/pnr/:pnr`         | None     | Check PNR status                |
| POST   | `/bookings/callback`         | None     | Adivaha webhook (booking notify)|
| GET    | `/deals`                     | None     | Get last minute deals           |
| POST   | `/contact`                   | None     | Submit contact form             |
| GET    | `/admin/users`               | Admin    | List all users                  |
| GET    | `/admin/bookings`            | Admin    | List all bookings               |
| GET    | `/admin/contacts`            | Admin    | List all contact submissions    |
| PUT    | `/admin/users/:id`           | Admin    | Update user                     |
| DELETE | `/admin/users/:id`           | Admin    | Delete user                     |

**Rate Limits:**
- General API: 100 requests / 15 minutes
- Auth endpoints: 10 requests / 15 minutes

---

## ☁️ Deployment Guide

### Deploy Backend to Render (Free)

1. Push your project to a GitHub repository

2. Go to [render.com](https://render.com) → **New** → **Web Service**

3. Connect your GitHub repo and select the `backend` folder as the **Root Directory**

4. Configure:
   | Setting         | Value              |
   |-----------------|--------------------|
   | **Runtime**     | Node                |
   | **Build Command** | `npm install`    |
   | **Start Command** | `npm start`      |

5. Add **Environment Variables** in Render dashboard:
   ```
   NODE_ENV=production
   PORT=5000
   MONGO_URI=<your MongoDB Atlas URI>
   JWT_SECRET=<your long random secret>
   JWT_EXPIRE=7d
   FRONTEND_URL=https://your-app.vercel.app
   ADIVAHA_AFFILIATE_ID=TRAVEL_SPARSH
   ADIVAHA_CLIENT_URL=https://booking.adivaha.com
   ```

6. Deploy. Your API will be live at: `https://your-service.onrender.com`

---

### Deploy Frontend to Vercel (Free)

1. Go to [vercel.com](https://vercel.com) → **New Project** → Import from GitHub

2. Set the **Root Directory** to `frontend`

3. Add **Environment Variable**:
   ```
   VITE_API_URL=https://your-service.onrender.com/api
   ```

4. Update `frontend/src/utils/api.js` — change the baseURL to use the env var:
   ```js
   baseURL: import.meta.env.VITE_API_URL || '/api'
   ```

5. Deploy. Your site will be live at: `https://your-app.vercel.app`

6. Go back to Render and update `FRONTEND_URL` to your Vercel URL.

---

### Deploy with Docker

A `docker-compose.yml` for running everything locally with Docker:

```yaml
version: '3.8'
services:
  mongo:
    image: mongo:7
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - MONGO_URI=mongodb://mongo:27017/travel_sparsh
      - JWT_SECRET=your_secret_here
      - NODE_ENV=production
      - FRONTEND_URL=http://localhost:3000
    depends_on:
      - mongo

  frontend:
    build: ./frontend
    ports:
      - "3000:80"
    depends_on:
      - backend

volumes:
  mongo_data:
```

Add a `Dockerfile` in `backend/`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

Add a `Dockerfile` in `frontend/`:
```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
```

Run everything:
```bash
docker-compose up --build
```

---

## 👤 Default Admin Account

After the first startup, you can create an admin user by registering normally and then updating the role directly in MongoDB:

```js
// In MongoDB shell or Compass
db.users.updateOne(
  { email: "admin@travelsparsh.com" },
  { $set: { role: "admin" } }
)
```

Or use the `/api/auth/register` endpoint and update via the admin dashboard.

---

## 🔗 Adivaha Integration

Travel Sparsh uses [Adivaha](https://www.adivaha.com/) as a white-label flight booking engine.

**How it works:**
1. User fills in the flight search form on Travel Sparsh
2. User is redirected to Adivaha's booking engine with affiliate tracking parameters
3. Adivaha handles flight inventory, seat selection, and payment
4. After booking, Adivaha calls our webhook (`POST /api/bookings/callback`) with booking details
5. We store the booking in MongoDB and show it in the user's booking history

**To configure your Adivaha affiliate:**
1. Register at [adivaha.com](https://www.adivaha.com/) and get your Affiliate ID and Client URL
2. Update `ADIVAHA_AFFILIATE_ID` and `ADIVAHA_CLIENT_URL` in `.env`
3. Set the webhook URL in your Adivaha partner dashboard to: `https://your-backend.onrender.com/api/bookings/callback`

---

## 📄 License

This project is private. All rights reserved © Travel Sparsh.

---

*Built with ❤️ for Travel Sparsh*
