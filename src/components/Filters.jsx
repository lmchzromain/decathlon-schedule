const CENTER_OPTIONS = [
  { id: 5279, label: "Lille" },
  { id: 5280, label: "Marq" }
];

export default function Filters({ selectedCenters, searchTerm, onToggleCenter, onSearch }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {CENTER_OPTIONS.map((center) => {
        const isActive = selectedCenters.includes(center.id);
        return (
          <button
            key={center.id}
            type="button"
            onClick={() => onToggleCenter(center.id)}
              className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${
                isActive
                  ? "border-[rgb(var(--color-text))] text-[rgb(var(--color-text))]"
                  : "border-[rgb(var(--color-border))] text-[rgb(var(--color-muted))]"
              }`}
          >
            {center.label}
          </button>
        );
      })}
      <input
        id="activity-search"
        type="search"
        value={searchTerm}
        onChange={(event) => onSearch(event.target.value)}
        placeholder="Rechercher une activite"
        className="w-full min-w-[160px] flex-1 rounded-md border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] px-3 py-2 text-sm text-[rgb(var(--color-text))] placeholder:text-[rgb(var(--color-muted))] focus:outline-none"
      />
    </div>
  );
}
