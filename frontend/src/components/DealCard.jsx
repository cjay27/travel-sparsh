import React from 'react';

const AIRLINE_COLORS = {
  IndiGo: 'bg-indigo-600',
  'Air India': 'bg-red-600',
  SpiceJet: 'bg-orange-500',
  Vistara: 'bg-purple-600',
  'GoAir': 'bg-blue-500',
  'AkasaAir': 'bg-yellow-500',
};

const TAG_COLORS = {
  'Best Seller': 'bg-green-500',
  'Hot Deal': 'bg-red-500',
  'Last Minute': 'bg-orange-500',
  'Great Value': 'bg-blue-500',
  'Flash Sale': 'bg-pink-500',
  'Weekend Special': 'bg-purple-500',
};

const DealCard = ({ deal, onBook }) => {
  const {
    origin,
    originCity,
    destination,
    destinationCity,
    airline,
    airlineCode,
    flightNo,
    departureTime,
    arrivalTime,
    duration,
    stops,
    originalPrice,
    discountedPrice,
    discount,
    validTill,
    seatsLeft,
    tag,
    image,
  } = deal;

  const validTillDate = new Date(validTill);
  const hoursLeft = Math.max(0, Math.floor((validTillDate - Date.now()) / (1000 * 60 * 60)));
  const minutesLeft = Math.max(0, Math.floor((validTillDate - Date.now()) / (1000 * 60)) % 60);

  const airlineBg = AIRLINE_COLORS[airline] || 'bg-slate-600';
  const tagBg = TAG_COLORS[tag] || 'bg-primary-500';

  const handleBook = () => {
    if (onBook) {
      onBook(deal);
    } else {
      const adivahaUrl = `https://booking.adivaha.com/search?from=${origin}&to=${destination}&date=${new Date().toISOString().split('T')[0]}&passengers=1&affiliate_id=TRAVEL_SPARSH&source=travel_sparsh&deal_id=${deal.id}`;
      window.open(adivahaUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="card overflow-hidden group cursor-pointer deal-card" onClick={handleBook}>
      {/* Image */}
      <div className="relative h-44 overflow-hidden">
        <img
          src={image}
          alt={`${originCity} to ${destinationCity}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            e.target.src = `https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400`;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        {/* Tag */}
        <span className={`absolute top-3 left-3 ${tagBg} text-white text-xs font-bold px-3 py-1 rounded-full`}>
          {tag}
        </span>
        {/* Discount badge */}
        <div className="absolute top-3 right-3 bg-accent-500 text-white text-sm font-bold w-12 h-12 rounded-full flex items-center justify-center shadow-lg">
          -{discount}%
        </div>
        {/* Route overlay */}
        <div className="absolute bottom-3 left-3 text-white">
          <div className="flex items-center gap-2 text-lg font-bold">
            <span>{origin}</span>
            <span className="text-accent-400">✈</span>
            <span>{destination}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Airline + Flight info */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={`${airlineBg} text-white text-xs font-bold w-8 h-8 rounded-lg flex items-center justify-center`}>
              {airlineCode}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">{airline}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{flightNo}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500 dark:text-slate-400">{stops === 0 ? 'Non-stop' : `${stops} stop`}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{duration}</p>
          </div>
        </div>

        {/* Time row */}
        <div className="flex items-center gap-2 mb-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl p-2">
          <div className="text-center flex-1">
            <p className="text-base font-bold text-slate-900 dark:text-white">{departureTime}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{originCity}</p>
          </div>
          <div className="flex-1 flex flex-col items-center">
            <div className="w-full flex items-center gap-1">
              <div className="flex-1 h-px bg-slate-300 dark:bg-slate-600" />
              <span className="text-primary-500 text-sm">✈</span>
              <div className="flex-1 h-px bg-slate-300 dark:bg-slate-600" />
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{duration}</p>
          </div>
          <div className="text-center flex-1">
            <p className="text-base font-bold text-slate-900 dark:text-white">{arrivalTime}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{destinationCity}</p>
          </div>
        </div>

        {/* Price + CTA */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs text-slate-400 line-through">₹{originalPrice.toLocaleString('en-IN')}</p>
            <p className="text-2xl font-extrabold text-primary-600 dark:text-primary-400">
              ₹{discountedPrice.toLocaleString('en-IN')}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">per person</p>
          </div>
          <div className="text-right">
            {seatsLeft <= 5 && (
              <p className="text-xs text-red-500 font-semibold mb-1">{seatsLeft} seats left!</p>
            )}
            {hoursLeft < 24 && (
              <p className="text-xs text-orange-500 font-semibold mb-1">
                Ends in {hoursLeft}h {minutesLeft}m
              </p>
            )}
            <button
              className="bg-gradient-to-r from-primary-500 to-accent-500
shadow-lg hover:shadow-[0_0_25px_rgba(249,115,22,0.35)] hover:bg-primary-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-200 hover:shadow-md active:scale-95"
              onClick={(e) => { e.stopPropagation(); handleBook(); }}
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DealCard;
