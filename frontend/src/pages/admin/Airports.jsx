import React, { useState, useMemo } from 'react';
import AdminLayout, { SearchBar, Badge, Pagination, Modal, FormField, Input, Select } from '../../components/admin/AdminLayout';

const INIT = [
  { id: 1, code: 'DEL', name: 'Indira Gandhi International Airport', city: 'Delhi', state: 'Delhi', country: 'India', type: 'International', status: 'active' },
  { id: 2, code: 'BOM', name: 'Chhatrapati Shivaji Maharaj International Airport', city: 'Mumbai', state: 'Maharashtra', country: 'India', type: 'International', status: 'active' },
  { id: 3, code: 'BLR', name: 'Kempegowda International Airport', city: 'Bangalore', state: 'Karnataka', country: 'India', type: 'International', status: 'active' },
  { id: 4, code: 'MAA', name: 'Chennai International Airport', city: 'Chennai', state: 'Tamil Nadu', country: 'India', type: 'International', status: 'active' },
  { id: 5, code: 'CCU', name: 'Netaji Subhas Chandra Bose International Airport', city: 'Kolkata', state: 'West Bengal', country: 'India', type: 'International', status: 'active' },
  { id: 6, code: 'HYD', name: 'Rajiv Gandhi International Airport', city: 'Hyderabad', state: 'Telangana', country: 'India', type: 'International', status: 'active' },
  { id: 7, code: 'AMD', name: 'Sardar Vallabhbhai Patel International Airport', city: 'Ahmedabad', state: 'Gujarat', country: 'India', type: 'International', status: 'active' },
  { id: 8, code: 'PNQ', name: 'Pune International Airport', city: 'Pune', state: 'Maharashtra', country: 'India', type: 'Domestic', status: 'active' },
  { id: 9, code: 'GOI', name: 'Manohar International Airport (Goa)', city: 'Goa', state: 'Goa', country: 'India', type: 'International', status: 'active' },
  { id: 10, code: 'JAI', name: 'Jaipur International Airport', city: 'Jaipur', state: 'Rajasthan', country: 'India', type: 'International', status: 'active' },
  { id: 11, code: 'COK', name: 'Cochin International Airport', city: 'Kochi', state: 'Kerala', country: 'India', type: 'International', status: 'active' },
  { id: 12, code: 'GAU', name: 'Lokpriya Gopinath Bordoloi International Airport', city: 'Guwahati', state: 'Assam', country: 'India', type: 'International', status: 'active' },
  { id: 13, code: 'IXC', name: 'Shaheed Bhagat Singh International Airport', city: 'Chandigarh', state: 'Punjab', country: 'India', type: 'International', status: 'active' },
  { id: 14, code: 'BBI', name: 'Biju Patnaik International Airport', city: 'Bhubaneswar', state: 'Odisha', country: 'India', type: 'International', status: 'active' },
  { id: 15, code: 'VTZ', name: 'Visakhapatnam Airport', city: 'Visakhapatnam', state: 'Andhra Pradesh', country: 'India', type: 'Domestic', status: 'active' },
  { id: 16, code: 'TRV', name: 'Trivandrum International Airport', city: 'Trivandrum', state: 'Kerala', country: 'India', type: 'International', status: 'active' },
  { id: 17, code: 'IXB', name: 'Bagdogra Airport', city: 'Bagdogra', state: 'West Bengal', country: 'India', type: 'Domestic', status: 'active' },
  { id: 18, code: 'ATQ', name: 'Sri Guru Ram Dass Jee International Airport', city: 'Amritsar', state: 'Punjab', country: 'India', type: 'International', status: 'active' },
  { id: 19, code: 'SXR', name: 'Sheikh ul-Alam International Airport', city: 'Srinagar', state: 'J&K', country: 'India', type: 'Domestic', status: 'active' },
  { id: 20, code: 'IXJ', name: 'Jammu Airport (Satwari Airport)', city: 'Jammu', state: 'J&K', country: 'India', type: 'Domestic', status: 'active' },
  { id: 21, code: 'NAG', name: 'Dr. Babasaheb Ambedkar International Airport', city: 'Nagpur', state: 'Maharashtra', country: 'India', type: 'International', status: 'active' },
  { id: 22, code: 'IDR', name: 'Devi Ahilyabai Holkar Airport', city: 'Indore', state: 'Madhya Pradesh', country: 'India', type: 'Domestic', status: 'active' },
  { id: 23, code: 'PAT', name: 'Jay Prakash Narayan International Airport', city: 'Patna', state: 'Bihar', country: 'India', type: 'Domestic', status: 'active' },
  { id: 24, code: 'BDQ', name: 'Vadodara Airport', city: 'Vadodara', state: 'Gujarat', country: 'India', type: 'Domestic', status: 'active' },
  { id: 25, code: 'STV', name: 'Surat Airport', city: 'Surat', state: 'Gujarat', country: 'India', type: 'Domestic', status: 'active' },
  { id: 26, code: 'RPR', name: 'Swami Vivekananda Airport', city: 'Raipur', state: 'Chhattisgarh', country: 'India', type: 'Domestic', status: 'active' },
  { id: 27, code: 'BHO', name: 'Raja Bhoj Airport', city: 'Bhopal', state: 'Madhya Pradesh', country: 'India', type: 'Domestic', status: 'active' },
  { id: 28, code: 'AGR', name: 'Agra Airport (Kheria Airport)', city: 'Agra', state: 'Uttar Pradesh', country: 'India', type: 'Domestic', status: 'inactive' },
  { id: 29, code: 'LKO', name: 'Chaudhary Charan Singh International Airport', city: 'Lucknow', state: 'Uttar Pradesh', country: 'India', type: 'International', status: 'active' },
  { id: 30, code: 'VNS', name: 'Lal Bahadur Shastri International Airport', city: 'Varanasi', state: 'Uttar Pradesh', country: 'India', type: 'International', status: 'active' },
  { id: 31, code: 'IXZ', name: 'Veer Savarkar International Airport', city: 'Port Blair', state: 'Andaman & Nicobar', country: 'India', type: 'International', status: 'active' },
  { id: 32, code: 'SHL', name: 'Shillong Airport (Umroi Airport)', city: 'Shillong', state: 'Meghalaya', country: 'India', type: 'Domestic', status: 'active' },
  { id: 33, code: 'IMF', name: 'Imphal Airport', city: 'Imphal', state: 'Manipur', country: 'India', type: 'Domestic', status: 'active' },
  { id: 34, code: 'DIB', name: 'Dibrugarh Airport (Mohanbari Airport)', city: 'Dibrugarh', state: 'Assam', country: 'India', type: 'Domestic', status: 'active' },
  { id: 35, code: 'TEZ', name: 'Tezpur Airport (Salonibari Airport)', city: 'Tezpur', state: 'Assam', country: 'India', type: 'Domestic', status: 'inactive' },
];

