import React from 'react';
import AdminLayout, { StatCard, Badge } from '../../components/admin/AdminLayout';

const RECENT_ENQUIRIES = [
  { id: 'ENQ-001', name: 'Priya Sharma', route: 'DEL → GOI', date: '2026-04-04', status: 'new', phone: '+91 98765 43210' },
  { id: 'ENQ-002', name: 'Rahul Mehta', route: 'BOM → BLR', date: '2026-04-03', status: 'contacted', phone: '+91 87654 32109' },
  { id: 'ENQ-003', name: 'Anjali Nair', route: 'COK → DEL', date: '2026-04-03', status: 'booked', phone: '+91 76543 21098' },
  { id: 'ENQ-004', name: 'Vikram Singh', route: 'JAI → BOM', date: '2026-04-02', status: 'new', phone: '+91 65432 10987' },
  { id: 'ENQ-005', name: 'Sunita Rao', route: 'HYD → SXR', date: '2026-04-02', status: 'contacted', phone: '+91 54321 09876' },
  { id: 'ENQ-006', name: 'Amit Joshi', route: 'BLR → GOI', date: '2026-04-01', status: 'booked', phone: '+91 43210 98765' },
];

const TOP_ROUTES = [
  { route: 'Delhi → Mumbai', count: 342, pct: 92 },
  { route: 'Mumbai → Bangalore', count: 285, pct: 77 },
  { route: 'Delhi → Goa', count: 241, pct: 65 },
  { route: 'Chennai → Delhi', count: 198, pct: 53 },
  { route: 'Kolkata → Mumbai', count: 167, pct: 45 },
  { route: 'Bangalore → Srinagar', count: 124, pct: 33 },
];

const statusMap = {
  new: { label: 'New', color: 'blue' },
  contacted: { label: 'Contacted', color: 'amber' },
  booked: { label: 'Booked', color: 'green' },
};

const AdminDashboard = () => {
  return (
    <AdminLayout title="Dashboard" subtitle="Welcome back! Here's what's happening today.">

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon="👥" label="Total Users" value="1,284" sub="+28 this week" color="blue" />
        <StatCard icon="✈" label="Active Airlines" value="12" sub="3 pending review" color="purple" />
        <StatCard icon="📦" label="Active Packages" value="24" sub="8 new this month" color="green" />
        <StatCard icon="📋" label="Enquiries Today" value="47" sub="+12 vs yesterday" color="amber" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* Recent Enquiries */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <div>
              <h2 className="font-black text-slate-900 text-sm">Recent Enquiries</h2>
              <p className="text-xs text-slate-400 mt-0.5">Last 6 enquiries received</p>
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
                {RECENT_ENQUIRIES.map(e => (
                  <tr key={e.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3 text-xs font-mono text-slate-500 whitespace-nowrap">{e.id}</td>
                    <td className="px-4 py-3">
                      <p className="font-bold text-slate-900 text-xs whitespace-nowrap">{e.name}</p>
                      <p className="text-slate-400 text-[10px]">{e.phone}</p>
                    </td>
                    <td className="px-4 py-3 font-bold text-slate-700 text-xs whitespace-nowrap">{e.route}</td>
                    <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">{e.date}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <Badge label={statusMap[e.status].label} color={statusMap[e.status].color} />
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
                ))}
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
            {TOP_ROUTES.map((r, i) => (
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
            ))}
          </div>
        </div>

      </div>

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
