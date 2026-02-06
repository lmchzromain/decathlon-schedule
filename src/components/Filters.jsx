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
      <input
        id="activity-search"
        type="search"
        value={localSearch}
        onChange={(event) => setLocalSearch(event.target.value)}
        placeholder="Rechercher une activite"
        className="w-full min-w-[160px] flex-1 rounded-md border border-border bg-surface px-3 py-2 text-base text-text placeholder:text-muted focus:outline-none"
      />
    </div>
  );
}
