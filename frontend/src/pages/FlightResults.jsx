import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { flightsAPI } from '../utils/api';

const formatDuration = (minutes) => {
  if (!minutes) return '--';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}m`;
};

const formatTime = (isoStr) => {
  if (!isoStr) return '--';
  return new Date(isoStr).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false });
};

const formatDate = (isoStr) => {
  if (!isoStr) return '';
  return new Date(isoStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
};

const FlightCard = ({ flight, onBook, searchParams }) => {
  const { leg, returnLeg, price } = flight;
  return (
    <div className="bg-white bg-white/95 dark:bg-[#020617]/95
backdrop-blur-xl
border border-white/40 dark:border-white/10 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-5 hover:shadow-md transition-shadow">
      {/* Outbound leg */}
      <div className="flex items-center gap-4">
        {leg.airlineLogo ? (
          <img src={leg.airlineLogo} alt={leg.airline} className="w-10 h-10 object-contain rounded" />
        ) : (
          <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded flex items-center justify-center text-xs font-bold text-primary-700 dark:text-primary-300">
            {leg.airlineCode || '✈'}
          </div>
        )}
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="text-center">
              <p className="text-xl font-bold text-slate-900 dark:text-white">{formatTime(leg.departure)}</p>
              <p className="text-xs text-slate-500">{leg.origin} · {formatDate(leg.departure)}</p>
            </div>
            <div className="flex-1 px-4 text-center">
              <p className="text-xs text-slate-500">{formatDuration(leg.durationInMinutes)}</p>
              <div className="flex items-center gap-1 justify-center my-1">
                <div className="h-px flex-1 bg-slate-300 dark:bg-slate-600"></div>
                <span className="text-slate-400 text-xs">✈</span>
                <div className="h-px flex-1 bg-slate-300 dark:bg-slate-600"></div>
              </div>
              <p className="text-xs text-slate-500">{leg.stopCount === 0 ? 'Non-stop' : `${leg.stopCount} stop${leg.stopCount > 1 ? 's' : ''}`}</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-slate-900 dark:text-white">{formatTime(leg.arrival)}</p>
              <p className="text-xs text-slate-500">{leg.destination} · {formatDate(leg.arrival)}</p>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-1">{leg.airline} · {leg.flightNo} · {searchParams.get('cabinClass') || 'Economy'}</p>
        </div>
      </div>

      {/* Return leg if round trip */}
      {returnLeg && (
        <>
          <div className="border-t border-dashed border-slate-200 dark:border-slate-700 my-3"></div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded flex items-center justify-center text-xs font-bold text-slate-500">
              {returnLeg.airlineCode || '✈'}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div className="text-center">
                  <p className="text-lg font-bold text-slate-900 dark:text-white">{formatTime(returnLeg.departure)}</p>
                  <p className="text-xs text-slate-500">{returnLeg.origin} · {formatDate(returnLeg.departure)}</p>
                </div>
                <div className="flex-1 px-4 text-center">
                  <p className="text-xs text-slate-500">{formatDuration(returnLeg.durationInMinutes)}</p>
                  <div className="flex items-center gap-1 justify-center my-1">
                    <div className="h-px flex-1 bg-slate-300 dark:bg-slate-600"></div>
                    <span className="text-slate-400 text-xs">✈</span>
                    <div className="h-px flex-1 bg-slate-300 dark:bg-slate-600"></div>
                  </div>
                  <p className="text-xs text-slate-500">{returnLeg.stopCount === 0 ? 'Non-stop' : `${returnLeg.stopCount} stop${returnLeg.stopCount > 1 ? 's' : ''}`}</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-slate-900 dark:text-white">{formatTime(returnLeg.arrival)}</p>
                  <p className="text-xs text-slate-500">{returnLeg.destination} · {formatDate(returnLeg.arrival)}</p>
                </div>
              </div>
              <p className="text-xs text-slate-400 mt-1">{returnLeg.airline} · {returnLeg.flightNo}</p>
            </div>
          </div>
        </>
      )}

      {/* Price + Book */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
        <div>
          <p className="text-2xl font-black text-primary-600">{price.formatted}</p>
          <p className="text-xs text-slate-500">per person · all inclusive</p>
        </div>
        <button
          onClick={() => onBook(flight)}
          className="btn-primary px-6 py-2.5"
        >
          Book Now
        </button>
      </div>
    </div>
  );
};

const FlightResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const from = searchParams.get('from');
  const to = searchParams.get('to');
  const date = searchParams.get('date');
  const returnDate = searchParams.get('returnDate');
  const adults = searchParams.get('adults') || 1;
  const children = searchParams.get('children') || 0;
  const infants = searchParams.get('infants') || 0;
  const cabinClass = searchParams.get('cabinClass') || 'Economy';
  const tripType = searchParams.get('tripType') || 'oneway';

  useEffect(() => {
    if (!from || !to || !date) {
      navigate('/');
      return;
    }
    const fetchFlights = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await flightsAPI.search({ from, to, date, returnDate, adults, children, infants, cabinClass, tripType });
        setFlights(res.data.data || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch flights. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchFlights();
  }, [from, to, date, returnDate, adults, children, infants, cabinClass, tripType, navigate]);

  const handleBook = (flight) => {
    // Store selected flight in sessionStorage and go to booking page
    sessionStorage.setItem('selectedFlight', JSON.stringify({ flight, searchParams: { from, to, date, returnDate, adults: parseInt(adults), children: parseInt(children), infants: parseInt(infants), cabinClass, tripType } }));
    navigate('/book');
  };

  return (
    <div className="min-h-screen pt-20 pb-10 bg-slate-50 dark:bg-slate-900">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <button onClick={() => navigate(-1)} className="text-sm text-primary-600 hover:underline mb-3 flex items-center gap-1">
            ← Modify Search
          </button>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            {from} → {to}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            {date}{returnDate ? ` · Return: ${returnDate}` : ''} · {adults} Adult{adults > 1 ? 's' : ''}
            {children > 0 ? ` · ${children} Child${children > 1 ? 'ren' : ''}` : ''}
            {infants > 0 ? ` · ${infants} Infant${infants > 1 ? 's' : ''}` : ''}
            {' · '}{cabinClass}
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4 animate-bounce">✈</div>
            <p className="text-slate-600 dark:text-slate-400 font-medium">Searching for the best flights...</p>
            <p className="text-slate-400 text-sm mt-1">This may take a few seconds</p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
            <p className="text-red-700 dark:text-red-400 font-medium">{error}</p>
            <button onClick={() => navigate(-1)} className="btn-primary mt-4">
              Try Again
            </button>
          </div>
        )}

        {/* No results */}
        {!loading && !error && flights.length === 0 && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-slate-700 dark:text-slate-300 font-medium text-lg">No flights found</p>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Try different dates or airports</p>
            <button onClick={() => navigate(-1)} className="btn-primary mt-4">
              Modify Search
            </button>
          </div>
        )}

        {/* Results */}
        {!loading && !error && flights.length > 0 && (
          <>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{flights.length} flight{flights.length > 1 ? 's' : ''} found</p>
            <div className="flex flex-col gap-4">
              {flights.map((flight) => (
                <FlightCard
                  key={flight.id}
                  flight={flight}
                  onBook={handleBook}
                  searchParams={searchParams}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FlightResults;
