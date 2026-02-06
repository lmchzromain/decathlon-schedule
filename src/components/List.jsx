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

const PlaceholderItem = () => (
  <div className="h-16 rounded-md bg-slate-100" />
);

export default function List({ items, loading, error, loadingMore, hasMore, sentinelRef }) {
  if (loading) {
    return (
      <div className="space-y-3">
        {buildPlaceholders(4).map((placeholder) => (
          <PlaceholderItem key={placeholder.id} />
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="text-rose-600">Erreur: {error}</p>;
  }

  const sections = Object.entries(groupByDay(items));
  if (sections.length === 0) {
    return <p className="text-sm text-slate-500">Aucun cours pour les filtres selectionnes.</p>;
  }

  return (
    <div className="space-y-6">
      {sections.map(([key, section]) => (
        <section key={key} className="space-y-3">
          <div className="sticky top-0 bg-white py-2">
            <p className="text-base font-semibold text-slate-900">{section.label}</p>
          </div>
          <div className="divide-y divide-slate-200">
            {section.items.map((item, index) => (
              <Item key={`${item?.id ?? "item"}-${index}`} item={item} />
            ))}
          </div>
        </section>
      ))}
      {loadingMore && (
        <div className="space-y-3">
          {buildPlaceholders(2).map((placeholder) => (
            <PlaceholderItem key={placeholder.id} />
          ))}
        </div>
      )}
      {hasMore && (
        <div className="text-xs text-slate-500">
          {loadingMore ? "Chargement des jours suivants..." : "Scroll pour charger la suite"}
        </div>
      )}
      <div ref={sentinelRef} className="h-8" />
    </div>
  );
}
