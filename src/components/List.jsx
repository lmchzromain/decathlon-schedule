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

export default function List({ items, loading, error, loadingMore, sentinelRef }) {
  if (loading) {
    return <p className="text-slate-300">Chargement en cours...</p>;
  }

  if (error) {
    return <p className="text-rose-300">Erreur: {error}</p>;
  }

  const sections = Object.entries(groupByDay(items));

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
      <div className="mt-2 flex items-center justify-center text-xs text-slate-400">
        {loadingMore ? "Chargement des jours suivants..." : "Scroll pour charger la suite"}
      </div>
      <div ref={sentinelRef} className="h-8" />
    </div>
  );
}
