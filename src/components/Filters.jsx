const CENTER_OPTIONS = [
  { id: 5279, label: "Lille", badge: "border-emerald-500/40 bg-emerald-500/10 text-emerald-200" },
  { id: 5280, label: "Marq", badge: "border-sky-500/40 bg-sky-500/10 text-sky-200" }
];

export default function Filters({ selectedCenters, searchTerm, onToggleCenter, onSearch }) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-lg shadow-slate-900/40">
      <div className="flex flex-wrap items-center gap-2">
        {CENTER_OPTIONS.map((center) => {
          const isActive = selectedCenters.includes(center.id);
          return (
            <button
              key={center.id}
              type="button"
              onClick={() => onToggleCenter(center.id)}
              className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] transition ${
                isActive
                  ? center.badge
                  : "border-slate-700/60 bg-slate-800/40 text-slate-400"
              }`}
            >
              {center.label}
            </button>
          );
        })}
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="activity-search" className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          Rechercher une activite
        </label>
        <input
          id="activity-search"
          type="search"
          value={searchTerm}
          onChange={(event) => onSearch(event.target.value)}
          placeholder="Yoga, Cross training..."
          className="w-full rounded-xl border border-slate-800 bg-slate-950/50 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-400/60 focus:outline-none"
        />
      </div>
    </div>
  );
}
