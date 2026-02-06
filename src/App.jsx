import { useEffect, useMemo, useRef, useState } from "react";
import List from "./components/List.jsx";
import Title from "./components/Title.jsx";
import { fetchBatch } from "./utils/planning.js";

export default function App() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const sentinelRef = useRef(null);

  const initialDate = useMemo(() => new Date(), []);

  useEffect(() => {
    let isMounted = true;

    async function loadInitial() {
      setLoading(true);
      setError("");

      try {
        const firstBatch = await fetchBatch(0, initialDate);
        if (isMounted) {
          setItems(firstBatch);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Erreur inconnue");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadInitial();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!sentinelRef.current) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || loadingMore || loading) {
          return;
        }

        setLoadingMore(true);
        const nextIndex = pageIndex + 1;

        fetchBatch(nextIndex, initialDate)
          .then((nextBatch) => {
            setItems((prev) => [...prev, ...nextBatch]);
            setPageIndex(nextIndex);
          })
          .catch((err) => {
            setError(err instanceof Error ? err.message : "Erreur inconnue");
          })
          .finally(() => {
            setLoadingMore(false);
          });
      },
      { rootMargin: "200px" }
    );

    observer.observe(sentinelRef.current);

    return () => {
      observer.disconnect();
    };
  }, [loadingMore, loading, pageIndex]);

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      const aTime = a?.start ? new Date(a.start).getTime() : 0;
      const bTime = b?.start ? new Date(b.start).getTime() : 0;
      return aTime - bTime;
    });
  }, [items]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <main className="mx-auto flex min-h-screen max-w-4xl flex-col px-6 py-12">
        <Title />

        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <List
            items={sortedItems}
            loading={loading}
            error={error}
            loadingMore={loadingMore}
            sentinelRef={sentinelRef}
          />
        </div>
      </main>
    </div>
  );
}
