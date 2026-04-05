import React, { useState, useMemo } from 'react';
import AdminLayout, { SearchBar, Badge, Pagination, Modal, FormField, Input, Select } from '../../components/admin/AdminLayout';

const USERS = [
  { id: 1, name: 'Priya Sharma', email: 'priya@example.com', phone: '+91 98765 43210', city: 'Delhi', bookings: 8, lastBooking: '2025-12-15', totalSpent: '₹45,200', status: 'active', joined: '2023-01-15', nextTrip: '2026-05-10', route: 'DEL → GOI' },
  { id: 2, name: 'Rahul Mehta', email: 'rahul@example.com', phone: '+91 87654 32109', city: 'Bangalore', bookings: 5, lastBooking: '2025-11-20', totalSpent: '₹28,500', status: 'active', joined: '2023-03-22', nextTrip: '2026-06-15', route: 'BLR → BOM' },
  { id: 3, name: 'Anjali Nair', email: 'anjali@example.com', phone: '+91 76543 21098', city: 'Kochi', bookings: 3, lastBooking: '2025-10-05', totalSpent: '₹16,700', status: 'active', joined: '2023-05-10', nextTrip: null, route: null },
  { id: 4, name: 'Vikram Singh', email: 'vikram@example.com', phone: '+91 65432 10987', city: 'Jaipur', bookings: 12, lastBooking: '2026-01-08', totalSpent: '₹78,400', status: 'active', joined: '2022-11-01', nextTrip: '2026-04-20', route: 'JAI → SXR' },
  { id: 5, name: 'Sunita Rao', email: 'sunita@example.com', phone: '+91 54321 09876', city: 'Hyderabad', bookings: 2, lastBooking: '2025-08-14', totalSpent: '₹9,800', status: 'inactive', joined: '2024-02-18', nextTrip: null, route: null },
  { id: 6, name: 'Amit Joshi', email: 'amit@example.com', phone: '+91 43210 98765', city: 'Mumbai', bookings: 7, lastBooking: '2026-02-28', totalSpent: '₹42,100', status: 'active', joined: '2023-07-30', nextTrip: '2026-05-01', route: 'BOM → BLR' },
  { id: 7, name: 'Kavita Patel', email: 'kavita@example.com', phone: '+91 32109 87654', city: 'Ahmedabad', bookings: 4, lastBooking: '2025-09-22', totalSpent: '₹21,600', status: 'active', joined: '2023-09-05', nextTrip: null, route: null },
  { id: 8, name: 'Suresh Kumar', email: 'suresh@example.com', phone: '+91 21098 76543', city: 'Chennai', bookings: 9, lastBooking: '2026-01-30', totalSpent: '₹54,900', status: 'active', joined: '2022-08-12', nextTrip: '2026-06-10', route: 'MAA → DEL' },
  { id: 9, name: 'Deepa Menon', email: 'deepa@example.com', phone: '+91 10987 65432', city: 'Trivandrum', bookings: 1, lastBooking: '2025-06-18', totalSpent: '₹5,400', status: 'inactive', joined: '2024-04-20', nextTrip: null, route: null },
  { id: 10, name: 'Rohit Gupta', email: 'rohit@example.com', phone: '+91 99876 54321', city: 'Lucknow', bookings: 6, lastBooking: '2025-12-01', totalSpent: '₹33,200', status: 'active', joined: '2023-02-14', nextTrip: '2026-07-05', route: 'DEL → BOM' },
  { id: 11, name: 'Meera Iyer', email: 'meera@example.com', phone: '+91 88765 43210', city: 'Bangalore', bookings: 11, lastBooking: '2026-03-10', totalSpent: '₹66,700', status: 'active', joined: '2022-06-28', nextTrip: '2026-04-28', route: 'BLR → HYD' },
  { id: 12, name: 'Arun Pillai', email: 'arun@example.com', phone: '+91 77654 32109', city: 'Kochi', bookings: 3, lastBooking: '2025-11-05', totalSpent: '₹17,800', status: 'active', joined: '2023-10-01', nextTrip: null, route: null },
  { id: 13, name: 'Nisha Verma', email: 'nisha@example.com', phone: '+91 66543 21098', city: 'Pune', bookings: 5, lastBooking: '2025-10-28', totalSpent: '₹29,300', status: 'active', joined: '2023-06-15', nextTrip: '2026-05-20', route: 'PNQ → DEL' },
  { id: 14, name: 'Kiran Shah', email: 'kiran@example.com', phone: '+91 55432 10987', city: 'Surat', bookings: 2, lastBooking: '2025-07-09', totalSpent: '₹11,200', status: 'inactive', joined: '2024-01-10', nextTrip: null, route: null },
  { id: 15, name: 'Pooja Reddy', email: 'pooja@example.com', phone: '+91 44321 09876', city: 'Hyderabad', bookings: 14, lastBooking: '2026-03-25', totalSpent: '₹89,600', status: 'active', joined: '2022-04-03', nextTrip: '2026-05-08', route: 'HYD → GOI' },
];

