import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { paymentsAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const formatTime = (isoStr) => {
  if (!isoStr) return '--';
  return new Date(isoStr).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false });
};

const formatDate = (isoStr) => {
  if (!isoStr) return '--';
  return new Date(isoStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

const formatDuration = (minutes) => {
  if (!minutes) return '--';
  return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
};

const PassengerForm = ({ index, type, data, onChange }) => {
  const label = type === 'adult' ? `Adult ${index + 1}` : type === 'child' ? `Child ${index + 1}` : `Infant ${index + 1}`;
  return (
    <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 mb-4">
      <h4 className="font-semibold text-slate-800 dark:text-white mb-3 text-sm">{label}</h4>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label text-xs">First Name *</label>
          <input
            type="text"
            className="input-field"
            placeholder="As on ID"
            value={data.firstName}
            onChange={(e) => onChange(index, type, 'firstName', e.target.value)}
            required
          />
        </div>
        <div>
          <label className="label text-xs">Last Name *</label>
          <input
            type="text"
            className="input-field"
            placeholder="As on ID"
            value={data.lastName}
            onChange={(e) => onChange(index, type, 'lastName', e.target.value)}
            required
          />
        </div>
        {type !== 'infant' && (
          <div>
            <label className="label text-xs">Date of Birth</label>
            <input
              type="date"
              className="input-field"
              value={data.dateOfBirth}
              onChange={(e) => onChange(index, type, 'dateOfBirth', e.target.value)}
            />
          </div>
        )}
        <div>
          <label className="label text-xs">Title</label>
          <select
            className="input-field"
            value={data.title}
            onChange={(e) => onChange(index, type, 'title', e.target.value)}
          >
            <option value="Mr">Mr</option>
            <option value="Mrs">Mrs</option>
            <option value="Ms">Ms</option>
            <option value="Dr">Dr</option>
          </select>
        </div>
      </div>
    </div>
  );
};

const BookingPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [bookingData, setBookingData] = useState(null);
  const [passengers, setPassengers] = useState([]);
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/book');
      return;
    }
    const stored = sessionStorage.getItem('selectedFlight');
    if (!stored) {
      navigate('/');
      return;
    }
    const parsed = JSON.parse(stored);
    setBookingData(parsed);

    // Pre-fill contact from user profile
    if (user) {
      setContactEmail(user.email || '');
      setContactPhone(user.phone || '');
    }

    // Initialize passenger forms
    const { adults = 1, children = 0, infants = 0 } = parsed.searchParams;
    const paxList = [];
    for (let i = 0; i < parseInt(adults); i++) {
      paxList.push({ type: 'adult', index: i, firstName: '', lastName: '', title: 'Mr', dateOfBirth: '' });
    }
    for (let i = 0; i < parseInt(children); i++) {
      paxList.push({ type: 'child', index: i, firstName: '', lastName: '', title: 'Mr', dateOfBirth: '' });
    }
    for (let i = 0; i < parseInt(infants); i++) {
      paxList.push({ type: 'infant', index: i, firstName: '', lastName: '', title: 'Mr', dateOfBirth: '' });
    }
    setPassengers(paxList);
  }, [isAuthenticated, navigate, user]);

  const handlePassengerChange = (index, type, field, value) => {
    setPassengers((prev) =>
      prev.map((p) => (p.type === type && p.index === index ? { ...p, [field]: value } : p))
    );
  };

  const validateForm = () => {
    for (const p of passengers) {
      if (!p.firstName.trim() || !p.lastName.trim()) {
        setError(`Please fill first and last name for all passengers`);
        return false;
      }
    }
    if (!contactEmail.trim()) {
      setError('Contact email is required');
      return false;
    }
    if (!contactPhone.trim()) {
      setError('Contact phone is required');
      return false;
    }
    return true;
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setError(null);
    if (!validateForm()) return;

    setLoading(true);
    try {
      const { flight, searchParams } = bookingData;
      const totalAmount = flight.price.raw;

      // 1. Create Razorpay order
      const orderRes = await paymentsAPI.createOrder({
        amount: totalAmount,
        currency: 'INR',
        flightDetails: {
          origin: flight.leg.origin,
          destination: flight.leg.destination,
          departureDate: flight.leg.departure,
        },
      });

      const { orderId, keyId } = orderRes.data.data;

      // 2. Load Razorpay script
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        setError('Failed to load payment gateway. Please try again.');
        setLoading(false);
        return;
      }

      // 3. Open Razorpay checkout
      const options = {
        key: keyId || import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: totalAmount * 100,
        currency: 'INR',
        name: 'Travel Sparsh',
        description: `Flight ${flight.leg.origin} → ${flight.leg.destination}`,
        order_id: orderId,
        prefill: {
          name: user?.name || '',
          email: contactEmail,
          contact: contactPhone,
        },
        theme: { color: '#2563eb' },
        handler: async (response) => {
          // 4. Verify payment on backend
          try {
            const verifyRes = await paymentsAPI.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              flightDetails: {
                origin: flight.leg.origin,
                originCity: flight.leg.originCity,
                destination: flight.leg.destination,
                destinationCity: flight.leg.destinationCity,
                departureDate: flight.leg.departure,
                arrivalDate: flight.leg.arrival,
                airline: flight.leg.airline,
                airlineCode: flight.leg.airlineCode,
                flightNo: flight.leg.flightNo,
                class: searchParams.cabinClass || 'Economy',
                duration: flight.leg.durationInMinutes
                  ? `${Math.floor(flight.leg.durationInMinutes / 60)}h ${flight.leg.durationInMinutes % 60}m`
                  : '',
                stops: flight.leg.stopCount || 0,
                adultCount: parseInt(searchParams.adults) || 1,
                childCount: parseInt(searchParams.children) || 0,
                infantCount: parseInt(searchParams.infants) || 0,
              },
              passengers: passengers.map((p) => ({
                type: p.type,
                title: p.title,
                firstName: p.firstName,
                lastName: p.lastName,
                dateOfBirth: p.dateOfBirth || undefined,
              })),
              totalAmount,
              isRoundTrip: searchParams.tripType === 'roundtrip',
              returnFlightDetails: flight.returnLeg
                ? {
                  origin: flight.returnLeg.origin,
                  originCity: flight.returnLeg.originCity,
                  destination: flight.returnLeg.destination,
                  destinationCity: flight.returnLeg.destinationCity,
                  departureDate: flight.returnLeg.departure,
                  arrivalDate: flight.returnLeg.arrival,
                  airline: flight.returnLeg.airline,
                  airlineCode: flight.returnLeg.airlineCode,
                  flightNo: flight.returnLeg.flightNo,
                  stops: flight.returnLeg.stopCount || 0,
                }
                : undefined,
            });

            sessionStorage.removeItem('selectedFlight');
            const booking = verifyRes.data.data;
            navigate(`/booking-success?pnr=${booking.pnr}&bookingId=${booking._id}`);
          } catch (err) {
            setError(err.response?.data?.message || 'Payment verification failed. Please contact support.');
            setLoading(false);
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (response) => {
        setError(`Payment failed: ${response.error.description}`);
        setLoading(false);
      });
      rzp.open();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to initiate payment. Please try again.');
      setLoading(false);
    }
  };

  if (!bookingData) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4 animate-spin">✈</div>
          <p className="text-slate-500">Loading booking details...</p>
        </div>
      </div>
    );
  }

  const { flight, searchParams } = bookingData;
  const adults = passengers.filter((p) => p.type === 'adult');
  const children = passengers.filter((p) => p.type === 'child');
  const infants = passengers.filter((p) => p.type === 'infant');

  return (
    <div className="min-h-screen pt-20 pb-10 bg-slate-50 dark:bg-slate-900">
      <div className="max-w-4xl mx-auto px-4">
        <button onClick={() => navigate(-1)} className="text-sm text-primary-600 hover:underline mb-4 flex items-center gap-1">
          ← Back to Results
        </button>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Complete Your Booking</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Passenger Form */}
          <div className="lg:col-span-2">
            {/* Flight Summary */}
            <div className="bg-white bg-white/95 dark:bg-[#020617]/95
