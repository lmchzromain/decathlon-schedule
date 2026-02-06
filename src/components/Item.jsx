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
    return "";
  }

  return `${value} min`;
};

const formatPlaces = (taken, max) => {
  if (max == null || max === 0) {
    return "";
  }

  const safeTaken = taken ?? "—";
  return `${safeTaken} / ${max}`;
};

const getPlacesTone = (taken, max) => {
  if (max == null || max === 0) {
    return "text-slate-300";
  }

  if (taken == null) {
    return "text-slate-200";
  }

  if (taken >= max) {
    return "text-rose-400";
  }

  const remainingRatio = (max - taken) / max;
  if (remainingRatio <= 0.2) {
    return "text-orange-300";
  }

  return "text-slate-100";
};

const formatText = (value) => (value ? String(value) : "");

const CENTER_META = {
  5279: { label: "Lille", badge: "bg-emerald-500/15 text-emerald-100" },
  5280: { label: "Marq", badge: "bg-sky-500/15 text-sky-100" }
};

const getCenterMeta = (centerId) =>
  CENTER_META[centerId] ?? {
    label: `Centre ${formatText(centerId)}`,
    badge: "bg-slate-700/40 text-slate-100"
  };

export default function Item({ item }) {
  const centerMeta = getCenterMeta(item?.center_id);
  const activity = formatText(item?.activity);
  const room = formatText(item?.room);
  const employee = formatText(item?.employee);
  const duration = formatDuration(item?.duration);
  const places = formatPlaces(item?.placesTaken, item?.placesMax);
  const placesTone = getPlacesTone(item?.placesTaken, item?.placesMax);
  const isPast = item?.start ? new Date(item.start).getTime() < Date.now() : false;

  return (
    <div
      className={`relative flex items-start gap-4 rounded-lg py-4 px-2 text-sm text-slate-200 transition ${
        isPast ? "opacity-50" : "hover:bg-white/10"
      }`}
    >
      <div className="w-16 flex-shrink-0 text-left">
        <p className="text-lg font-semibold leading-tight text-slate-100">
          {formatTime(item?.start)}
        </p>
        {duration && (
          <span className="inline-flex items-center gap-1 text-[11px] text-slate-500">
            {duration}
          </span>
        )}
      </div>
      <div className="flex-1 pb-4">
        <div className="flex items-start justify-between gap-3">
          <p className="text-base font-semibold leading-tight text-slate-100 line-clamp-2">
            {activity || "Activite"}
          </p>
          <span
            className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] ${centerMeta.badge}`}
          >
            {centerMeta.label}
          </span>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-400">
          {places && <span className={placesTone}>{places}</span>}
          {places && (employee || room) && <span className="text-slate-500">•</span>}
          {employee && <span className="text-slate-300">{employee}</span>}
          {employee && room && <span className="text-slate-500">•</span>}
          {room && <span className="text-slate-400">{room}</span>}
        </div>
      </div>
    </div>
  );
}