const PAGE_SIZE = 8;

const Users = () => {
  const [data] = useState(USERS);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [page, setPage] = useState(1);
  const [viewModal, setViewModal] = useState(false);
  const [reminderModal, setReminderModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [reminderMsg, setReminderMsg] = useState('');
  const [reminderSent, setReminderSent] = useState(false);

  const filtered = useMemo(() => data.filter(u => {
    const q = search.toLowerCase();
    const matchQ = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.city.toLowerCase().includes(q) || u.phone.includes(q);
    const matchS = filterStatus === 'all' || u.status === filterStatus;
    return matchQ && matchS;
  }), [data, search, filterStatus]);

  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  const openView = (u) => { setSelected(u); setViewModal(true); };
  const openReminder = (u) => {
    setSelected(u);
    setReminderMsg(`Hi ${u.name},\n\nWe noticed you haven't booked with us in a while. We have amazing deals on ${u.route || 'popular routes'} that we'd love to share with you!\n\nCall us at +91 98765 43210 or reply to this message.\n\n— TravelSparsh Team`);
    setReminderSent(false);
    setReminderModal(true);
  };
  const sendReminder = () => { setReminderSent(true); setTimeout(() => setReminderModal(false), 1200); };

  return (
    <AdminLayout
      title="Users"
      subtitle={`${data.filter(u => u.status === 'active').length} active · ${data.length} total`}
    >
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="flex-1"><SearchBar value={search} onChange={v => { setSearch(v); setPage(1); }} placeholder="Search name, email, city, phone…" /></div>
        <div className="flex gap-2">
          {['all', 'active', 'inactive'].map(s => (
            <button key={s} onClick={() => { setFilterStatus(s); setPage(1); }}
              className={`px-3 py-2 rounded-xl text-xs font-bold capitalize transition-all border ${filterStatus === s ? 'bg-[#0d1f5c] text-white border-[#0d1f5c]' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {[
          { label: 'Total Users', value: data.length, icon: '👥' },
          { label: 'Active', value: data.filter(u => u.status === 'active').length, icon: '✅' },
          { label: 'Upcoming Trips', value: data.filter(u => u.nextTrip).length, icon: '✈' },
          { label: 'High Value (10+)', value: data.filter(u => u.bookings >= 10).length, icon: '⭐' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-slate-100 p-3.5 flex items-center gap-3 shadow-sm">
            <span className="text-2xl">{s.icon}</span>
            <div>
              <p className="text-xl font-black text-slate-900">{s.value}</p>
              <p className="text-xs text-slate-400">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {['User', 'City', 'Bookings', 'Total Spent', 'Last Booking', 'Next Trip', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paged.length === 0 ? (
                <tr><td colSpan={8} className="px-4 py-16 text-center text-slate-400 text-sm">No users found</td></tr>
              ) : paged.map(u => (
                <tr key={u.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-black text-xs flex-shrink-0">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-xs whitespace-nowrap">{u.name}</p>
                        <p className="text-slate-400 text-[10px]">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600 text-xs whitespace-nowrap">{u.city}</td>
                  <td className="px-4 py-3">
                    <span className={`font-black text-sm ${u.bookings >= 10 ? 'text-amber-600' : 'text-slate-900'}`}>{u.bookings}</span>
                    {u.bookings >= 10 && <span className="ml-1 text-[10px] text-amber-500">★ VIP</span>}
                  </td>
                  <td className="px-4 py-3 font-bold text-emerald-700 text-xs whitespace-nowrap">{u.totalSpent}</td>
                  <td className="px-4 py-3 text-slate-400 text-xs whitespace-nowrap">{u.lastBooking}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {u.nextTrip ? (
                      <div>
                        <p className="text-xs font-bold text-blue-700">{u.nextTrip}</p>
                        <p className="text-[10px] text-slate-400">{u.route}</p>
                      </div>
                    ) : <span className="text-slate-300 text-xs">—</span>}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <Badge label={u.status} color={u.status === 'active' ? 'green' : 'slate'} />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex gap-1">
                      <button onClick={() => openView(u)} className="w-7 h-7 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 flex items-center justify-center transition-colors" title="View Details">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      </button>
                      <button onClick={() => openReminder(u)} className="w-7 h-7 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-600 flex items-center justify-center transition-colors" title="Send Reminder">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-5 pb-4">
          <Pagination current={page} total={totalPages} onChange={p => { setPage(p); window.scrollTo(0, 0); }} />
        </div>
      </div>

      {/* View Details Modal */}
      <Modal open={viewModal} title="User Details" onClose={() => setViewModal(false)} size="md">
        {selected && (
          <div className="space-y-5">
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-black text-2xl flex-shrink-0">
                {selected.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-black text-slate-900 text-lg">{selected.name}</h3>
                <p className="text-slate-500 text-sm">{selected.email}</p>
                <p className="text-slate-500 text-sm">{selected.phone}</p>
              </div>
              <div className="ml-auto"><Badge label={selected.status} color={selected.status === 'active' ? 'green' : 'slate'} /></div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'City', value: selected.city },
                { label: 'Member Since', value: selected.joined },
                { label: 'Total Bookings', value: selected.bookings },
                { label: 'Total Spent', value: selected.totalSpent },
                { label: 'Last Booking', value: selected.lastBooking },
                { label: 'Next Trip', value: selected.nextTrip || '—' },
              ].map(i => (
                <div key={i.label} className="bg-slate-50 rounded-xl p-3">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">{i.label}</p>
                  <p className="font-bold text-slate-900 text-sm">{i.value}</p>
                </div>
              ))}
            </div>

            {selected.nextTrip && (
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">Upcoming Trip</p>
                <p className="font-black text-blue-900">{selected.route}</p>
                <p className="text-blue-700 text-sm">{selected.nextTrip}</p>
              </div>
            )}

            <div className="flex gap-3 pt-3 border-t border-slate-100">
              <button onClick={() => { setViewModal(false); openReminder(selected); }}
                className="flex-1 flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold py-2.5 rounded-xl text-sm transition-all active:scale-95">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                Send Reminder
              </button>
              <a href={`tel:${selected.phone}`}
                className="flex-1 flex items-center justify-center gap-2 bg-[#0d1f5c] hover:bg-[#0a1848] text-white font-bold py-2.5 rounded-xl text-sm transition-all">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                Call Now
              </a>
            </div>
          </div>
        )}
      </Modal>

      {/* Reminder Modal */}
      <Modal open={reminderModal} title="Send Booking Reminder" onClose={() => setReminderModal(false)} size="md">
        {selected && !reminderSent && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl border border-amber-100">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-black text-sm flex-shrink-0">
                {selected.name.charAt(0)}
              </div>
              <div>
                <p className="font-bold text-slate-900 text-sm">{selected.name}</p>
                <p className="text-slate-500 text-xs">{selected.phone} · {selected.email}</p>
              </div>
            </div>
            <FormField label="Reminder Message">
              <textarea value={reminderMsg} onChange={e => setReminderMsg(e.target.value)} rows={6}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all" />
            </FormField>
            <div className="flex gap-2">
              {['WhatsApp', 'SMS', 'Email'].map(ch => (
                <button key={ch} className="flex-1 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:border-amber-400 hover:text-amber-600 hover:bg-amber-50 transition-all">
                  {ch}
                </button>
              ))}
            </div>
            <div className="flex gap-3 pt-2 border-t border-slate-100">
              <button onClick={() => setReminderModal(false)} className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50">Cancel</button>
              <button onClick={sendReminder} className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-bold py-2.5 rounded-xl text-sm transition-all active:scale-95">Send Reminder</button>
            </div>
          </div>
        )}
        {reminderSent && (
          <div className="text-center py-6">
            <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="font-black text-slate-900">Reminder Sent!</p>
            <p className="text-slate-400 text-sm mt-1">Message delivered to {selected?.name}</p>
          </div>
        )}
      </Modal>
    </AdminLayout>
  );
};

export default Users;
