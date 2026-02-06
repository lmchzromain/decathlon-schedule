import Item from "./Item.jsx";

export default function List({ items, loading, error, loadingMore, sentinelRef }) {
  if (loading) {
    return <p className="text-slate-300">Chargement en cours...</p>;
  }

  if (error) {
    return <p className="text-rose-300">Erreur: {error}</p>;
  }

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <Item key={`${item?.id ?? "item"}-${index}`} item={item} />
      ))}
      <div className="mt-2 flex items-center justify-center text-xs text-slate-400">
        {loadingMore ? "Chargement des jours suivants..." : "Scroll pour charger la suite"}
      </div>
      <div ref={sentinelRef} className="h-8" />
    </div>
  );
}