backdrop-blur-xl
border border-white/40 dark:border-white/10 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-5 mb-6">
              <h2 className="font-bold text-slate-900 dark:text-white mb-3">Flight Details</h2>
              <div className="flex items-center justify-between">
                <div className="text-center">
                  <p className="text-2xl font-black text-slate-900 dark:text-white">{formatTime(flight.leg.departure)}</p>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{flight.leg.origin}</p>
                  <p className="text-xs text-slate-400">{formatDate(flight.leg.departure)}</p>
                </div>
                <div className="flex-1 px-4 text-center">
                  <p className="text-xs text-slate-500">{formatDuration(flight.leg.durationInMinutes)}</p>
                  <div className="flex items-center gap-1 justify-center my-1">
                    <div className="h-px flex-1 bg-slate-300 dark:bg-slate-600"></div>
                    <span className="text-primary-500">✈</span>
                    <div className="h-px flex-1 bg-slate-300 dark:bg-slate-600"></div>
                  </div>
                  <p className="text-xs text-slate-500">{flight.leg.stopCount === 0 ? 'Non-stop' : `${flight.leg.stopCount} stop`}</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-black text-slate-900 dark:text-white">{formatTime(flight.leg.arrival)}</p>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{flight.leg.destination}</p>
                  <p className="text-xs text-slate-400">{formatDate(flight.leg.arrival)}</p>
                </div>
              </div>
              <p className="text-xs text-slate-400 mt-2">{flight.leg.airline} · {flight.leg.flightNo} · {searchParams.cabinClass}</p>
            </div>

            {/* Passenger Details */}
            <div className="bg-white bg-white/95 dark:bg-[#020617]/95
