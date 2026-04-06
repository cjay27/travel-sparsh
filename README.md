# ✈️ Travel Sparsh

A modern, production-ready flight booking management platform. Built with React 18, Node.js, Express, and MySQL.

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Local Development Setup](#-local-development-setup)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
- [Default Admin Account](#-default-admin-account)

---

## ✨ Features

- **Dynamic Flight Search** — Live airport and airline fetching from the backend.
- **PNR Status** — Check live booking status via unique PNR.
- **Booking Management** — Full lifecycle management for flight bookings.
- **Enquiry System** — Contact forms with automated email notifications.
- **Admin Dashboard** — Advanced statistics, revenue tracking, and user management.
- **Automated Mailer** — Immediate email confirmations for users and admins.
- **Secure Auth** — JWT-based authentication with 1-day validity.
- **Modern UI** — Glassmorphism design with premium animations and responsive layout.

---

## 🛠 Tech Stack

| Layer      | Technology                                      |
|------------|-------------------------------------------------|
| Frontend   | React 18, Vite, Vanilla CSS, React Router v6    |
| Backend    | Node.js, Express.js                             |
| Database   | MySQL 8.0+                                      |
| Auth       | JSON Web Tokens (JWT), bcryptjs                 |
| Security   | Helmet, CORS, Rate Limiting                     |
| Email      | Nodemailer (SMTP/Gmail)                         |

---

## 📁 Project Structure

```
Travel Sparsh/
├── backend/
│   ├── src/
│   │   ├── routes/                # Auth, Admin, Bookings, Contacts, etc.
│   │   ├── middleware/            # Auth & Admin role guards
│   │   ├── utils/                 # Mailer, Crypto, Helpers
│   │   └── server.js              # Entry point
│   ├── database/
│   │   └── schema.sql             # MySQL Schema & Seed Data
│   └── .env                       # Backend secrets
│
└── frontend/
    ├── src/
    │   ├── components/            # UI Components & Flight Search
    │   ├── pages/                 # Admin & User Views
    │   ├── context/               # Auth State Management
    │   └── utils/
    │       └── api.js             # Axios API Service
    ├── package.json
    └── vite.config.js
```

---

## 🚀 Local Development Setup

### 1. Database Setup
1. Create a MySQL database named `travel_sparsh`.
2. Run the `backend/database/schema.sql` script in your MySQL client to create tables and seed default data.

### 2. Backend Setup
```bash
cd backend
npm install
npm run dev
```
Backend runs at: **http://localhost:5000**

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at: **http://localhost:5174**

---

## 🔐 Environment Variables (.env)

**Backend:**
```env
DB_HOST=localhost
DB_NAME=travel_sparsh
DB_USER=root
DB_PASSWORD=your_password
JWT_SECRET=your_secret_key
SMTP_USER=admin_user_email
SMTP_PASS=admin_user_password
```

---

## 👤 Default Admin Account

- **Email**: `admin@travelsparsh.com`
- **Password**: `Admin@123`

---

## 📄 License

This project is private. All rights reserved © Travel Sparsh.

---

*Built with ❤️ for Travel Sparsh*

---

## 📄 License

This project is private. All rights reserved © Travel Sparsh.

---

*Built with ❤️ for Travel Sparsh*
