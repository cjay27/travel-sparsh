# Travel Sparsh - Frontend Web Application

A premium, modern React frontend for the Travel Sparsh website. Built with React 18, Vite, and glassmorphism design.

## 🚀 Key Features
- **Dynamic Flight Enquiry**: Direct integration for travel expert leads.
- **Admin Dashboard**: Comprehensive management of Users, Airlines, Airports, and Enquiries.
- **Modern UI**: Styled with Vanilla CSS (Glassmorphism, Vibrant Palettes, and Smooth Animations).
- **Responsive Routing**: Built with `react-router-dom` v6+.
- **Secure Authentication**: JWT token management and role-based access control (Admin/User).

## 🛠 Tech Stack
- **Library**: React 18+
- **Build Tool**: Vite
- **Styling**: Vanilla CSS (Global Styles & Component Modules)
- **State Management**: React Context API
- **HTTP Client**: Axios

## 📁 Project Structure
- `/src/components`: Reusable UI components (FlightSearch, Navbar, EnquiryCard).
- `/src/pages`: Main application page views.
- `/src/context`: Authentication and global state management.
- `/src/utils`: API service layer.
- `/src/styles`: Theme and global CSS tokens.

## ⚙️ Environment Variables (.env)
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## 📝 Setup
1. `npm install`
2. `npm run dev` to start the frontend server.

## ⚓ Key Components
- **FlightSearch**: Dynamic airport/airline fetching.
- **AdminDashboard**: Real-time stats and Recent Enquiries table.
- **Enquiry Dashboard**: Personal enquiry tracking for users.
- **Navbar**: Dynamic logo/login state management.