backdrop-blur-xl
border border-white/40 dark:border-white/10 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-5 mb-6">
              <h2 className="font-bold text-slate-900 dark:text-white mb-4">Passenger Details</h2>
              {adults.map((p) => (
                <PassengerForm key={`adult-${p.index}`} index={p.index} type="adult" data={p} onChange={handlePassengerChange} />
              ))}
              {children.map((p) => (
                <PassengerForm key={`child-${p.index}`} index={p.index} type="child" data={p} onChange={handlePassengerChange} />
              ))}
              {infants.map((p) => (
                <PassengerForm key={`infant-${p.index}`} index={p.index} type="infant" data={p} onChange={handlePassengerChange} />
              ))}
            </div>

            {/* Contact Details */}
            <div className="bg-white bg-white/95 dark:bg-[#020617]/95
backdrop-blur-xl
border border-white/40 dark:border-white/10 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-5 mb-6">
              <h2 className="font-bold text-slate-900 dark:text-white mb-4">Contact Details</h2>
              <p className="text-xs text-slate-500 mb-3">Booking confirmation will be sent to this email</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label text-xs">Email Address *</label>
                  <input
                    type="email"
                    className="input-field"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="label text-xs">Phone Number *</label>
                  <input
                    type="tel"
                    className="input-field"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-4">
                <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
              </div>
            )}
          </div>

          {/* Right: Price Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white bg-white/95 dark:bg-[#020617]/95
backdrop-blur-xl
border border-white/40 dark:border-white/10 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-5 sticky top-24">
              <h2 className="font-bold text-slate-900 dark:text-white mb-4">Price Summary</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>{searchParams.adults} Adult{searchParams.adults > 1 ? 's' : ''}</span>
                  <span>{flight.price.formatted}</span>
                </div>
                {searchParams.children > 0 && (
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>{searchParams.children} Child{searchParams.children > 1 ? 'ren' : ''}</span>
                    <span>Included</span>
                  </div>
                )}
                {searchParams.infants > 0 && (
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>{searchParams.infants} Infant{searchParams.infants > 1 ? 's' : ''}</span>
                    <span>Included</span>
                  </div>
                )}
                <div className="border-t border-slate-100 dark:border-slate-700 pt-2 mt-2">
                  <div className="flex justify-between font-bold text-slate-900 dark:text-white text-base">
                    <span>Total</span>
                    <span className="text-primary-600">{flight.price.formatted}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">Inclusive of all taxes</p>
                </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={loading}
                className="w-full btn-primary mt-6 py-3 text-base flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>Pay {flight.price.formatted}</>
                )}
              </button>

              <div className="flex items-center gap-2 mt-3 justify-center">
                <img src="https://razorpay.com/assets/razorpay-glyph.svg" alt="Razorpay" className="h-4" onError={(e) => e.target.style.display = 'none'} />
                <p className="text-xs text-slate-400">Secured by Razorpay</p>
              </div>
              <p className="text-xs text-slate-400 text-center mt-1">Test mode · Use card 4111 1111 1111 1111</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
