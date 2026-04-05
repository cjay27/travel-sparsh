import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { bookingsAPI } from '../utils/api';
import BookingCard from '../components/BookingCard';
import { SkeletonCard } from '../components/LoadingSpinner';

const StatCard = ({ icon, label, value, sub, color }) => (
  <div className={`card p-6 border-l-4 ${color}`}>
    <div className="flex items-center justify-between mb-3">
      <span className="text-3xl">{icon}</span>
      <span className="text-xs text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-full">{sub}</span>
    </div>
    <div className="text-3xl font-black text-slate-900 dark:text-white mb-1">{value}</div>
    <p className="text-slate-500 dark:text-slate-400 text-sm">{label}</p>
  </div>
);

const QuickAction = ({ icon, label, to, external = false }) => {
  const className = "flex flex-col items-center gap-2 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 hover:border-primary-200 dark:hover:border-primary-800 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all duration-200 group";
  const content = (
    <>
      <span className="text-3xl group-hover:scale-110 transition-transform">{icon}</span>
      <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 group-hover:text-primary-600 dark:group-hover:text-primary-400 text-center">{label}</span>
    </>
  );

  if (external) {
    return <a href={to} target="_blank" rel="noopener noreferrer" className={className}>{content}</a>;
  }
  return <Link to={to} className={className}>{content}</Link>;
};

const Dashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, upcoming: 0, completed: 0, cancelled: 0 });

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await bookingsAPI.getMyBookings({ limit: 3 });
        const all = res.data.data || [];
        setBookings(all);

        const now = new Date();
        setStats({
          total: res.data.total || 0,
          upcoming: all.filter((b) => b.status === 'confirmed' && b.flightDetails?.departureDate && new Date(b.flightDetails.departureDate) > now).length,
          completed: all.filter((b) => b.status === 'completed').length,
          cancelled: all.filter((b) => b.status === 'cancelled').length,
        });
      } catch {
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const handleCancel = async (bookingId) => {
    try {
      await bookingsAPI.cancelBooking(bookingId);
      setBookings((prev) =>
        prev.map((b) => (b._id === bookingId ? { ...b, status: 'cancelled' } : b))
      );
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel booking');
    }
  };

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="min-h-screen pt-16 bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-slate-500 dark:text-slate-400 text-sm">{greeting()},</p>
              <h1 className="text-3xl font-black text-slate-900 dark:text-white">
                {user?.name?.split(' ')[0]} 👋
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-1">
                Welcome to your travel dashboard. Where are you flying next?
              </p>
            </div>
            <a
              href="https://booking.adivaha.com?affiliate_id=TRAVEL_SPARSH&source=dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary flex items-center gap-2 self-start sm:self-center"
            >
              ✈ Book New Flight
            </a>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon="📋" label="Total Bookings" value={stats.total} sub="All time" color="border-primary-500" />
          <StatCard icon="✈" label="Upcoming Trips" value={stats.upcoming} sub="Confirmed" color="border-green-500" />
          <StatCard icon="✅" label="Completed" value={stats.completed} sub="Past trips" color="border-blue-500" />
          <StatCard icon="❌" label="Cancelled" value={stats.cancelled} sub="Cancelled" color="border-red-400" />
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent bookings (2/3 width) */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Recent Bookings</h2>
              <Link to="/bookings" className="text-primary-600 dark:text-primary-400 text-sm font-semibold hover:underline">
                View all →
              </Link>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2].map((i) => <SkeletonCard key={i} />)}
              </div>
            ) : bookings.length > 0 ? (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <BookingCard key={booking._id} booking={booking} onCancel={handleCancel} />
                ))}
              </div>
            ) : (
              <div className="card p-12 text-center">
                <div className="text-6xl mb-4">✈</div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No bookings yet</h3>
                <p className="text-slate-500 dark:text-slate-400 mb-6">
                  Start your journey! Search and book your first flight.
                </p>
                <a
                  href="https://booking.adivaha.com?affiliate_id=TRAVEL_SPARSH"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary inline-block"
                >
                  Search Flights →
                </a>
              </div>
            )}
          </div>

          {/* Sidebar (1/3 width) */}
          <div className="space-y-6">
            {/* Profile card */}
            <div className="card p-6">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4">Your Profile</h3>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center text-white text-xl font-black">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">{user?.name}</p>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">{user?.email}</p>
                  <span className="badge badge-info text-xs mt-1">{user?.role}</span>
                </div>
              </div>
              <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                {user?.phone && (
                  <div className="flex items-center gap-2">
                    <span>📞</span>
                    <span>{user.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <span>📅</span>
                  <span>Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) : 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Quick actions */}
            <div className="card p-6">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                <QuickAction icon="🔍" label="Search Flights" to="https://booking.adivaha.com?affiliate_id=TRAVEL_SPARSH" external />
                <QuickAction icon="📋" label="My Bookings" to="/bookings" />
                <QuickAction icon="📍" label="PNR Status" to="/pnr" />
                <QuickAction icon="✉" label="Contact Us" to="/contact" />
              </div>
            </div>

            {/* Deals teaser */}
            <div className="card p-6 bg-gradient-to-br from-primary-600 to-primary-800 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 text-[6rem] text-white/10 -translate-y-4 translate-x-4">✈</div>
              <h3 className="font-bold mb-2">Exclusive Member Deals 🎉</h3>
              <p className="text-primary-100 text-sm mb-4">Get up to 50% off on selected flights. Limited time offer!</p>
              <a
                href="https://booking.adivaha.com?affiliate_id=TRAVEL_SPARSH&coupon=MEMBER50"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-primary-600 font-bold text-sm px-4 py-2 rounded-lg hover:bg-primary-50 transition-colors inline-block"
              >
                Claim Deal →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
