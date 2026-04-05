import React, { useState, useMemo } from 'react';
import AdminLayout, { SearchBar, Badge, Pagination, Modal, FormField, Input, Select } from '../../components/admin/AdminLayout';

const INIT = [
  { id: 1, name: 'IndiGo', iata: '6E', country: 'India', type: 'LCC', routes: 85, commission: '3.5', status: 'active', contact: 'partnerships@indigo.in', joined: '2022-01-15' },
  { id: 2, name: 'Air India', iata: 'AI', country: 'India', type: 'FSC', routes: 120, commission: '4.0', status: 'active', contact: 'partners@airindia.in', joined: '2021-06-20' },
  { id: 3, name: 'SpiceJet', iata: 'SG', country: 'India', type: 'LCC', routes: 64, commission: '3.0', status: 'active', contact: 'trade@spicejet.com', joined: '2022-03-10' },
  { id: 4, name: 'Vistara', iata: 'UK', country: 'India', type: 'FSC', routes: 42, commission: '4.5', status: 'inactive', contact: 'partners@airvistara.com', joined: '2022-08-01' },
  { id: 5, name: 'GoAir', iata: 'G8', country: 'India', type: 'LCC', routes: 30, commission: '3.0', status: 'inactive', contact: 'trade@goair.in', joined: '2023-01-05' },
  { id: 6, name: 'AirAsia India', iata: 'I5', country: 'India', type: 'LCC', routes: 25, commission: '3.2', status: 'active', contact: 'partners@airasia.in', joined: '2022-11-12' },
  { id: 7, name: 'Akasa Air', iata: 'QP', country: 'India', type: 'LCC', routes: 18, commission: '3.0', status: 'active', contact: 'trade@akasaair.in', joined: '2023-04-20' },
  { id: 8, name: 'Emirates', iata: 'EK', country: 'UAE', type: 'FSC', routes: 200, commission: '5.0', status: 'active', contact: 'india@emirates.com', joined: '2021-09-15' },
  { id: 9, name: 'Qatar Airways', iata: 'QR', country: 'Qatar', type: 'FSC', routes: 180, commission: '5.5', status: 'active', contact: 'india@qatarairways.com', joined: '2021-10-01' },
  { id: 10, name: 'Singapore Airlines', iata: 'SQ', country: 'Singapore', type: 'FSC', routes: 145, commission: '5.0', status: 'active', contact: 'india@singaporeair.com', joined: '2022-02-14' },
  { id: 11, name: 'Lufthansa', iata: 'LH', country: 'Germany', type: 'FSC', routes: 160, commission: '4.8', status: 'active', contact: 'india@lufthansa.com', joined: '2022-05-20' },
  { id: 12, name: 'British Airways', iata: 'BA', country: 'UK', type: 'FSC', routes: 130, commission: '4.5', status: 'pending', contact: 'india@ba.com', joined: '2023-06-01' },
  { id: 13, name: 'Air France', iata: 'AF', country: 'France', type: 'FSC', routes: 140, commission: '4.7', status: 'active', contact: 'india@airfrance.com', joined: '2022-09-10' },
  { id: 14, name: 'Thai Airways', iata: 'TG', country: 'Thailand', type: 'FSC', routes: 80, commission: '4.2', status: 'pending', contact: 'india@thaiair.com', joined: '2023-07-15' },
  { id: 15, name: 'Star Air', iata: 'S5', country: 'India', type: 'Regional', routes: 12, commission: '2.8', status: 'active', contact: 'trade@starair.in', joined: '2023-08-20' },
];

const BLANK = { name: '', iata: '', country: 'India', type: 'LCC', routes: '', commission: '', status: 'active', contact: '', joined: '' };
const PAGE_SIZE = 8;

const statusColor = { active: 'green', inactive: 'red', pending: 'amber' };
const typeColor = { LCC: 'blue', FSC: 'purple', Regional: 'slate' };

