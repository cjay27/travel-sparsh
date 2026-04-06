# Travel Sparsh - Backend API

Production-ready Node.js & MySQL backend for Travel Sparsh website.

## 🚀 Key Features
- **Modern REST API**: Modular routes for Auth, Admin, and Enquiries (Contacts).
- **Secure Authentication**: JWT-based auth with 1-day token validity.
- **Data Privacy**: Bcrypt password hashing.
- **Automated Mailer**: Nodemailer integration for enquiry confirmations and expert alerts.
- **Advanced Dashboard Stats**: Real-time aggregation of lead trends and enquiry volume.

## 🛠 Tech Stack
- **Runtime**: Node.js v18+
- **Framework**: Express.js
- **Database**: MySQL (using `mysql2/promise` pool)
- **Email**: Nodemailer

## 📁 Project Structure
- `/src/routes`: API endpoints and route logic.
- `/src/middleware`: Auth and Admin role enforcement.
- `/src/utils`: Reusable utilities (Mailer, Crypto).
- `/database`: SQL schema and setup scripts.

## ⚙️ Environment Variables (.env)
```env
PORT=5000
DB_HOST=localhost
DB_NAME=travel_sparsh
DB_USER=db_root_user
DB_PASSWORD=your_password
JWT_SECRET=your_long_secret
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

## 📝 Setup
1. `npm install`
2. Create `travel_sparsh` database in MySQL.
3. Run `node database/setup.js` to initialize tables and admin.
4. `npm run dev` to start the server.

## ⚓ API Endpoints
- `POST /api/auth/login`: Admin/User login.
- `GET /api/admin/stats`: Secure dashboard overview (Enquiries, Users).
- `POST /api/contact`: Public enquiry submission.
- `GET /api/contact/my`: User's enquiry history.
