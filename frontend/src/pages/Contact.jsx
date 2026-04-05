import React, { useState } from 'react';
import { contactAPI } from '../utils/api';

const SUBJECTS = [
  'Flight Booking Inquiry',
  'Booking Cancellation',
  'Refund Request',
  'PNR & Status',
  'Technical Issue',
  'Partnership',
  'Other',
];

const CONTACT_INFO = [
  {
    icon: '📞',
    title: 'Customer Support',
    lines: ['1800-000-0000 (Toll Free)', '+91 98765 43210'],
    sub: 'Available 24/7',
  },
  {
    icon: '✉',
    title: 'Email Us',
    lines: ['support@travelsparsh.in', 'bookings@travelsparsh.in'],
    sub: 'Reply within 24 hours',
  },
  {
    icon: '📍',
    title: 'Office Address',
    lines: ['Level 5, Tech Park, Sector 44', 'Gurugram, Haryana - 122003'],
    sub: 'Mon-Fri: 9am - 6pm',
  },
  {
    icon: '⏰',
    title: 'Business Hours',
    lines: ['Mon - Fri: 9:00 AM - 6:00 PM', 'Sat: 10:00 AM - 4:00 PM'],
    sub: 'Sunday: Closed',
  },
];

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState('');

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Enter a valid email';
    if (!form.subject) newErrors.subject = 'Please select a subject';
    if (!form.message.trim()) newErrors.message = 'Message is required';
    else if (form.message.trim().length < 20) newErrors.message = 'Message must be at least 20 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setApiError('');
    try {
      await contactAPI.submitContact(form);
      setSuccess(true);
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) {
      setApiError(err.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-16">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-700 to-primary-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 text-white/80 text-sm mb-6 border border-white/20">
            ✉ Get in Touch
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            We're Here to <span className="text-accent-400">Help You</span>
          </h1>
          <p className="text-xl text-white/70 max-w-xl mx-auto">
            Have a question, need support, or want to partner with us? We'd love to hear from you.
          </p>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="py-16 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 -mt-10">
            {CONTACT_INFO.map((info, idx) => (
              <div key={idx} className="card p-6 text-center hover:-translate-y-1 transition-all duration-300">
                <div className="text-4xl mb-3">{info.icon}</div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-3">{info.title}</h3>
                {info.lines.map((line) => (
                  <p key={line} className="text-slate-600 dark:text-slate-400 text-sm">{line}</p>
                ))}
                <p className="text-primary-600 dark:text-primary-400 text-xs font-semibold mt-2">{info.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form + Map */}
      <section className="py-16 bg-slate-50 bg-white/95 dark:bg-[#020617]/95
backdrop-blur-xl
border border-white/40 dark:border-white/10/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Send Us a Message</h2>
              <p className="text-slate-600 dark:text-slate-400 mb-8">Fill out the form and our team will get back to you within 24 hours.</p>

              {success ? (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-8 text-center">
                  <div className="text-5xl mb-4">🎉</div>
                  <h3 className="text-xl font-bold text-green-700 dark:text-green-400 mb-2">Message Sent!</h3>
                  <p className="text-green-600 dark:text-green-500">Thank you for reaching out. We'll get back to you within 24 hours.</p>
                  <button
                    onClick={() => setSuccess(false)}
                    className="mt-4 text-primary-600 dark:text-primary-400 font-semibold hover:underline text-sm"
                  >
                    Send another message →
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {apiError && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 text-red-600 dark:text-red-400 text-sm">
                      {apiError}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="label">Full Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className={`input-field ${errors.name ? 'border-red-400 ring-1 ring-red-400' : ''}`}
                      />
                      {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>
                    <div>
                      <label className="label">Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        className={`input-field ${errors.email ? 'border-red-400 ring-1 ring-red-400' : ''}`}
                      />
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="label">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="+91 98765 43210"
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="label">Subject *</label>
                      <select
                        name="subject"
                        value={form.subject}
                        onChange={handleChange}
                        className={`input-field ${errors.subject ? 'border-red-400 ring-1 ring-red-400' : ''}`}
                      >
                        <option value="">Select a subject</option>
                        {SUBJECTS.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="label">Message *</label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      rows={5}
                      placeholder="Describe your query in detail..."
                      className={`input-field resize-none ${errors.message ? 'border-red-400 ring-1 ring-red-400' : ''}`}
                    />
                    {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
                    <p className="text-xs text-slate-400 mt-1 text-right">{form.message.length}/2000</p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>✉ Send Message</>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Map + Info */}
            <div className="space-y-6">
              {/* Google Maps Placeholder */}
              <div className="rounded-2xl overflow-hidden shadow-card h-72 bg-slate-200 dark:bg-slate-700 relative">
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 dark:text-slate-400">
                  <div className="text-6xl mb-3">📍</div>
                  <p className="font-semibold">Travel Sparsh HQ</p>
                  <p className="text-sm">Level 5, Tech Park, Sector 44</p>
                  <p className="text-sm">Gurugram, Haryana - 122003</p>
                  <a
                    href="https://maps.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 bg-gradient-to-r from-primary-500 to-accent-500
shadow-lg hover:shadow-[0_0_25px_rgba(249,115,22,0.35)] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary-700 transition-colors"
                  >
                    Open in Google Maps
                  </a>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="card p-6">
                <h3 className="font-bold text-slate-900 dark:text-white mb-4">Need Immediate Help?</h3>
                <div className="space-y-3">
                  <a
                    href="tel:18000000000"
                    className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-xl hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
                  >
                    <span className="text-2xl">📞</span>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white text-sm">Call Our Support</p>
                      <p className="text-green-600 dark:text-green-400 text-sm">1800-000-0000 (Free)</p>
                    </div>
                  </a>
                  <a
                    href="https://wa.me/919876543210"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-xl hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
                  >
                    <span className="text-2xl">💬</span>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white text-sm">WhatsApp Chat</p>
                      <p className="text-green-600 dark:text-green-400 text-sm">+91 98765 43210</p>
                    </div>
                  </a>
                  <a
                    href="mailto:support@travelsparsh.in"
                    className="flex items-center gap-3 p-3 bg-primary-50 dark:bg-primary-900/20 rounded-xl hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors"
                  >
                    <span className="text-2xl">✉</span>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white text-sm">Email Support</p>
                      <p className="text-primary-600 dark:text-primary-400 text-sm">support@travelsparsh.in</p>
                    </div>
                  </a>
                </div>
              </div>

              {/* FAQ snippet */}
              <div className="card p-6">
                <h3 className="font-bold text-slate-900 dark:text-white mb-4">Common Questions</h3>
                <div className="space-y-3">
                  {[
                    'How do I cancel my booking?',
                    'When will I get my refund?',
                    'How do I check my PNR status?',
                  ].map((q) => (
                    <div key={q} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 cursor-pointer group">
                      <span className="text-primary-500 mt-0.5 group-hover:text-primary-600">›</span>
                      <span>{q}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
