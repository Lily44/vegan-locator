import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

// Fixing default icon asset paths for Leaflet
const createCustomIcon = (isSelected) =>
  L.divIcon({
    className: 'custom-map-pin',
    html: `<div style="
      background-color: ${isSelected ? '#14532d' : '#2e7d32'};
      width: ${isSelected ? '32px' : '24px'};
      height: ${isSelected ? '32px' : '24px'};
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      <div style="width: 8px; height: 8px; background: white; border-radius: 50%;"></div>
    </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });

export default function MapView({ userCoords, venues, selectedVenueId, onSelectVenue, mobileView }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({});

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapContainerRef.current).setView(
        [userCoords.lat, userCoords.lon],
        13
      );

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(mapInstanceRef.current);
    } else {
      mapInstanceRef.current.setView([userCoords.lat, userCoords.lon], 13);
    }
  }, [userCoords]);

  // Update Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing markers
    Object.values(markersRef.current).forEach((marker) => marker.remove());
    markersRef.current = {};

    venues.forEach((venue) => {
      const isSelected = venue.id === selectedVenueId;
      const marker = L.marker([venue.lat, venue.lon], {
        icon: createCustomIcon(isSelected),
      })
        .addTo(map)
        .bindPopup(`<b>${venue.name}</b><br/>${venue.address}`);

      marker.on('click', () => onSelectVenue(venue.id));

      if (isSelected) {
        marker.openPopup();
      }

      markersRef.current[venue.id] = marker;
    });
  }, [venues, selectedVenueId, onSelectVenue]);

// In MapView.jsx

useEffect(() => {
  const handleResize = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.invalidateSize();
    }
  };

  // Run immediately with a short delay to account for layout shifts
  const timer = setTimeout(handleResize, 100);

  // Also invalidate whenever the browser window is resized
  window.addEventListener('resize', handleResize);

  return () => {
    clearTimeout(timer);
    window.removeEventListener('resize', handleResize);
  };
}, [mobileView]);


  return (
    <div
      ref={mapContainerRef}
      className="w-full h-full min-h-[350px] rounded-2xl shadow-inner border border-stone-200 z-0"
      aria-label="Map displaying venue locations"
      role="region"
    />
  );
}
