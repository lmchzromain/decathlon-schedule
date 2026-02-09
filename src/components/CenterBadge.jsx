const CENTER_META = {
  5279: {
    label: "Lille",
    classes: "bg-primary text-white"
  },
  5280: {
    label: "Marcq",
    classes: "bg-primary text-white"
  }
};

const getCenterMeta = (centerId) =>
  CENTER_META[centerId] ?? { label: `Centre ${centerId ?? ""}`, classes: "bg-surface-alt text-muted" };

export default function CenterBadge({ centerId, isActive, size = "md" }) {
  const center = getCenterMeta(centerId);
  const sizeClasses = size === "sm" ? "px-1.5 py-0.5 text-[8px]" : "px-2.5 py-0.5 text-[9px]";

  return (
    <div
      className={`rounded-full font-semibold uppercase tracking-[0.12em] transition ${sizeClasses} ${
        isActive === false ? "bg-surface-alt text-muted" : center.classes
      }`}
    >
      {center.label}
    </div>
  );
}
