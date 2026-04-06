import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { AdminProvider } from './context/AdminContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
// Pages
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import Airlines from './pages/admin/Airlines';
import Users from './pages/admin/Users';
import Customers from './pages/admin/Customers';
import Packages from './pages/admin/Packages';
import Airports from './pages/admin/Airports';


// Layout wrapper to handle pages that don't need footer
const AppLayout = ({ children }) => {
  const location = useLocation();
  const noFooterPaths = ['/login', '/register'];
  const showFooter = !noFooterPaths.includes(location.pathname);

  return (
    <>
      <Navbar />
      <main>{children}</main>
      {showFooter && <Footer />}
    </>
  );
};

// 404 Page
const NotFound = () => (
  <div className="min-h-screen pt-16 flex items-center justify-center bg-slate-50 dark:bg-slate-900">
    <div className="text-center px-4">
      <div className="text-8xl mb-6">✈</div>
      <h1 className="text-6xl font-black text-primary-600 mb-4">404</h1>
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Page Not Found</h2>
      <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto">
        Looks like this flight doesn't exist. Let's get you back on the right path.
      </p>
      <div className="flex gap-4 justify-center">
        <a href="/" className="btn-primary">Go Home</a>
        <a href="/contact" className="btn-outline">Contact Support</a>
      </div>
    </div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AdminProvider>
            <Routes>
              {/* Public routes (with Navbar + Footer) */}
              <Route path="/" element={<AppLayout><Home /></AppLayout>} />
              <Route path="/about" element={<AppLayout><About /></AppLayout>} />
              <Route path="/contact" element={<AppLayout><Contact /></AppLayout>} />
              <Route path="/login" element={<AppLayout><Login /></AppLayout>} />

              <Route path="/dashboard" element={<AppLayout><ProtectedRoute><Dashboard /></ProtectedRoute></AppLayout>} />

              {/* Admin routes (no Navbar/Footer, AdminContext handles auth) */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/airlines" element={<Airlines />} />
              <Route path="/admin/users" element={<Users />} />
              <Route path="/admin/customers" element={<Customers />} />
              <Route path="/admin/packages" element={<Packages />} />
              <Route path="/admin/airports" element={<Airports />} />


              {/* 404 */}
              <Route path="*" element={<AppLayout><NotFound /></AppLayout>} />
            </Routes>
          </AdminProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
