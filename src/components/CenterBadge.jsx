const CENTER_META = {
  5279: {
    label: "Lille",
    classes: "bg-center-lille/20 text-center-lille/70"
  },
  5280: {
    label: "Marq",
    classes: "bg-center-marq/20 text-center-marq/70"
  }
};

const getCenterMeta = (centerId) =>
  CENTER_META[centerId] ?? { label: `Centre ${centerId ?? ""}`, classes: "bg-surface-alt text-muted" };

export default function CenterBadge({ centerId, isActive, size = "md" }) {
  const center = getCenterMeta(centerId);
  const sizeClasses = size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-3 py-1 text-xs";

  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold uppercase tracking-[0.2em] transition ${sizeClasses} ${
        isActive === false ? "bg-surface-alt text-muted" : center.classes
      }`}
    >
      {center.label}
    </span>
  );
}
