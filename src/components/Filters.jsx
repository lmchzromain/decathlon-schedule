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
              isActive ? "border-slate-900 text-slate-900" : "border-slate-300 text-slate-500"
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
        className="w-full min-w-[160px] flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm"
      />
    </div>
  );
}
