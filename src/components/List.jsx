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

const groupByDay = (items) =>
  items.reduce((acc, item) => {
    const dayKey = item?.start ? new Date(item.start).toDateString() : "unknown";
    const nextItems = [...(acc[dayKey]?.items ?? []), item];
    return {
      ...acc,
      [dayKey]: {
        label: formatSectionDate(item?.start),
        items: nextItems
      }
    };
  }, {});

const buildPlaceholders = (count) =>
  Array.from({ length: count }, (_, index) => ({ id: `placeholder-${index}` }));

const PlaceholderItem = ({ label }) => (
  <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4 text-sm text-slate-200">
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div className="space-y-2">
        <div className="h-4 w-36 animate-pulse rounded bg-slate-800/80" />
        <div className="h-3 w-24 animate-pulse rounded bg-slate-800/60" />
      </div>
      <div className="h-6 w-16 animate-pulse rounded-full bg-slate-800/70" />
    </div>
    <div className="mt-4 grid gap-3 sm:grid-cols-3">
      {[0, 1, 2].map((key) => (
        <div key={key} className="space-y-2">
          <div className="h-2 w-12 animate-pulse rounded bg-slate-800/60" />
          <div className="h-3 w-24 animate-pulse rounded bg-slate-800/80" />
        </div>
      ))}
    </div>
    {label && (
      <p className="mt-3 text-[10px] uppercase tracking-[0.2em] text-slate-500">{label}</p>
    )}
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
        <section key={key} className="space-y-3">
          <div className="sticky top-0 z-10 -mx-4 bg-slate-900/95 px-4 py-2 backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">
              {section.label}
            </p>
          </div>
          {section.items.map((item, index) => (
            <Item key={`${item?.id ?? "item"}-${index}`} item={item} />
          ))}
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
