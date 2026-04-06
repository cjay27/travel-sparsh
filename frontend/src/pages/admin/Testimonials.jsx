import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout, { Badge, Modal, FormField, Input, Select } from '../../components/admin/AdminLayout';
import { testimonialsAPI } from '../../utils/api';

const Testimonials = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [formData, setFormData] = useState({
    name: '', city: '', rating: 5, content: '', profile_image_url: '', is_active: 1
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchTestimonials = useCallback(async () => {
    setLoading(true);
    try {
      const res = await testimonialsAPI.adminAll();
      setData(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

  const handleOpenModal = (t = null) => {
    if (t) {
      setSelected(t);
      setFormData({
        name: t.name,
        city: t.city || '',
        rating: t.rating,
        content: t.content,
        profile_image_url: t.profile_image_url || '',
        is_active: t.is_active
      });
    } else {
      setSelected(null);
      setFormData({ name: '', city: '', rating: 5, content: '', profile_image_url: '', is_active: 1 });
    }
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (selected) {
        await testimonialsAPI.update(selected.id, formData);
      } else {
        await testimonialsAPI.create(formData);
      }
      setModalOpen(false);
      fetchTestimonials();
    } catch (err) {
      alert('Error saving testimonial');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this testimonial?')) return;
    try {
      await testimonialsAPI.remove(id);
      fetchTestimonials();
    } catch (err) {
      alert('Error deleting');
    }
  };

  return (
    <AdminLayout
      title="Testimonials"
      subtitle="Manage customer feedback and reviews shown on the homepage."
      actions={
        <button onClick={() => handleOpenModal()}
          className="bg-[#1b3b6b] hover:bg-[#152e54] text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          Add Testimonial
        </button>
      }
    >
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {['Client', 'Rating', 'Content', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan={5} className="px-4 py-12 text-center text-slate-400">Loading testimonials...</td></tr>
              ) : data.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-12 text-center text-slate-400">No testimonials found</td></tr>
              ) : data.map(t => (
                <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {t.profile_image_url ? (
                        <img src={t.profile_image_url} alt={t.name} className="w-9 h-9 rounded-full object-cover border border-slate-200" />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs uppercase border border-slate-200">
                          {t.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="font-bold text-slate-900 text-xs">{t.name}</p>
                        <p className="text-slate-400 text-[10px]">{t.city || 'Hidden City'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-0.5">
                      {Array(5).fill(0).map((_, i) => (
                        <span key={i} className={`text-xs ${i < t.rating ? 'text-amber-400' : 'text-slate-200'}`}>★</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 max-w-xs transition-all">
                    <p className="text-slate-600 text-xs line-clamp-2 italic">"{t.content}"</p>
                  </td>
                  <td className="px-4 py-3">
                    <Badge label={t.is_active ? 'active' : 'hidden'} color={t.is_active ? 'green' : 'slate'} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => handleOpenModal(t)} className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      </button>
                      <button onClick={() => handleDelete(t.id)} className="w-8 h-8 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 flex items-center justify-center transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={modalOpen} title={selected ? 'Edit Testimonial' : 'Add Testimonial'} onClose={() => setModalOpen(false)}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Client Name" required>
              <Input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. John Doe" required />
            </FormField>
            <FormField label="City">
              <Input value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} placeholder="e.g. Mumbai" />
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Rating" required>
              <Select value={formData.rating} onChange={e => setFormData({ ...formData, rating: parseInt(e.target.value) })}>
                {[5, 4, 3, 2, 1].map(r => <option key={r} value={r}>{r} Stars</option>)}
              </Select>
            </FormField>
            <FormField label="Status">
              <Select value={formData.is_active} onChange={e => setFormData({ ...formData, is_active: parseInt(e.target.value) })}>
                <option value={1}>Active (Visible)</option>
                <option value={0}>Hidden</option>
              </Select>
            </FormField>
          </div>

          <FormField label="Profile Image (Upload or URL)">
            <div className="flex gap-2 items-center">
              <label className="flex-1 cursor-pointer">
                <div className="px-4 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-center hover:bg-slate-200 transition-colors">
                  Upload Image
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={e => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setFormData({ ...formData, profile_image_url: reader.result });
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </label>
              <Input
                className="flex-[2]"
                value={formData.profile_image_url?.startsWith('data:') ? 'Image uploaded (base64)' : formData.profile_image_url}
                onChange={e => setFormData({ ...formData, profile_image_url: e.target.value })}
                placeholder="Paste URL here..."
              />
            </div>
            {formData.profile_image_url && (
              <div className="mt-2 flex items-center gap-3 bg-slate-50 p-2 rounded-lg border border-slate-100">
                <img
                  src={formData.profile_image_url}
                  className="w-10 h-10 rounded-full object-cover border border-white shadow-sm"
                  alt="Preview"
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/100?text=Error'; }}
                />
                <span className="text-[10px] text-slate-500 font-medium truncate flex-1">
                  {formData.profile_image_url.substring(0, 40)}...
                </span>
                <button type="button" onClick={() => setFormData({ ...formData, profile_image_url: '' })} className="text-red-500 text-xs font-bold p-1 hover:bg-red-50 rounded">Clear</button>
              </div>
            )}
          </FormField>


          <FormField label="Testimonial Content" required>
            <textarea
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={4}
              value={formData.content}
              onChange={e => setFormData({ ...formData, content: e.target.value })}
              placeholder="Write the testimonial here..."
              required
            />
          </FormField>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={() => setModalOpen(false)} className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all">Cancel</button>
            <button type="submit" disabled={submitting}
              className="flex-1 bg-[#1b3b6b] hover:bg-[#152e54] text-white font-bold py-2.5 rounded-xl text-sm transition-all disabled:opacity-50">
              {submitting ? 'Saving...' : 'Save Testimonial'}
            </button>
          </div>
        </form>
      </Modal>
    </AdminLayout>
  );
};

export default Testimonials;
