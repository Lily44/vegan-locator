import React from 'react';

export default function SkeletonLoader() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-pulse">
      {[1, 2, 3, 4].map((n) => (
        <div key={n} className="p-5 rounded-xl border border-stone-200 bg-white h-44 flex flex-col justify-between">
          <div>
            <div className="h-5 bg-stone-200 rounded w-3/4 mb-3"></div>
            <div className="h-4 bg-stone-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-stone-200 rounded w-full"></div>
          </div>
          <div className="h-4 bg-stone-200 rounded w-1/2"></div>
        </div>
      ))}
    </div>
  );
}