const Airlines = () => {
  const [data, setData] = useState(INIT);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState(null); // 'add'|'edit'|'delete'
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(BLANK);
  const [errors, setErrors] = useState({});

  const filtered = useMemo(() => data.filter(a => {
    const q = search.toLowerCase();
    const matchQ = !q || a.name.toLowerCase().includes(q) || a.iata.toLowerCase().includes(q) || a.country.toLowerCase().includes(q);
    const matchS = filterStatus === 'all' || a.status === filterStatus;
    return matchQ && matchS;
  }), [data, search, filterStatus]);

  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  const openAdd = () => { setForm(BLANK); setErrors({}); setModal('add'); };
  const openEdit = (a) => { setSelected(a); setForm({ ...a }); setErrors({}); setModal('edit'); };
  const openDelete = (a) => { setSelected(a); setModal('delete'); };
  const closeModal = () => { setModal(null); setSelected(null); };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Required';
    if (!form.iata.trim()) e.iata = 'Required';
    if (!form.contact.trim()) e.contact = 'Required';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSave = () => {
    if (!validate()) return;
    if (modal === 'add') {
      setData(d => [...d, { ...form, id: Date.now(), routes: Number(form.routes) || 0 }]);
    } else {
      setData(d => d.map(a => a.id === selected.id ? { ...form, id: a.id, routes: Number(form.routes) || 0 } : a));
    }
    closeModal();
  };

  const handleDelete = () => {
    setData(d => d.filter(a => a.id !== selected.id));
    closeModal();
  };

  const f = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  return (
    <AdminLayout
      title="Airline Partners"
      subtitle={`${data.filter(a => a.status === 'active').length} active · ${data.length} total`}
      actions={
        <button onClick={openAdd}
          className="flex items-center gap-2 bg-[#0d1f5c] hover:bg-[#0a1848] text-white text-sm font-bold px-4 py-2 rounded-xl transition-all active:scale-95 shadow-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Airline
        </button>
      }
    >
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="flex-1"><SearchBar value={search} onChange={v => { setSearch(v); setPage(1); }} placeholder="Search by name, IATA, country…" /></div>
        <div className="flex gap-2">
          {['all', 'active', 'inactive', 'pending'].map(s => (
            <button key={s} onClick={() => { setFilterStatus(s); setPage(1); }}
              className={`px-3 py-2 rounded-xl text-xs font-bold capitalize transition-all border ${filterStatus === s ? 'bg-[#0d1f5c] text-white border-[#0d1f5c]' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {['Airline', 'IATA', 'Country', 'Type', 'Routes', 'Commission', 'Contact', 'Joined', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paged.length === 0 ? (
                <tr><td colSpan={10} className="px-4 py-16 text-center text-slate-400 text-sm">No airlines found</td></tr>
              ) : paged.map(a => (
                <tr key={a.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-4 py-3 font-bold text-slate-900 whitespace-nowrap">{a.name}</td>
                  <td className="px-4 py-3"><span className="font-black font-mono text-blue-700 bg-blue-50 px-2 py-0.5 rounded-lg text-xs">{a.iata}</span></td>
                  <td className="px-4 py-3 text-slate-600 text-xs whitespace-nowrap">{a.country}</td>
                  <td className="px-4 py-3 whitespace-nowrap"><Badge label={a.type} color={typeColor[a.type] ?? 'slate'} /></td>
                  <td className="px-4 py-3 text-slate-700 font-semibold text-xs">{a.routes}</td>
                  <td className="px-4 py-3 text-emerald-700 font-bold text-xs whitespace-nowrap">{a.commission}%</td>
                  <td className="px-4 py-3 text-slate-500 text-xs max-w-[150px] truncate">{a.contact}</td>
                  <td className="px-4 py-3 text-slate-400 text-xs whitespace-nowrap">{a.joined}</td>
                  <td className="px-4 py-3 whitespace-nowrap"><Badge label={a.status} color={statusColor[a.status]} /></td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex gap-1">
                      <button onClick={() => openEdit(a)} className="w-7 h-7 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 flex items-center justify-center transition-colors" title="Edit">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      </button>
                      <button onClick={() => openDelete(a)} className="w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition-colors" title="Delete">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
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

      {/* Add/Edit Modal */}
      <Modal open={modal === 'add' || modal === 'edit'} title={modal === 'add' ? 'Add Airline Partner' : 'Edit Airline'} onClose={closeModal} size="lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Airline Name" required error={errors.name}>
            <Input value={form.name} onChange={f('name')} placeholder="e.g. IndiGo" className={errors.name ? 'border-red-400' : ''} />
          </FormField>
          <FormField label="IATA Code" required error={errors.iata}>
            <Input value={form.iata} onChange={f('iata')} placeholder="e.g. 6E" maxLength={3} className={`uppercase ${errors.iata ? 'border-red-400' : ''}`} />
          </FormField>
          <FormField label="Country">
            <Input value={form.country} onChange={f('country')} placeholder="India" />
          </FormField>
          <FormField label="Type">
            <Select value={form.type} onChange={f('type')}>
              {['LCC', 'FSC', 'Regional', 'Charter'].map(t => <option key={t}>{t}</option>)}
            </Select>
          </FormField>
          <FormField label="No. of Routes">
            <Input type="number" value={form.routes} onChange={f('routes')} placeholder="0" min="0" />
          </FormField>
          <FormField label="Commission (%)">
            <Input type="number" value={form.commission} onChange={f('commission')} placeholder="3.5" step="0.1" min="0" max="20" />
          </FormField>
          <FormField label="Contact Email" required error={errors.contact} className="sm:col-span-2">
            <Input value={form.contact} onChange={f('contact')} placeholder="partners@airline.com" className={errors.contact ? 'border-red-400' : ''} />
          </FormField>
          <FormField label="Partner Since">
            <Input type="date" value={form.joined} onChange={f('joined')} />
          </FormField>
          <FormField label="Status">
            <Select value={form.status} onChange={f('status')}>
              {['active', 'inactive', 'pending'].map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
            </Select>
          </FormField>
        </div>
        <div className="flex justify-end gap-3 mt-6 pt-5 border-t border-slate-100">
          <button onClick={closeModal} className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition-all">Cancel</button>
          <button onClick={handleSave} className="px-5 py-2.5 rounded-xl bg-[#0d1f5c] hover:bg-[#0a1848] text-white font-bold text-sm transition-all active:scale-95">
            {modal === 'add' ? 'Add Partner' : 'Save Changes'}
          </button>
        </div>
      </Modal>

      {/* Delete confirm */}
      <Modal open={modal === 'delete'} title="Remove Airline Partner" onClose={closeModal} size="sm">
        <div className="text-center py-2">
          <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          </div>
          <p className="text-slate-700 font-semibold mb-1">Remove <span className="text-slate-900">{selected?.name}</span>?</p>
          <p className="text-slate-400 text-xs">This action cannot be undone.</p>
          <div className="flex gap-3 justify-center mt-6">
            <button onClick={closeModal} className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50">Cancel</button>
            <button onClick={handleDelete} className="px-5 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-sm transition-all active:scale-95">Remove</button>
          </div>
        </div>
      </Modal>
    </AdminLayout>
  );
};

export default Airlines;