const BLANK = { code: '', name: '', city: '', state: '', country: 'India', type: 'Domestic', status: 'active' };
const PAGE_SIZE = 10;

const Airports = () => {
  const [data, setData] = useState(INIT);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(BLANK);
  const [errors, setErrors] = useState({});

  const filtered = useMemo(() => data.filter(a => {
    const q = search.toLowerCase();
    const matchQ = !q || a.code.toLowerCase().includes(q) || a.name.toLowerCase().includes(q) || a.city.toLowerCase().includes(q) || a.state.toLowerCase().includes(q);
    const matchT = filterType === 'all' || a.type === filterType;
    const matchS = filterStatus === 'all' || a.status === filterStatus;
    return matchQ && matchT && matchS;
  }), [data, search, filterType, filterStatus]);

  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  const openAdd = () => { setForm(BLANK); setErrors({}); setModal('add'); };
  const openEdit = (a) => { setSelected(a); setForm({ ...a }); setErrors({}); setModal('edit'); };
  const openDelete = (a) => { setSelected(a); setModal('delete'); };
  const closeModal = () => { setModal(null); setSelected(null); };

  const validate = () => {
    const e = {};
    if (!form.code.trim() || form.code.length < 3) e.code = 'IATA code must be 3 letters';
    if (!form.name.trim()) e.name = 'Required';
    if (!form.city.trim()) e.city = 'Required';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSave = () => {
    if (!validate()) return;
    const entry = { ...form, code: form.code.toUpperCase() };
    if (modal === 'add') {
      setData(d => [...d, { ...entry, id: Date.now() }]);
    } else {
      setData(d => d.map(a => a.id === selected.id ? { ...entry, id: a.id } : a));
    }
    closeModal();
  };

  const handleDelete = () => { setData(d => d.filter(a => a.id !== selected.id)); closeModal(); };
  const f = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  return (
    <AdminLayout
      title="Airports (IATA)"
      subtitle={`${data.filter(a => a.status === 'active').length} active · ${data.length} airports`}
      actions={
        <button onClick={openAdd}
          className="flex items-center gap-2 bg-[#0d1f5c] hover:bg-[#0a1848] text-white text-sm font-bold px-4 py-2 rounded-xl transition-all active:scale-95 shadow-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Airport
        </button>
      }
    >
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="flex-1"><SearchBar value={search} onChange={v => { setSearch(v); setPage(1); }} placeholder="Search by IATA code, name, city, state…" /></div>
        <div className="flex flex-wrap gap-2">
          {['all', 'International', 'Domestic'].map(t => (
            <button key={t} onClick={() => { setFilterType(t); setPage(1); }}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border ${filterType === t ? 'bg-[#0d1f5c] text-white border-[#0d1f5c]' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`}>
              {t}
            </button>
          ))}
          {['all', 'active', 'inactive'].map(s => (
            <button key={s} onClick={() => { setFilterStatus(s); setPage(1); }}
              className={`px-3 py-2 rounded-xl text-xs font-bold capitalize transition-all border ${filterStatus === s ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { label: 'Total Airports', value: data.length, icon: '🗺' },
          { label: 'International', value: data.filter(a => a.type === 'International').length, icon: '🌏' },
          { label: 'Domestic', value: data.filter(a => a.type === 'Domestic').length, icon: '🇮🇳' },
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
                {['IATA', 'Airport Name', 'City', 'State', 'Country', 'Type', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paged.length === 0 ? (
                <tr><td colSpan={8} className="px-4 py-16 text-center text-slate-400 text-sm">No airports found</td></tr>
              ) : paged.map(a => (
                <tr key={a.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-4 py-3">
                    <span className="font-black font-mono text-[#0d1f5c] bg-blue-50 px-2.5 py-1 rounded-lg text-sm tracking-widest">{a.code}</span>
                  </td>
                  <td className="px-4 py-3 font-semibold text-slate-800 text-xs max-w-[220px]">
                    <span className="line-clamp-2">{a.name}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-700 text-xs font-bold whitespace-nowrap">{a.city}</td>
                  <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">{a.state}</td>
                  <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">{a.country}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <Badge label={a.type} color={a.type === 'International' ? 'purple' : 'blue'} />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <Badge label={a.status} color={a.status === 'active' ? 'green' : 'red'} />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex gap-1">
                      <button onClick={() => openEdit(a)} className="w-7 h-7 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 flex items-center justify-center transition-colors">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      </button>
                      <button onClick={() => openDelete(a)} className="w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition-colors">
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

      {/* Add/Edit Modal */}
      <Modal open={modal === 'add' || modal === 'edit'} title={modal === 'add' ? 'Add Airport' : 'Edit Airport'} onClose={closeModal} size="lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="IATA Code" required error={errors.code}>
            <Input value={form.code} onChange={f('code')} placeholder="e.g. DEL" maxLength={3} className={`uppercase tracking-widest font-black ${errors.code ? 'border-red-400' : ''}`} />
          </FormField>
          <FormField label="Type">
            <Select value={form.type} onChange={f('type')}>
              {['Domestic', 'International', 'Regional'].map(t => <option key={t}>{t}</option>)}
            </Select>
          </FormField>
          <FormField label="Airport Name" required error={errors.name} className="sm:col-span-2">
            <Input value={form.name} onChange={f('name')} placeholder="Full official airport name" className={errors.name ? 'border-red-400' : ''} />
          </FormField>
          <FormField label="City" required error={errors.city}>
            <Input value={form.city} onChange={f('city')} placeholder="e.g. Delhi" className={errors.city ? 'border-red-400' : ''} />
          </FormField>
          <FormField label="State / Region">
            <Input value={form.state} onChange={f('state')} placeholder="e.g. Delhi" />
          </FormField>
          <FormField label="Country">
            <Input value={form.country} onChange={f('country')} placeholder="India" />
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
            {modal === 'add' ? 'Add Airport' : 'Save Changes'}
          </button>
        </div>
      </Modal>

      {/* Delete confirm */}
      <Modal open={modal === 'delete'} title="Remove Airport" onClose={closeModal} size="sm">
        <div className="text-center py-2">
          <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          </div>
          <p className="text-slate-700 font-semibold mb-1">
            Remove <span className="font-black text-slate-900">{selected?.code}</span> — {selected?.city}?
          </p>
          <p className="text-slate-400 text-xs">This will also remove it from the search dropdown.</p>
          <div className="flex gap-3 justify-center mt-6">
            <button onClick={closeModal} className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50">Cancel</button>
            <button onClick={handleDelete} className="px-5 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-sm active:scale-95 transition-all">Remove</button>
          </div>
        </div>
      </Modal>
    </AdminLayout>
  );
};

export default Airports;
