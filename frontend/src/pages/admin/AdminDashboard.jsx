import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout, { StatCard, Badge } from '../../components/admin/AdminLayout';
import { adminAPI } from '../../utils/api';

const statusMap = {
  new: { label: 'New', color: 'blue' },
  contacted: { label: 'In Progress', color: 'amber' },
  converted: { label: 'Converted', color: 'green' },
  closed: { label: 'Closed', color: 'slate' },
  default: { label: 'Unknown', color: 'slate' }
};

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminAPI.getStats();
      setStats(res.data.data);
    } catch(err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return (
    <AdminLayout title="Dashboard" subtitle="Welcome back! Here's what's happening today.">

      {/* Stats */}
      {loading ? (
        <div className="py-12 text-center text-slate-500">Loading Dashboard stats...</div>
      ) : stats ? (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard icon="👥" label="Total Users" value={stats.totalUsers} color="blue" />
            <StatCard icon="✈" label="Active Airlines" value={stats.totalAirlines} color="purple" />
            <StatCard icon="📦" label="Active Packages" value={stats.totalPackages} color="green" />
            <StatCard icon="📋" label="Enquiries" value={stats.totalEnquiries} sub={`${stats.newEnquiries} new`} color="amber" />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

            {/* Recent Enquiries */}
            <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                <div>
                  <h2 className="font-black text-slate-900 text-sm">Recent Enquiries</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Last enquiries received</p>
                </div>
                <span className="bg-blue-50 text-blue-600 text-xs font-bold px-3 py-1 rounded-full border border-blue-100">Live</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      {['ID', 'Traveller', 'Route', 'Date', 'Status', 'Action'].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {stats.recentEnquiries && stats.recentEnquiries.length > 0 ? stats.recentEnquiries.map(e => {
                      const st = statusMap[e.status] || statusMap.default;
                      return (
                        <tr key={e._id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-4 py-3 text-xs font-mono text-slate-500 whitespace-nowrap">{e._id}</td>
                          <td className="px-4 py-3">
                            <p className="font-bold text-slate-900 text-xs whitespace-nowrap">{e.name}</p>
                            <p className="text-slate-400 text-[10px]">{e.phone}</p>
                          </td>
                          <td className="px-4 py-3 font-bold text-slate-700 text-xs whitespace-nowrap">{e.from_city || '--'} → {e.to_city || '--'}</td>
                          <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">{e.created_at}</td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <Badge label={st.label} color={st.color} />
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <a href={`tel:${e.phone}`} className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              </svg>
                              Call
                            </a>
                          </td>
                        </tr>
                      );
                    }) : (
                      <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-400 text-sm">No enquiries found</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Top Routes */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100">
                <h2 className="font-black text-slate-900 text-sm">Top Routes</h2>
                <p className="text-xs text-slate-400 mt-0.5">By enquiry volume (all time)</p>
              </div>
              <div className="p-5 space-y-4">
                {stats.topRoutes && stats.topRoutes.length > 0 ? stats.topRoutes.map((r, i) => (
                  <div key={r.route}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-black flex items-center justify-center flex-shrink-0">{i + 1}</span>
                        {r.route}
                      </span>
                      <span className="text-xs font-bold text-slate-900">{r.count}</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500"
                        style={{ width: `${r.pct}%` }} />
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-4 text-xs font-semibold text-slate-400">No route data available</div>
                )}
              </div>
            </div>

          </div>
        </>
      ) : (
        <div className="py-12 text-center text-slate-500">Failed to load statistics</div>
      )}

      {/* Quick actions */}
      <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Add Airline', path: '/admin/airlines', icon: '✈', color: 'bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-100' },
          { label: 'New Package', path: '/admin/packages', icon: '📦', color: 'bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-100' },
          { label: 'View Users', path: '/admin/users', icon: '👥', color: 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-100' },
          { label: 'Manage Airports', path: '/admin/airports', icon: '🗺', color: 'bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-100' },
        ].map(a => (
          <a key={a.label} href={a.path}
            className={`flex items-center gap-3 p-4 rounded-xl border font-bold text-sm transition-all duration-200 ${a.color}`}>
            <span className="text-xl">{a.icon}</span>
            {a.label}
          </a>
        ))}
      </div>

    </AdminLayout>
  );
};

export default AdminDashboard;
