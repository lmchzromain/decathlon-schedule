import { useEffect, useRef, useState } from "react";
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

const PlaceholderItem = () => <div className="h-16 rounded-md bg-slate-200 m-2" />;

const SectionHeader = ({ label }) => {
  const sentinelRef = useRef(null);
  const [isStuck, setIsStuck] = useState(false);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsStuck(entry.intersectionRatio === 0);
      },
      { threshold: [0, 1] }
    );

    observer.observe(sentinel);

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div ref={sentinelRef} className="h-0" />
      <div
        className={`sticky z-10 top-0 border-b border-border bg-bg/60 p-2 backdrop-blur-md ${
          isStuck ? "shadow-sm shadow-black/10" : ""
        }`}
      >
        <p className="text-base font-black text-primary">{label}</p>
      </div>
    </>
  );
};

export default function List({ items, loading, error, loadingMore, hasMore, sentinelRef }) {
  if (loading) {
    return (
      <div>
        {buildPlaceholders(20).map((placeholder) => (
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
    return <p className="text-sm text-muted text-center py-4">Aucun cours pour les filtres selectionnes.</p>;
  }

  return (
    <div className="space-y-6">
      {sections.map(([key, section]) => (
        <section key={key}>
          <SectionHeader label={section.label} />
          <div className="divide-y divide-border mt-0">
            {section.items.map((item, index) => (
              <Item key={`${item?.id ?? "item"}-${index}`} item={item} />
            ))}
          </div>
        </section>
      ))}
      {loadingMore && (
        <div>
          {buildPlaceholders(20).map((placeholder) => (
            <PlaceholderItem key={placeholder.id} />
          ))}
        </div>
      )}
      {hasMore && (
        <div className="text-xs text-muted">
          {loadingMore && "Chargement des jours suivants..."}
        </div>
      )}
      <div ref={sentinelRef} className="h-8" />
    </div>
  );
}
