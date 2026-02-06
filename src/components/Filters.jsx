const CENTER_OPTIONS = [
  { id: 5279, label: "Lille", badge: "bg-emerald-500/15 text-emerald-100" },
  { id: 5280, label: "Marq", badge: "bg-sky-500/15 text-sky-100" }
];

export default function Filters({ selectedCenters, searchTerm, onToggleCenter, onSearch }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex flex-wrap items-center gap-2">
        {CENTER_OPTIONS.map((center) => {
          const isActive = selectedCenters.includes(center.id);
          return (
            <button
              key={center.id}
              type="button"
              onClick={() => onToggleCenter(center.id)}
              className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] transition ${
                isActive ? center.badge : "bg-slate-800/40 text-slate-400"
              }`}
            >
              {center.label}
            </button>
          );
        })}
      </div>
      <input
        id="activity-search"
        type="search"
        value={searchTerm}
        onChange={(event) => onSearch(event.target.value)}
        placeholder="Rechercher une activite"
        className="w-full min-w-[160px] flex-1 rounded-xl border border-slate-800 bg-slate-950/50 px-4 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-brand-primary focus:outline-none"
      />
    </div>
  );
}
