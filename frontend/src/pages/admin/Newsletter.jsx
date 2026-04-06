import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout, { Badge, Pagination, SearchBar } from '../../components/admin/AdminLayout';
import { newsletterAPI } from '../../utils/api';

const Newsletter = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const fetchSubscribers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await newsletterAPI.getAll({ page, limit: 10, search });
      setData(res.data.data);
      setTotal(res.data.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchSubscribers();
  }, [fetchSubscribers]);

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this subscriber?')) return;
    try {
      await newsletterAPI.delete(id);
      fetchSubscribers();
    } catch (err) {
      alert('Error deleting');
    }
  };

  const handleStatusToggle = async (id, currentStatus) => {
    const nextStatus = currentStatus === 'active' ? 'unsubscribed' : 'active';
    try {
      await newsletterAPI.updateStatus(id, nextStatus);
      fetchSubscribers();
    } catch (err) {
      alert('Status update failed');
    }
  };

  return (
    <AdminLayout 
      title="Newsletter Subscribers" 
      subtitle="Manage your email marketing list and reach out to travellers."
    >
      <div className="mb-6">
        <SearchBar value={search} onChange={v => { setSearch(v); setPage(1); }} placeholder="Filter by email..." />
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden border-b-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Address</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Joined Date</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan={4} className="px-6 py-12 text-center text-slate-400 italic">Finding subscribers...</td></tr>
              ) : data.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-12 text-center text-slate-400 italic">No subscribers found</td></tr>
              ) : data.map(s => (
                <tr key={s.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <span className="font-bold text-slate-900">{s.email}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button onClick={() => handleStatusToggle(s.id, s.status)}>
                      <Badge 
                        label={s.status} 
                        color={s.status === 'active' ? 'green' : 'slate'} 
                      />
                    </button>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-xs font-medium text-slate-500">
                      {new Date(s.created_at).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleDelete(s.id)} className="p-2.5 rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm border border-red-100 group-hover:scale-105">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="mt-4">
        <Pagination current={page} total={Math.ceil(total / 10)} onChange={setPage} />
      </div>
    </AdminLayout>
  );
};

export default Newsletter;
