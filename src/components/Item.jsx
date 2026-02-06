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

const formatText = (value) => (value ? String(value) : "");

const CENTER_META = {
  5279: { label: "Lille" },
  5280: { label: "Marq" }
};

const getCenterMeta = (centerId) =>
  CENTER_META[centerId] ?? {
    label: `Centre ${formatText(centerId)}`
  };

export default function Item({ item }) {
  const centerMeta = getCenterMeta(item?.center_id);
  const activity = formatText(item?.activity);
  const room = formatText(item?.room);
  const employee = formatText(item?.employee);
  const duration = formatDuration(item?.duration);
  const places = formatPlaces(item?.placesTaken, item?.placesMax);
  const isPast = item?.start ? new Date(item.start).getTime() < Date.now() : false;

  return (
    <div className={`flex gap-4 py-3 ${isPast ? "opacity-50" : ""}`}>
      <div className="w-16 flex-shrink-0">
        <p className="text-lg font-semibold leading-tight">{formatTime(item?.start)}</p>
        {duration && <p className="text-xs text-[rgb(var(--color-muted))]">{duration}</p>}
      </div>
      <div className="flex-1">
        <div className="flex items-start justify-between gap-3">
          <p className="text-base font-semibold leading-tight">{activity || "Activite"}</p>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[rgb(var(--color-muted))]">
            {centerMeta.label}
          </span>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-[rgb(var(--color-muted))]">
          {places && <span className="text-[rgb(var(--color-text))]">{places}</span>}
          {places && (employee || room) && <span>•</span>}
          {employee && <span>{employee}</span>}
          {employee && room && <span>•</span>}
          {room && <span>{room}</span>}
        </div>
      </div>
    </div>
  );
}
