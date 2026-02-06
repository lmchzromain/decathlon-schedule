import CenterBadge from "./CenterBadge.jsx";

const CENTER_OPTIONS = [5279, 5280];

export default function Filters({ selectedCenters, searchTerm, onToggleCenter, onSearch }) {
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
        value={searchTerm}
        onChange={(event) => onSearch(event.target.value)}
        placeholder="Rechercher une activite"
        className="w-full min-w-[160px] flex-1 rounded-md border border-border bg-surface px-3 py-2 text-sm text-text placeholder:text-muted focus:outline-none"
      />
    </div>
  );
}
