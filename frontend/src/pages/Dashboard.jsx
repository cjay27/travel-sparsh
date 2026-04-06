import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { contactAPI } from '../utils/api';
import EnquiryCard from '../components/EnquiryCard';
import { SkeletonCard } from '../components/LoadingSpinner';

const StatCard = ({ icon, label, value, sub, color }) => (
  <div className={`bg-white dark:bg-slate-800 rounded-2xl border-l-4 p-6 shadow-sm ${color} border-slate-100 dark:border-slate-700`}>
    <div className="flex items-center justify-between mb-3">
      <span className="text-3xl">{icon}</span>
      <span className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-700/50 px-2 py-1 rounded-lg tracking-widest">{sub}</span>
    </div>
    <div className="text-3xl font-black text-slate-900 dark:text-white mb-0.5">{value}</div>
    <p className="text-slate-400 dark:text-slate-500 font-bold text-xs uppercase tracking-widest">{label}</p>
  </div>
);

const QuickAction = ({ icon, label, to, external = false }) => {
  const className = "flex flex-col items-center gap-2 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 hover:border-primary-200 dark:hover:border-primary-800 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all duration-200 group";
  const content = (
    <>
      <span className="text-3xl group-hover:scale-110 transition-transform">{icon}</span>
      <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest group-hover:text-primary-600 dark:group-hover:text-primary-400 text-center">{label}</span>
    </>
  );

  if (external) {
    return <a href={to} target="_blank" rel="noopener noreferrer" className={className}>{content}</a>;
  }
  return <a href={to} className={className}>{content}</a>;
};

const Dashboard = () => {
  const { user } = useAuth();
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, new: 0, contacted: 0, converted: 0 });

  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        const res = await contactAPI.getMyEnquiries({ limit: 5 });
        const all = res.data.data || [];
        setEnquiries(all);

        setStats({
          total: res.data.total || 0,
          new: all.filter((e) => e.status === 'new').length,
          contacted: all.filter((e) => e.status === 'contacted').length,
          converted: all.filter((e) => e.status === 'converted').length,
        });
      } catch (err) {
        console.error(err);
        setEnquiries([]);
      } finally {
        setLoading(false);
      }
    };
    fetchEnquiries();
  }, []);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="min-h-screen pt-20 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-primary-500 font-black text-xs uppercase tracking-widest mb-1">{greeting()},</p>
              <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                {user?.name?.split(' ')[0]} 👋
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium italic">
                Welcome to your Travel Sparsh workspace.
              </p>
            </div>
            <a
              href="https://booking.adivaha.com?affiliate_id=TRAVEL_SPARSH&source=dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#1b3b6b] text-white px-6 py-3 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-[#152e54] transition-all shadow-xl shadow-blue-900/20 active:scale-95"
            >
              🚀 Search Flights
            </a>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          <StatCard icon="📋" label="Enquiries" value={stats.total} sub="Total" color="border-primary-500" />
          <StatCard icon="✨" label="New" value={stats.new} sub="Awaiting" color="border-blue-500" />
          <StatCard icon="📞" label="Contacted" value={stats.contacted} sub="In Progress" color="border-amber-400" />
          <StatCard icon="✅" label="Converted" value={stats.converted} sub="Booked!" color="border-emerald-500" />
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent enquiries */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Recent Enquiries</h2>
              <span className="text-[10px] font-black text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 uppercase tracking-widest animate-pulse">Live Tracking</span>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2].map((i) => <SkeletonCard key={i} />)}
              </div>
            ) : enquiries.length > 0 ? (
              <div className="space-y-5">
                {enquiries.map((enquiry) => (
                  <EnquiryCard key={enquiry.id} enquiry={enquiry} />
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-800 rounded-3xl p-16 text-center border-2 border-dashed border-slate-100 dark:border-slate-700">
                <div className="text-7xl mb-6">🏜</div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tight">Your world awaits</h3>
                <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-sm mx-auto font-medium italic">
                  No active enquiries found. Submit your travel requirements and let our experts plan your dream trip.
                </p>
                <a
                  href="/#contact"
                  className="bg-[#1b3b6b] text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-[#152e54] transition-all shadow-xl shadow-blue-500/10"
                >
                  Create Enquiry →
                </a>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Profile card */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-50 dark:border-slate-700 shadow-sm relative overflow-hidden">
               <div className="absolute top-0 right-0 w-24 h-24 bg-primary-500/5 rounded-full -translate-y-12 translate-x-12" />
              <h3 className="font-black text-slate-900 dark:text-white text-xs uppercase tracking-widest mb-6">User Identity</h3>
              <div className="flex items-center gap-5 mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-[#1b3b6b] to-[#152e54] rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-blue-900/20">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-black text-slate-900 dark:text-white text-lg tracking-tight">{user?.name}</p>
                  <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">{user?.email}</p>
                  <div className="mt-2 inline-block bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-widest">{user?.role}</div>
                </div>
              </div>
              <div className="space-y-3.5 pt-6 border-t border-slate-50 dark:border-slate-700">
                {user?.phone && (
                  <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300 font-bold italic">
                    <span className="text-lg">📞</span>
                    <span>{user.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300 font-bold italic">
                  <span className="text-lg">📅</span>
                  <span>Joined {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) : 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Quick actions */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-50 dark:border-slate-700 shadow-sm">
              <h3 className="font-black text-slate-900 dark:text-white text-xs uppercase tracking-widest mb-6">Operations</h3>
              <div className="grid grid-cols-2 gap-4">
                <QuickAction icon="🔍" label="Search" to="https://booking.adivaha.com?affiliate_id=TRAVEL_SPARSH" external />
                <QuickAction icon="✉" label="Support" to="/contact" />
                <QuickAction icon="🗺" label="Packages" to="/about" />
                <QuickAction icon="🏠" label="Home" to="/" />
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
