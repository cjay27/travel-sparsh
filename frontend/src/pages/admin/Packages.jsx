import React, { useState, useMemo } from 'react';
import AdminLayout, { SearchBar, Badge, Pagination, Modal, FormField, Input, Select } from '../../components/admin/AdminLayout';

const INIT = [
  { id: 1, name: 'Goa Beach Holiday', type: 'Family', destination: 'Goa', duration: '5D/4N', minPrice: 35000, maxPrice: 55000, includes: 'Flight, Hotel, Transfers', status: 'active', bookings: 45, rating: 4.8 },
  { id: 2, name: 'Royal Rajasthan', type: 'Leisure', destination: 'Jaipur, Jodhpur, Udaipur', duration: '7D/6N', minPrice: 52000, maxPrice: 85000, includes: 'Flight, Hotel, Guided Tours', status: 'active', bookings: 32, rating: 4.9 },
  { id: 3, name: 'Kashmir Honeymoon', type: 'Honeymoon', destination: 'Srinagar, Gulmarg', duration: '6D/5N', minPrice: 65000, maxPrice: 1100000, includes: 'Flight, Houseboat, Hotel, Shikara', status: 'active', bookings: 28, rating: 5.0 },
  { id: 4, name: 'Kerala Backwaters', type: 'Leisure', destination: 'Kochi, Munnar, Alleppey', duration: '6D/5N', minPrice: 42000, maxPrice: 70000, includes: 'Flight, Hotel, Houseboat, Transfers', status: 'active', bookings: 38, rating: 4.7 },
  { id: 5, name: 'Corporate Bangalore', type: 'Corporate', destination: 'Bangalore', duration: '3D/2N', minPrice: 18000, maxPrice: 30000, includes: 'Flight, Business Hotel, Airport Transfer', status: 'active', bookings: 62, rating: 4.6 },
  { id: 6, name: 'Andaman Adventure', type: 'Adventure', destination: 'Port Blair, Havelock', duration: '7D/6N', minPrice: 58000, maxPrice: 95000, includes: 'Flight, Hotel, Water Sports, Tours', status: 'active', bookings: 21, rating: 4.8 },
  { id: 7, name: 'Manali Snow Trip', type: 'Adventure', destination: 'Manali, Solang Valley', duration: '5D/4N', minPrice: 28000, maxPrice: 45000, includes: 'Flight, Hotel, Activities, Transfers', status: 'active', bookings: 44, rating: 4.7 },
  { id: 8, name: 'Family Mysore Pack', type: 'Family', destination: 'Mysore, Coorg', duration: '4D/3N', minPrice: 24000, maxPrice: 38000, includes: 'Flight, Hotel, Park Entry, Transfers', status: 'inactive', bookings: 15, rating: 4.5 },
  { id: 9, name: 'Luxury Maldives', type: 'Honeymoon', destination: 'Maldives', duration: '5D/4N', minPrice: 120000, maxPrice: 200000, includes: 'Flight, Water Villa, All-inclusive, Transfers', status: 'active', bookings: 12, rating: 5.0 },
  { id: 10, name: 'Delhi Heritage Tour', type: 'Leisure', destination: 'Delhi, Agra', duration: '4D/3N', minPrice: 22000, maxPrice: 35000, includes: 'Flight, Hotel, Guided Tours, Entry Tickets', status: 'inactive', bookings: 9, rating: 4.4 },
  { id: 11, name: 'Sikkim Valley Trek', type: 'Adventure', destination: 'Gangtok, Pelling', duration: '6D/5N', minPrice: 32000, maxPrice: 55000, includes: 'Flight, Hotel, Trek Guide, Permits', status: 'active', bookings: 18, rating: 4.6 },
  { id: 12, name: 'Corporate Chennai', type: 'Corporate', destination: 'Chennai', duration: '2D/1N', minPrice: 12000, maxPrice: 20000, includes: 'Flight, Business Hotel, Transfer', status: 'active', bookings: 41, rating: 4.5 },
];

