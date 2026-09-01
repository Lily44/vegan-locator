import React, { useState } from 'react';
import { Search, MapPin, Loader2 } from 'lucide-react';

export default function SearchBar({ onSearch, onGeolocation, isGeoLoading }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <label htmlFor="location-search" className="sr-only">
            Search location by city, address, or zip code
          </label>
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" aria-hidden="true" />
          <input
            id="location-search"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by city, address, or postal code..."
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-stone-300 bg-white shadow-sm focus:border-forest-700 focus:ring-2 focus:ring-forest-700/20 text-slateText text-base transition-all"
          />
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-1 sm:flex-none px-6 py-3 bg-forest-700 text-white font-medium rounded-xl hover:bg-forest-800 transition-colors flex items-center justify-center gap-2 shadow-sm focus:outline-none"
          >
            <span>Search</span>
          </button>

          <button
            type="button"
            onClick={onGeolocation}
            disabled={isGeoLoading}
            aria-label="Use current location"
            title="Use current location"
            className="px-4 py-3 bg-cream-100 text-forest-700 border border-stone-300 font-medium rounded-xl hover:bg-cream-200 transition-colors flex items-center justify-center gap-2 focus:outline-none disabled:opacity-50"
          >
            {isGeoLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <MapPin className="w-5 h-5" />
            )}
            <span className="hidden md:inline">Near Me</span>
          </button>
        </div>
      </form>
    </div>
  );
}
