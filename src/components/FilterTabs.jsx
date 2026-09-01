import React from 'react';

const CATEGORIES = ['All', 'Restaurants', 'Cafes', 'Coffee Shops'];

export default function FilterTabs({ activeFilter, onFilterChange }) {
  return (
    <nav aria-label="Category filters" className="flex justify-center my-6">
      <div className="inline-flex p-1 bg-stone-200/60 rounded-xl space-x-1" role="tablist">
        {CATEGORIES.map((cat) => {
          const isActive = activeFilter === cat;
          return (
            <button
              key={cat}
              role="tab"
              aria-selected={isActive}
              aria-controls="venue-list-panel"
              onClick={() => onFilterChange(cat)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                isActive
                  ? 'bg-white text-forest-800 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-white/50'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
