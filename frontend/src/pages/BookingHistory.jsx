import React, { useState, useEffect, useCallback } from 'react';
import { bookingsAPI } from '../utils/api';
import BookingCard from '../components/BookingCard';
import { SkeletonCard } from '../components/LoadingSpinner';

const STATUSES = ['all', 'confirmed', 'pending', 'completed', 'cancelled', 'failed'];

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('all');
  const [pnrSearch, setPnrSearch] = useState('');
  const [pnrInput, setPnrInput] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 5 };
      if (status !== 'all') params.status = status;
      if (pnrSearch) params.pnr = pnrSearch;
      const res = await bookingsAPI.getMyBookings(params);
      setBookings(res.data.data || []);
      setTotalPages(res.data.pages || 1);
      setTotal(res.data.total || 0);
    } catch {
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, [status, pnrSearch, page]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleCancel = async (bookingId) => {
    try {
      await bookingsAPI.cancelBooking(bookingId);
      setBookings((prev) =>
        prev.map((b) => (b._id === bookingId ? { ...b, status: 'cancelled' } : b))
      );
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel booking');
    }
  };

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    setPage(1);
  };

  const handlePnrSearch = (e) => {
    e.preventDefault();
    setPnrSearch(pnrInput);
    setPage(1);
  };

  const clearPnrSearch = () => {
    setPnrInput('');
    setPnrSearch('');
    setPage(1);
  };

  return (
    <div className="min-h-screen pt-16 bg-slate-50 dark:bg-slate-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">Booking History</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            {total > 0 ? `${total} booking${total > 1 ? 's' : ''} found` : 'View and manage all your flight bookings'}
          </p>
        </div>

        {/* Filters */}
        <div className="card p-5 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* PNR Search */}
            <form onSubmit={handlePnrSearch} className="flex gap-2 flex-1">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={pnrInput}
                  onChange={(e) => setPnrInput(e.target.value.toUpperCase())}
                  placeholder="Search by PNR..."
                  className="input-field pr-8"
                />
                {pnrInput && (
                  <button
                    type="button"
                    onClick={clearPnrSearch}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-sm"
                  >
                    ✕
                  </button>
                )}
              </div>
              <button type="submit" className="btn-primary px-4 py-2.5 text-sm">
                🔍
              </button>
            </form>
          </div>

          {/* Status tabs */}
          <div className="flex flex-wrap gap-2 mt-4">
            {STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => handleStatusChange(s)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 capitalize ${status === s
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
                  }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Bookings list */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
          </div>
        ) : bookings.length > 0 ? (
          <>
            <div className="space-y-4">
              {bookings.map((booking) => (
                <BookingCard key={booking._id} booking={booking} onCancel={handleCancel} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  ← Prev
                </button>
                {[...Array(totalPages)].map((_, idx) => (
                  <button
                    key={idx + 1}
                    onClick={() => setPage(idx + 1)}
                    className={`w-9 h-9 rounded-xl text-sm font-semibold transition-colors ${page === idx + 1
                        ? 'bg-primary-600 text-white'
                        : 'border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                  >
                    {idx + 1}
                  </button>
                ))}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="card p-16 text-center">
            <div className="text-6xl mb-4">
              {pnrSearch ? '🔍' : status !== 'all' ? '📋' : '✈'}
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              {pnrSearch ? `No bookings found for PNR "${pnrSearch}"` : status !== 'all' ? `No ${status} bookings` : 'No bookings yet'}
            </h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6">
              {pnrSearch || status !== 'all' ? 'Try different filters' : 'Book your first flight and it will appear here'}
            </p>
            {!pnrSearch && status === 'all' && (
              <a href="/" className="btn-primary inline-block">
                Search Flights →
              </a>
            )}
            {(pnrSearch || status !== 'all') && (
              <button
                onClick={() => { clearPnrSearch(); setStatus('all'); }}
                className="btn-outline"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingHistory;
