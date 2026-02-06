const formatTime = (value) => {
  if (!value) {
    return "—";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit"
  });
};

const formatDuration = (value) => {
  if (!value && value !== 0) {
    return "—";
  }

  return `${value} min`;
};

const formatPlaces = (taken, max) => {
  const safeTaken = taken ?? "—";
  const safeMax = max ?? "—";
  return `${safeTaken} / ${safeMax}`;
};

const formatText = (value) => (value ? String(value) : "—");

const CENTER_META = {
  5279: { label: "Lille", badge: "border-emerald-500/40 bg-emerald-500/10 text-emerald-200" },
  5280: { label: "Marq", badge: "border-sky-500/40 bg-sky-500/10 text-sky-200" }
};

const getCenterMeta = (centerId) =>
  CENTER_META[centerId] ?? {
    label: `Centre ${formatText(centerId)}`,
    badge: "border-slate-700/60 bg-slate-800/40 text-slate-200"
  };

export default function Item({ item }) {
  const centerMeta = getCenterMeta(item?.center_id);

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4 text-sm text-slate-200">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-base font-semibold text-slate-100">{formatText(item?.activity)}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              {formatTime(item?.start)}
            </p>
            <span
              className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] ${centerMeta.badge}`}
            >
              {centerMeta.label}
            </span>
          </div>
        </div>
        <div className="rounded-full border border-slate-800 px-3 py-1 text-xs text-slate-300">
          {formatDuration(item?.duration)}
        </div>
      </div>
      <div className="mt-4 grid gap-3 text-xs text-slate-300 sm:grid-cols-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Salle</p>
          <p className="mt-1 text-sm text-slate-200">{formatText(item?.room)}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Coach</p>
          <p className="mt-1 text-sm text-slate-200">{formatText(item?.employee)}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Places</p>
          <p className="mt-1 text-sm text-slate-200">
            {formatPlaces(item?.placesTaken, item?.placesMax)}
          </p>
        </div>
      </div>
    </div>
  );
}
