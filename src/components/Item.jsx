import CenterBadge from "./CenterBadge.jsx";
import CoachIcon from "./icons/CoachIcon.jsx";

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

const formatTitleCase = (value) => {
  if (!value) {
    return "";
  }

  const cleaned = String(value).replace(/\s+(Lille|Marcq)\s*$/i, "").trim();
  if (!cleaned) {
    return "";
  }

  const words = cleaned
    .toLowerCase()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1));

  return words
    .join(" ")
    .replace(/(\d+)([a-z])/g, (_, digits, letter) => `${digits}${letter.toUpperCase()}`);
};

const getPlacesTone = (taken, max) => {
  if (max == null || max === 0 || taken == null) {
    return "text-text";
  }

  if (taken >= max) {
    return "text-red-500";
  }

  const remainingRatio = (max - taken) / max;
  if (remainingRatio <= 0.3) {
    return "text-orange-400";
  }

  return "text-text";
};

const getActivityId = (item) =>
  item?.id ?? item?.activityId ?? item?.activity_id ?? item?.courseId ?? item?.course_id;

export default function Item({ item }) {
  const activity = formatText(item?.activity);
  const room = formatTitleCase(item?.room);
  const employee = formatTitleCase(item?.employee);
  const duration = formatDuration(item?.duration);
  const places = formatPlaces(item?.placesTaken, item?.placesMax);
  const placesTone = getPlacesTone(item?.placesTaken, item?.placesMax);
  const isPast = item?.start ? new Date(item.start).getTime() < Date.now() : false;
  const activityId = getActivityId(item);
  const activityLink = `https://app.heitzfit.com/#/planning/${activityId}`;

  return (
    <a
      className={`flex min-w-0 gap-4 px-3 py-3 transition ${
        isPast ? "opacity-50" : "hover:bg-surface-alt"
      }`}
      href={activityLink}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="w-16 flex-shrink-0">
        <p className="text-lg font-semibold leading-tight">{formatTime(item?.start)}</p>
        {duration && <p className="text-xs text-muted">{duration}</p>}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex min-w-0 items-center justify-between gap-3">
          <p className="min-w-0 flex-1 max-w-full text-sm font-semibold leading-tight truncate">
            {activity || "Activite"}
          </p>
          <div className="flex-shrink-0">
            <CenterBadge centerId={item?.center_id} size="sm" />
          </div>
        </div>
        <div className="mt-1 flex min-w-0 flex-wrap items-center gap-2 text-xs text-muted">
          {places && <span className={placesTone}>{places}</span>}
          {places && (employee || room) && <span className="opacity-70">•</span>}
          {employee && (
            <span className="flex items-center gap-1">
              <CoachIcon className="size-3 text-muted/90" />
              <span className="truncate">{employee}</span>
            </span>
          )}
          {employee && room && <span className="opacity-70">•</span>}
          {room && <span>{room}</span>}
        </div>
      </div>
    </a>
  );
}
