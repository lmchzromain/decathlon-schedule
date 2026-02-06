import CenterBadge from "./CenterBadge.jsx";

const CENTER_OPTIONS = [5279, 5280];

import { useEffect, useState } from "react";

export default function Filters({ selectedCenters, searchTerm, onToggleCenter, onSearch }) {
  const [localSearch, setLocalSearch] = useState(searchTerm);

  useEffect(() => {
    setLocalSearch(searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onSearch(localSearch);
    }, 250);

    return () => clearTimeout(timeoutId);
  }, [localSearch, onSearch]);

  return (
    <div className="flex flex-wrap items-center gap-2">
      {CENTER_OPTIONS.map((centerId) => {
        const isActive = selectedCenters.includes(centerId);
        return (
          <button
            key={centerId}
            type="button"
            onClick={() => onToggleCenter(centerId)}
            className="focus:outline-none"
          >
            <CenterBadge centerId={centerId} isActive={isActive} />
          </button>
        );
      })}
      <div className="relative w-full min-w-[160px] flex-1">
        <input
          id="activity-search"
          type="search"
          value={localSearch}
          onChange={(event) => setLocalSearch(event.target.value)}
          placeholder="Rechercher une activite"
          className="w-full rounded-md border border-border bg-surface px-3 py-2 pr-9 text-base text-text placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
        {localSearch && (
          <button
            type="button"
            onClick={() => setLocalSearch("")}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted transition hover:bg-surface-alt hover:text-text focus:outline-none"
            aria-label="Effacer la recherche"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true" fill="none">
              <path
                d="M7 7l10 10M17 7L7 17"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
