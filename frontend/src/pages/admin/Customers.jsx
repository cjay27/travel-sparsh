import React, { useState, useMemo, useEffect, useCallback } from 'react';
import AdminLayout, { SearchBar, Badge, Pagination, Modal, FormField, Input, Select } from '../../components/admin/AdminLayout';
import { contactAPI } from '../../utils/api';


const PAGE_SIZE = 8;

const Customers = () => {

  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [page, setPage] = useState(1);
  const [viewModal, setViewModal] = useState(false);
  const [reminderModal, setReminderModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [reminderMsg, setReminderMsg] = useState('');
  const [reminderSent, setReminderSent] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch enquiries from API
  const fetchEnquiries = useCallback(async () => {
    setLoading(true);
    try {
      const res = await contactAPI.getAll({ limit: 1000, page: 1 });
      setData(res.data.data);
    } catch(err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEnquiries();
  }, [fetchEnquiries]);


  const filtered = useMemo(() => data.filter(u => {
    const q = search.toLowerCase();
    const matchQ = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || (u.from_city && u.from_city.toLowerCase().includes(q)) || (u.phone && u.phone.includes(q));
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
      title="Customers"
      subtitle={`${data.filter(u => u.status === 'new').length} new enquiries · ${data.length} total`}
    >

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="flex-1"><SearchBar value={search} onChange={v => { setSearch(v); setPage(1); }} placeholder="Search name, email, city, phone…" /></div>
        <div className="flex gap-2">
          {['all', 'new', 'contacted', 'converted', 'closed'].map(s => (
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
          { label: 'Total Enquiries', value: data.length, icon: '📋' },
          { label: 'New', value: data.filter(u => u.status === 'new').length, icon: '✨' },
          { label: 'In Progress', value: data.filter(u => u.status === 'contacted').length, icon: '📞' },
          { label: 'Converted', value: data.filter(u => u.status === 'converted').length, icon: '✅' },
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
                {['Traveller', 'Route', 'Departure', 'Cabin', 'Members', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan={9} className="px-4 py-16 text-center text-slate-400 text-sm">Loading users...</td></tr>
              ) : paged.length === 0 ? (
                <tr><td colSpan={9} className="px-4 py-16 text-center text-slate-400 text-sm">No users found</td></tr>
              ) : paged.map(u => (
                <tr key={u.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-black text-xs flex-shrink-0">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-xs whitespace-nowrap">{u.name}</p>
                        <p className="text-slate-400 text-[10px]">{u.email} · {u.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600 text-xs whitespace-nowrap font-bold">{u.from_city || '--'} → {u.to_city || '--'}</td>
                  <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">{u.departure_date || '--'}</td>
                  <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap font-bold">{u.cabin_class}</td>
                  <td className="px-4 py-3 text-slate-400 text-xs whitespace-nowrap font-bold">
                    {u.adults}A {u.children > 0 && `, ${u.children}C`}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <Badge label={u.status} color={u.status === 'new' ? 'blue' : u.status === 'converted' ? 'green' : 'amber'} />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex gap-1">
                      <button onClick={() => openView(u)} className="w-7 h-7 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 flex items-center justify-center transition-colors" title="View Details">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      </button>
                      <button onClick={() => openReminder(u)} className="w-7 h-7 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-600 flex items-center justify-center transition-colors" title="Update Status">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
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
      <Modal open={viewModal} title="Enquiry Details" onClose={() => setViewModal(false)} size="md">

        {selected && (
          <div className="space-y-5">
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-black text-2xl flex-shrink-0">
                {selected.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-black text-slate-900 text-lg">{selected.name}</h3>
                <p className="text-slate-500 text-sm">{selected.email}</p>
                <p className="text-slate-500 text-sm">{selected.phone || 'N/A'}</p>
              </div>
              <div className="ml-auto"><Badge label={selected.status} color={selected.status === 'active' ? 'green' : 'slate'} /></div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'From City', value: selected.from_city || 'N/A' },
                { label: 'To City', value: selected.to_city || 'N/A' },
                { label: 'Departure', value: selected.departure_date || '--' },
                { label: 'Return', value: selected.return_date || '--' },
                { label: 'Cabin', value: selected.cabin_class || 'Economy' },
                { label: 'Passengers', value: `${selected.adults}A, ${selected.children}C, ${selected.infants}I` },
                { label: 'Status', value: selected.status.toUpperCase() },
                { label: 'Trip Type', value: selected.trip_type || 'N/A' },
              ].map(i => (
                <div key={i.label} className="bg-slate-50 rounded-xl p-3">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">{i.label}</p>
                  <p className="font-bold text-slate-900 text-sm">{i.value}</p>
                </div>
              ))}
            </div>

            <div className="bg-slate-50 p-4 rounded-xl">
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Message</p>
               <p className="text-sm text-slate-700 italic">"{selected.message || 'No additional message'}"</p>
            </div>




            <div className="flex gap-3 pt-3 border-t border-slate-100">
              <button onClick={() => { setViewModal(false); openReminder(selected); }}
                className="flex-1 flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold py-2.5 rounded-xl text-sm transition-all active:scale-95">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                Send Reminder
              </button>
              <a href={`tel:${selected.phone || ''}`}
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
                <p className="text-slate-500 text-xs">{selected.phone || 'N/A'} · {selected.email}</p>
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

export default Customers;