const BLANK = { name: '', type: 'Leisure', destination: '', duration: '', minPrice: '', maxPrice: '', includes: '', status: 'active' };
const PAGE_SIZE = 8;

const typeColor = { Family: 'blue', Leisure: 'green', Honeymoon: 'purple', Corporate: 'slate', Adventure: 'amber' };

const Packages = () => {
  const [data, setData] = useState(INIT);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(BLANK);
  const [errors, setErrors] = useState({});

  const types = ['all', ...Array.from(new Set(INIT.map(p => p.type)))];

  const filtered = useMemo(() => data.filter(p => {
    const q = search.toLowerCase();
    const matchQ = !q || p.name.toLowerCase().includes(q) || p.destination.toLowerCase().includes(q) || p.type.toLowerCase().includes(q);
    const matchT = filterType === 'all' || p.type === filterType;
    return matchQ && matchT;
  }), [data, search, filterType]);

  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  const openAdd = () => { setForm(BLANK); setErrors({}); setModal('add'); };
  const openEdit = (p) => { setSelected(p); setForm({ ...p }); setErrors({}); setModal('edit'); };
  const openDelete = (p) => { setSelected(p); setModal('delete'); };
  const closeModal = () => { setModal(null); setSelected(null); };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Required';
    if (!form.destination.trim()) e.destination = 'Required';
    if (!form.duration.trim()) e.duration = 'Required';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSave = () => {
    if (!validate()) return;
    if (modal === 'add') {
      setData(d => [...d, { ...form, id: Date.now(), bookings: 0, rating: 0, minPrice: Number(form.minPrice) || 0, maxPrice: Number(form.maxPrice) || 0 }]);
    } else {
      setData(d => d.map(p => p.id === selected.id ? { ...form, id: p.id, bookings: p.bookings, rating: p.rating, minPrice: Number(form.minPrice) || 0, maxPrice: Number(form.maxPrice) || 0 } : p));
    }
    closeModal();
  };

  const handleDelete = () => { setData(d => d.filter(p => p.id !== selected.id)); closeModal(); };
  const f = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  const fmt = (n) => `₹${n >= 100000 ? (n / 100000).toFixed(1) + 'L' : (n / 1000).toFixed(0) + 'K'}`;

  return (
    <AdminLayout
      title="Packages"
      subtitle={`${data.filter(p => p.status === 'active').length} active · ${data.length} total`}
      actions={
        <button onClick={openAdd}
          className="flex items-center gap-2 bg-[#0d1f5c] hover:bg-[#0a1848] text-white text-sm font-bold px-4 py-2 rounded-xl transition-all active:scale-95 shadow-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Package
        </button>
      }
    >
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="flex-1"><SearchBar value={search} onChange={v => { setSearch(v); setPage(1); }} placeholder="Search package, destination, type…" /></div>
        <div className="flex flex-wrap gap-2">
          {types.map(t => (
            <button key={t} onClick={() => { setFilterType(t); setPage(1); }}
              className={`px-3 py-2 rounded-xl text-xs font-bold capitalize transition-all border ${filterType === t ? 'bg-[#0d1f5c] text-white border-[#0d1f5c]' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {['Package', 'Type', 'Destination', 'Duration', 'Price Range', 'Includes', 'Bookings', 'Rating', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paged.length === 0 ? (
                <tr><td colSpan={10} className="px-4 py-16 text-center text-slate-400 text-sm">No packages found</td></tr>
              ) : paged.map(p => (
                <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-4 py-3 font-bold text-slate-900 whitespace-nowrap max-w-[160px] truncate">{p.name}</td>
                  <td className="px-4 py-3 whitespace-nowrap"><Badge label={p.type} color={typeColor[p.type] ?? 'slate'} /></td>
                  <td className="px-4 py-3 text-slate-600 text-xs max-w-[150px] truncate">{p.destination}</td>
                  <td className="px-4 py-3 text-slate-600 text-xs whitespace-nowrap font-semibold">{p.duration}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="text-xs font-bold text-emerald-700">{fmt(p.minPrice)}</span>
                    <span className="text-slate-300 mx-1">—</span>
                    <span className="text-xs font-bold text-emerald-700">{fmt(p.maxPrice)}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-400 text-xs max-w-[160px] truncate">{p.includes}</td>
                  <td className="px-4 py-3 font-black text-slate-900 text-sm">{p.bookings}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="text-amber-500 font-bold text-xs">★ {p.rating.toFixed(1)}</span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap"><Badge label={p.status} color={p.status === 'active' ? 'green' : 'red'} /></td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex gap-1">
                      <button onClick={() => openEdit(p)} className="w-7 h-7 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 flex items-center justify-center transition-colors">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      </button>
                      <button onClick={() => openDelete(p)} className="w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition-colors">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-5 pb-4"><Pagination current={page} total={totalPages} onChange={p => { setPage(p); window.scrollTo(0, 0); }} /></div>
      </div>

      <Modal open={modal === 'add' || modal === 'edit'} title={modal === 'add' ? 'New Package' : 'Edit Package'} onClose={closeModal} size="lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Package Name" required error={errors.name}>
            <Input value={form.name} onChange={f('name')} placeholder="e.g. Goa Beach Holiday" className={errors.name ? 'border-red-400' : ''} />
          </FormField>
          <FormField label="Type">
            <Select value={form.type} onChange={f('type')}>
              {['Leisure', 'Family', 'Honeymoon', 'Adventure', 'Corporate', 'Custom'].map(t => <option key={t}>{t}</option>)}
            </Select>
          </FormField>
          <FormField label="Destination(s)" required error={errors.destination}>
            <Input value={form.destination} onChange={f('destination')} placeholder="e.g. Goa, Mumbai" className={errors.destination ? 'border-red-400' : ''} />
          </FormField>
          <FormField label="Duration" required error={errors.duration}>
            <Input value={form.duration} onChange={f('duration')} placeholder="e.g. 5D/4N" className={errors.duration ? 'border-red-400' : ''} />
          </FormField>
          <FormField label="Min Price (₹)">
            <Input type="number" value={form.minPrice} onChange={f('minPrice')} placeholder="35000" min="0" />
          </FormField>
          <FormField label="Max Price (₹)">
            <Input type="number" value={form.maxPrice} onChange={f('maxPrice')} placeholder="55000" min="0" />
          </FormField>
          <FormField label="Includes" className="sm:col-span-2">
            <Input value={form.includes} onChange={f('includes')} placeholder="Flight, Hotel, Transfers…" />
          </FormField>
          <FormField label="Status">
            <Select value={form.status} onChange={f('status')}>
              {['active', 'inactive'].map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
            </Select>
          </FormField>
        </div>
        <div className="flex justify-end gap-3 mt-6 pt-5 border-t border-slate-100">
          <button onClick={closeModal} className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50">Cancel</button>
          <button onClick={handleSave} className="px-5 py-2.5 rounded-xl bg-[#0d1f5c] hover:bg-[#0a1848] text-white font-bold text-sm active:scale-95 transition-all">
            {modal === 'add' ? 'Create Package' : 'Save Changes'}
          </button>
        </div>
      </Modal>

      <Modal open={modal === 'delete'} title="Delete Package" onClose={closeModal} size="sm">
        <div className="text-center py-2">
          <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          </div>
          <p className="text-slate-700 font-semibold mb-1">Delete <span className="text-slate-900">{selected?.name}</span>?</p>
          <p className="text-slate-400 text-xs">This action cannot be undone.</p>
          <div className="flex gap-3 justify-center mt-6">
            <button onClick={closeModal} className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50">Cancel</button>
            <button onClick={handleDelete} className="px-5 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-sm active:scale-95 transition-all">Delete</button>
          </div>
        </div>
      </Modal>
    </AdminLayout>
  );
};

export default Packages;
