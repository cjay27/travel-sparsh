import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout, { SearchBar, Badge, Modal, FormField, Input } from '../../components/admin/AdminLayout';
import { adminAPI } from '../../utils/api';

const AdminUsers = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fetchAdmins = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminAPI.getAdmins();
      setData(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await adminAPI.createAdmin(formData);
      setModalOpen(false);
      setFormData({ name: '', email: '', phone: '', password: '' });
      fetchAdmins();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create admin');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this admin?')) return;
    try {
      await adminAPI.deleteAdmin(id);
      fetchAdmins();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete admin');
    }
  };

  return (
    <AdminLayout
      title="Admin Users"
      subtitle="Manage internal team accounts and permissions."
      actions={
        <button onClick={() => setModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-lg shadow-blue-600/20 active:scale-95">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          Add Admin
        </button>
      }
    >
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {['Admin User', 'Role', 'Status', 'Joined', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan={5} className="px-4 py-12 text-center text-slate-400">Loading admins...</td></tr>
              ) : data.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-12 text-center text-slate-400">No admin users found</td></tr>
              ) : data.map(admin => (
                <tr key={admin.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs uppercase">
                        {admin.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-xs">{admin.name}</p>
                        <p className="text-slate-400 text-[10px]">{admin.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[10px] font-black uppercase text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                      {admin.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Badge label={admin.is_active ? 'active' : 'inactive'} color={admin.is_active ? 'green' : 'slate'} />
                  </td>
                  <td className="px-4 py-3 text-slate-500 text-xs">{admin.created_at}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleDelete(admin.id)}
                      className="w-8 h-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={modalOpen} title="Add New Admin" onClose={() => setModalOpen(false)}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField label="Full Name" required>
            <Input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Enter name" required />
          </FormField>
          <FormField label="Email Address" required>
            <Input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="admin@example.com" required />
          </FormField>
          <FormField label="Phone Number">
            <Input value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} placeholder="+91..." />
          </FormField>
          <FormField label="Password" required>
            <Input type="password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} placeholder="••••••••" required />
          </FormField>

          {error && <p className="text-red-500 text-xs font-bold">{error}</p>}

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={() => setModalOpen(false)} className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all">Cancel</button>
            <button type="submit" disabled={submitting}
              className="flex-[2] bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-sm transition-all shadow-lg shadow-blue-600/20 active:scale-95 disabled:opacity-50">
              {submitting ? 'Creating...' : 'Create Admin Account'}
            </button>
          </div>
        </form>
      </Modal>
    </AdminLayout>
  );
};

export default AdminUsers;
