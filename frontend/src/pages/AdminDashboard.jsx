import React, { useState, useEffect, useCallback } from 'react';
import { adminAPI } from '../utils/api';
import { SkeletonCard } from '../components/LoadingSpinner';

const StatCard = ({ icon, label, value, color, sub }) => (
  <div className={`card p-5 border-t-4 ${color}`}>
    <div className="flex items-start justify-between">
      <div>
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-1">{label}</p>
        <p className="text-3xl font-black text-slate-900 dark:text-white">{value}</p>
        {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
      </div>
      <span className="text-3xl">{icon}</span>
    </div>
  </div>
);

const TabButton = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${active ? 'bg-primary-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50'
      }`}
  >
    {children}
  </button>
);

const AdminDashboard = () => {
  const [tab, setTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminAPI.getStats();
      setStats(res.data.data);
    } catch {
      setStats(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminAPI.getUsers({ search, limit: 20 });
      setUsers(res.data.data || []);
    } catch { setUsers([]); }
    finally { setLoading(false); }
  }, [search]);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminAPI.getAllBookings({ limit: 20 });
      setBookings(res.data.data || []);
    } catch { setBookings([]); }
    finally { setLoading(false); }
  }, []);

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminAPI.getContacts({ limit: 20 });
      setContacts(res.data.data || []);
    } catch { setContacts([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    if (tab === 'users') fetchUsers();
    else if (tab === 'bookings') fetchBookings();
    else if (tab === 'contacts') fetchContacts();
  }, [tab, fetchUsers, fetchBookings, fetchContacts]);

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await adminAPI.deleteUser(userId);
      setUsers((prev) => prev.filter((u) => u._id !== userId));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleMarkRead = async (contactId) => {
    try {
      await adminAPI.updateContact(contactId, { isRead: true });
      setContacts((prev) => prev.map((c) => c._id === contactId ? { ...c, isRead: true } : c));
    } catch { }
  };

  const handleToggleUserStatus = async (user) => {
    try {
      await adminAPI.updateUser(user._id, { isActive: !user.isActive });
      setUsers((prev) => prev.map((u) => u._id === user._id ? { ...u, isActive: !u.isActive } : u));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update user');
    }
  };

  const STATUS_COLORS = {
    confirmed: 'badge-success',
    pending: 'badge-warning',
    cancelled: 'badge-danger',
    completed: 'badge-success',
    failed: 'badge-danger',
  };

  return (
    <div className="min-h-screen pt-16 bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white">Admin Dashboard</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Manage users, bookings, and contacts</p>
          </div>
          <span className="badge bg-accent-100 text-accent-700 dark:bg-accent-900/30 dark:text-accent-400">⚙ Admin Panel</span>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 bg-white bg-white/95 dark:bg-[#020617]/95
backdrop-blur-xl
border border-white/40 dark:border-white/10 p-2 rounded-2xl shadow-sm w-fit">
          {[
            { key: 'overview', label: '📊 Overview' },
            { key: 'users', label: '👥 Users' },
            { key: 'bookings', label: '✈ Bookings' },
            { key: 'contacts', label: '✉ Messages' },
          ].map((t) => (
            <TabButton key={t.key} active={tab === t.key} onClick={() => setTab(t.key)}>
              {t.label}
              {t.key === 'contacts' && stats?.unreadContacts > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full inline-flex items-center justify-center">
                  {stats.unreadContacts}
                </span>
              )}
            </TabButton>
          ))}
        </div>

        {/* Overview Tab */}
        {tab === 'overview' && (
          <div>
            {loading ? (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)}
              </div>
            ) : stats ? (
              <>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  <StatCard icon="👥" label="Total Users" value={stats.totalUsers} color="border-primary-500" sub="Registered users" />
                  <StatCard icon="✈" label="Total Bookings" value={stats.totalBookings} color="border-blue-500" sub="All time" />
                  <StatCard icon="✅" label="Confirmed" value={stats.confirmedBookings} color="border-green-500" sub="Active bookings" />
                  <StatCard icon="💰" label="Revenue" value={`₹${(stats.totalRevenue || 0).toLocaleString('en-IN')}`} color="border-accent-500" sub="Total earnings" />
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  <StatCard icon="⏳" label="Pending" value={stats.pendingBookings} color="border-yellow-500" />
                  <StatCard icon="❌" label="Cancelled" value={stats.cancelledBookings} color="border-red-400" />
                  <StatCard icon="✉" label="Unread Messages" value={stats.unreadContacts} color="border-purple-500" />
                  <StatCard icon="📈" label="This Month" value={stats.monthlyBookings?.slice(-1)[0]?.count || 0} color="border-indigo-500" sub="Bookings" />
                </div>

                {/* Monthly stats chart (CSS only) */}
                {stats.monthlyBookings && stats.monthlyBookings.length > 0 && (
                  <div className="card p-6">
                    <h3 className="font-bold text-slate-900 dark:text-white mb-6">Monthly Bookings (Last 6 Months)</h3>
                    <div className="flex items-end gap-3 h-40">
                      {stats.monthlyBookings.slice(-6).map((month, idx) => {
                        const maxCount = Math.max(...stats.monthlyBookings.map((m) => m.count));
                        const height = maxCount > 0 ? (month.count / maxCount) * 100 : 10;
                        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                        return (
                          <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                            <span className="text-xs text-slate-500 font-semibold">{month.count}</span>
                            <div
                              className="w-full bg-gradient-to-t from-primary-600 to-primary-400 rounded-t-lg transition-all duration-500 min-h-[8px]"
                              style={{ height: `${height}%` }}
                            />
                            <span className="text-xs text-slate-400">{monthNames[month._id.month - 1]}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="card p-12 text-center">
                <p className="text-slate-500">Failed to load stats. Please refresh.</p>
              </div>
            )}
          </div>
        )}

        {/* Users Tab */}
        {tab === 'users' && (
          <div>
            <div className="flex gap-3 mb-5">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search users by name or email..."
                className="input-field flex-1"
                onKeyDown={(e) => e.key === 'Enter' && fetchUsers()}
              />
              <button onClick={fetchUsers} className="btn-primary px-5">Search</button>
            </div>
            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 bg-white/95 dark:bg-[#020617]/95
backdrop-blur-xl
border border-white/40 dark:border-white/10/50">
                    <tr>
                      {['Name', 'Email', 'Role', 'Status', 'Joined', 'Actions'].map((h) => (
                        <th key={h} className="px-5 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                    {loading ? (
                      <tr><td colSpan={6} className="py-8 text-center text-slate-400">Loading...</td></tr>
                    ) : users.length === 0 ? (
                      <tr><td colSpan={6} className="py-8 text-center text-slate-400">No users found</td></tr>
                    ) : users.map((user) => (
                      <tr key={user._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full flex items-center justify-center font-bold text-sm">
                              {user.name?.charAt(0)}
                            </div>
                            <span className="font-semibold text-sm text-slate-900 dark:text-white">{user.name}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-sm text-slate-600 dark:text-slate-400">{user.email}</td>
                        <td className="px-5 py-4">
                          <span className={`badge text-xs ${user.role === 'admin' ? 'badge-warning' : 'badge-info'}`}>{user.role}</span>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`badge text-xs ${user.isActive ? 'badge-success' : 'badge-danger'}`}>
                            {user.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-sm text-slate-500 dark:text-slate-400">
                          {new Date(user.createdAt).toLocaleDateString('en-IN')}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleToggleUserStatus(user)}
                              className={`text-xs px-2 py-1 rounded-lg border transition-colors ${user.isActive
                                ? 'text-orange-600 border-orange-200 hover:bg-orange-50 dark:hover:bg-orange-900/20'
                                : 'text-green-600 border-green-200 hover:bg-green-50 dark:hover:bg-green-900/20'
                                }`}
                            >
                              {user.isActive ? 'Deactivate' : 'Activate'}
                            </button>
                            {user.role !== 'admin' && (
                              <button
                                onClick={() => handleDeleteUser(user._id)}
                                className="text-xs px-2 py-1 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                              >
                                Delete
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Bookings Tab */}
        {tab === 'bookings' && (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 bg-white/95 dark:bg-[#020617]/95
backdrop-blur-xl
border border-white/40 dark:border-white/10/50">
                  <tr>
                    {['PNR', 'User', 'Route', 'Airline', 'Amount', 'Status', 'Date'].map((h) => (
                      <th key={h} className="px-5 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {loading ? (
                    <tr><td colSpan={7} className="py-8 text-center text-slate-400">Loading...</td></tr>
                  ) : bookings.length === 0 ? (
                    <tr><td colSpan={7} className="py-8 text-center text-slate-400">No bookings found</td></tr>
                  ) : bookings.map((booking) => (
                    <tr key={booking._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-5 py-4 font-mono font-bold text-sm text-slate-900 dark:text-white">{booking.pnr || 'Pending'}</td>
                      <td className="px-5 py-4 text-sm text-slate-700 dark:text-slate-300">{booking.userId?.name || 'N/A'}</td>
                      <td className="px-5 py-4 text-sm text-slate-600 dark:text-slate-400">
                        {booking.flightDetails?.origin || '--'} → {booking.flightDetails?.destination || '--'}
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-600 dark:text-slate-400">{booking.flightDetails?.airline || '--'}</td>
                      <td className="px-5 py-4 text-sm font-semibold text-primary-600 dark:text-primary-400">
                        {booking.totalAmount ? `₹${booking.totalAmount.toLocaleString('en-IN')}` : 'N/A'}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`badge text-xs ${STATUS_COLORS[booking.status] || 'badge-info'}`}>{booking.status}</span>
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-500 dark:text-slate-400">
                        {new Date(booking.createdAt).toLocaleDateString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Contacts Tab */}
        {tab === 'contacts' && (
          <div className="space-y-4">
            {loading ? (
              [1, 2, 3].map((i) => <SkeletonCard key={i} />)
            ) : contacts.length === 0 ? (
              <div className="card p-12 text-center">
                <div className="text-5xl mb-3">✉</div>
                <p className="text-slate-500">No contact messages found</p>
              </div>
            ) : contacts.map((contact) => (
              <div
                key={contact._id}
                className={`card p-5 border-l-4 ${contact.isRead ? 'border-slate-200 dark:border-slate-700' : 'border-primary-500'}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <span className="font-bold text-slate-900 dark:text-white">{contact.name}</span>
                      {!contact.isRead && (
                        <span className="badge bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 text-xs">New</span>
                      )}
                      <span className="text-xs text-slate-400">{new Date(contact.createdAt).toLocaleDateString('en-IN')}</span>
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 space-y-0.5">
                      <p>📧 {contact.email} {contact.phone && `· 📞 ${contact.phone}`}</p>
                      <p className="font-semibold text-slate-700 dark:text-slate-300">Subject: {contact.subject}</p>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">{contact.message}</p>
                  </div>
                  {!contact.isRead && (
                    <button
                      onClick={() => handleMarkRead(contact._id)}
                      className="text-xs bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 px-3 py-1.5 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/40 transition-colors flex-shrink-0"
                    >
                      Mark Read
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
