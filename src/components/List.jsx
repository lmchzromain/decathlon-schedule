import Item from "./Item.jsx";

const formatSectionDate = (value) => {
  if (!value) {
    return "Date inconnue";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Date inconnue";
  }

  return date.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "2-digit",
    month: "long"
  });
};

const capitalizeFirst = (value) => {
  if (!value) {
    return value;
  }

  return value.charAt(0).toUpperCase() + value.slice(1);
};

const groupByDay = (items) =>
  items.reduce((acc, item) => {
    const dayKey = item?.start ? new Date(item.start).toDateString() : "unknown";
    const nextItems = [...(acc[dayKey]?.items ?? []), item];
    return {
      ...acc,
      [dayKey]: {
        label: capitalizeFirst(formatSectionDate(item?.start)),
        items: nextItems
      }
    };
  }, {});

const buildPlaceholders = (count) =>
  Array.from({ length: count }, (_, index) => ({ id: `placeholder-${index}` }));

const PlaceholderItem = ({ label }) => (
  <div className="relative rounded-xl border border-slate-800/70 bg-slate-950/40 p-4 text-sm text-slate-200 shadow-sm shadow-slate-900/30">
    <div className="absolute right-4 top-4 h-5 w-16 animate-pulse rounded-full bg-slate-800/70" />
    <div className="flex items-start gap-4">
      <div className="w-16 flex-shrink-0 space-y-2">
        <div className="h-5 w-12 animate-pulse rounded bg-slate-800/80" />
        <div className="h-3 w-10 animate-pulse rounded bg-slate-800/60" />
      </div>
      <div className="flex-1 space-y-3">
        <div className="h-4 w-40 animate-pulse rounded bg-slate-800/80" />
        <div className="flex flex-wrap gap-2">
          {[0, 1, 2].map((key) => (
            <div key={key} className="h-3 w-20 animate-pulse rounded bg-slate-800/60" />
          ))}
        </div>
      </div>
    </div>
    {label && <p className="mt-3 text-[10px] uppercase tracking-[0.2em] text-slate-500">{label}</p>}
  </div>
);

export default function List({ items, loading, error, loadingMore, hasMore, sentinelRef }) {
  if (loading) {
    return (
      <div className="space-y-4">
        {buildPlaceholders(4).map((placeholder) => (
          <PlaceholderItem key={placeholder.id} />
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="text-rose-300">Erreur: {error}</p>;
  }

  const sections = Object.entries(groupByDay(items));
  if (sections.length === 0) {
    return <p className="text-sm text-slate-400">Aucun cours pour les filtres selectionnes.</p>;
  }

  return (
    <div className="space-y-4">
      {sections.map(([key, section]) => (
        <section key={key} className="space-y-2">
          <div className="sticky top-0 z-10 -mx-4 bg-slate-900/60 px-4 py-3 backdrop-blur">
            <p className="text-base font-semibold text-slate-100 sm:text-lg">
              {section.label}
            </p>
          </div>
          <div className="relative pl-6">
            <div className="absolute bottom-0 left-2 top-0 w-px bg-slate-800/80" />
            {section.items.map((item, index) => (
              <div key={`${item?.id ?? "item"}-${index}`} className="relative">
                <span className="absolute left-[3px] top-7 h-2.5 w-2.5 rounded-full border border-slate-600 bg-slate-900" />
                <Item item={item} />
              </div>
            ))}
          </div>
        </section>
      ))}
      {loadingMore && (
        <div className="space-y-4">
          {buildPlaceholders(2).map((placeholder) => (
            <PlaceholderItem key={placeholder.id} label="Chargement..." />
          ))}
        </div>
      )}
      {hasMore && (
        <div className="mt-2 flex items-center justify-center text-xs text-slate-400">
          {loadingMore ? "Chargement des jours suivants..." : "Scroll pour charger la suite"}
        </div>
      )}
      <div ref={sentinelRef} className="h-8" />
    </div>
  );
}
