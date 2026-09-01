import React, { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import FilterTabs from './components/FilterTabs';
import VenueCard from './components/VenueCard';
import MapView from './components/MapView';
import SkeletonLoader from './components/SkeletonLoader';
import { geocodeAddress, fetchVeganVenues } from './services/api';
import { Leaf, AlertCircle, Map, List } from 'lucide-react';

export default function App() {
  const [coords, setCoords] = useState({ lat: 40.7128, lon: -74.006 }); // Default: New York
  const [locationName, setLocationName] = useState('New York, NY');
  const [venues, setVenues] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedVenueId, setSelectedVenueId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeoLoading, setIsGeoLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Mobile view toggle state ('list' or 'map')
  const [mobileView, setMobileView] = useState('list');

  const loadVenues = async (latitude, longitude) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchVeganVenues(latitude, longitude);
      setVenues(data);
    } catch (err) {
      setError(err.message || 'Failed to load vegan spots. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadVenues(coords.lat, coords.lon);
  }, [coords]);

  const handleSearch = async (query) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await geocodeAddress(query);
      setCoords({ lat: result.lat, lon: result.lon });
      setLocationName(result.displayName);
    } catch (err) {
      setError(err.message || 'Location search failed.');
      setIsLoading(false);
    }
  };

  const handleGeolocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    setIsGeoLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLon = position.coords.longitude;
        setCoords({ lat: userLat, lon: userLon });
        setLocationName('Your Current Location');
        setIsGeoLoading(false);
      },
      () => {
        setError('Permission denied or position unavailable.');
        setIsGeoLoading(false);
      }
    );
  };

  const filteredVenues = venues.filter((venue) => {
    if (activeFilter === 'All') return true;
    return venue.category === activeFilter;
  });

  return (
    <div className="min-h-screen bg-cream-50 text-slateText flex flex-col relative">
      {/* Header */}
      <header className="bg-white border-b border-stone-200 py-6 px-4 sm:px-8 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="p-2 bg-forest-700 text-white rounded-xl">
              <Leaf className="w-6 h-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-forest-800 tracking-tight">
              Vegan Finder
            </h1>
          </div>
          <SearchBar
            onSearch={handleSearch}
            onGeolocation={handleGeolocation}
            isGeoLoading={isGeoLoading}
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 md:p-8 flex flex-col">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
          <div>
            <h2 className="text-xl font-bold text-slateText">
              Results near <span className="text-forest-700">{locationName}</span>
            </h2>
            <p className="text-sm text-stone-500">
              Found {filteredVenues.length} vegan spot{filteredVenues.length === 1 ? '' : 's'}
            </p>
          </div>
        </div>

        <FilterTabs activeFilter={activeFilter} onFilterChange={setActiveFilter} />

        {/* Error Alert */}
        {error && (
          <div role="alert" className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-800">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Layout Split: Cards List & Interactive Map */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[600px] w-full">

          {/* Venue List Panel */}
          <section
            id="venue-list-panel"
            aria-label="Vegan venues list"
            className={`lg:col-span-6 overflow-y-auto pr-2 space-y-4 h-full ${
              mobileView === 'list' ? 'block' : 'hidden lg:block'
            }`}
          >
            {isLoading ? (
              <SkeletonLoader />
            ) : filteredVenues.length === 0 ? (
              <div className="text-center py-12 px-4 bg-white rounded-xl border border-stone-200">
                <p className="text-stone-600 font-medium">No vegan venues found in this area.</p>
                <p className="text-sm text-stone-400 mt-1">Try expanding your search or selecting another location.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredVenues.map((venue) => (
                  <VenueCard
                    key={venue.id}
                    venue={venue}
                    isSelected={selectedVenueId === venue.id}
                    onSelect={setSelectedVenueId}
                  />
                ))}
              </div>
            )}
          </section>

          {/* Interactive Map Panel */}
          <section 
            className={`lg:col-span-6 h-full relative ${
              mobileView === 'map' ? 'block' : 'hidden lg:block'
            }`}
          >
            <MapView
              userCoords={coords}
              venues={filteredVenues}
              selectedVenueId={selectedVenueId}
              onSelectVenue={setSelectedVenueId}
              mobileView={mobileView}
            />
          </section>
        </div>
      </main>

      {/* Floating Mobile Toggle Button */}
      <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <button
          onClick={() => setMobileView(mobileView === 'list' ? 'map' : 'list')}
          aria-label={`Switch to ${mobileView === 'list' ? 'Map' : 'List'} View`}
          className="flex items-center gap-2 bg-forest-700 hover:bg-forest-800 text-white font-medium px-5 py-3 rounded-full shadow-lg transition-transform active:scale-95"
        >
          {mobileView === 'list' ? (
            <>
              <Map className="w-5 h-5" />
              <span>Map View</span>
            </>
          ) : (
            <>
              <List className="w-5 h-5" />
              <span>List View</span>
            </>
          )}
        </button>
      </div>

      <footer className="bg-white border-t border-stone-200 py-4 text-center text-xs text-stone-500">
        Data provided by Yelp Fusion API
      </footer>
    </div>
  );
}
