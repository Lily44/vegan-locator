import React from 'react';
import { MapPin, Globe, Phone, ExternalLink, Leaf } from 'lucide-react';

export default function VenueCard({ venue, isSelected, onSelect }) {
  const directionsUrl = `https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=;${venue.lat}%2C${venue.lon}`;

  return (
    <article
      onClick={() => onSelect(venue.id)}
      className={`p-5 rounded-xl border bg-white shadow-sm transition-all cursor-pointer ${
        isSelected
          ? 'border-forest-700 ring-2 ring-forest-700/20 bg-forest-50/20'
          : 'border-stone-200 hover:border-forest-600 hover:shadow-md'
      }`}
    >
      <div className="flex justify-between items-start gap-2 mb-2">
        <h3 className="text-lg font-bold text-slateText">{venue.name}</h3>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-stone-100 text-stone-700 whitespace-nowrap">
          {venue.category}
        </span>
      </div>

      <div className="mb-3">
        {venue.isOnlyVegan ? (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
            <Leaf className="w-3.5 h-3.5" aria-hidden="true" />
            100% Vegan
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800">
            Vegan Options Available
          </span>
        )}
      </div>

      <p className="text-sm text-stone-600 flex items-start gap-1.5 mb-3">
        <MapPin className="w-4 h-4 text-stone-400 mt-0.5 shrink-0" aria-hidden="true" />
        <span>{venue.address}</span>
      </p>

      <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-stone-100 text-xs text-forest-700">
        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-1 font-semibold hover:underline"
          aria-label={`Get directions to ${venue.name} (opens in new tab)`}
        >
          <ExternalLink className="w-3.5 h-3.5" /> Directions
        </a>

        {venue.website && (
          <a
            href={venue.website}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1 hover:underline"
            aria-label={`Visit website for ${venue.name} (opens in new tab)`}
          >
            <Globe className="w-3.5 h-3.5" /> Website
          </a>
        )}

        {venue.phone && (
          <a
            href={`tel:${venue.phone}`}
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1 hover:underline"
            aria-label={`Call ${venue.name}`}
          >
            <Phone className="w-3.5 h-3.5" /> {venue.phone}
          </a>
        )}
      </div>
    </article>
  );
}
