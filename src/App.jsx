import { useEffect, useMemo, useRef, useState } from "react";

const NUMBER_OF_DAYS = 7;
const CENTER_IDS = [5279, 5280];

function formatDateLocal(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function addDays(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function buildUrl(centerId, startDate) {
  const params = new URLSearchParams({
    startDate,
    numberOfDays: String(NUMBER_OF_DAYS),
    idCenter: String(centerId)
  });
  return `/heitzfit/c/5279/ws/api/planning/browse?${params.toString()}`;
}

export default function App() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const sentinelRef = useRef(null);

  const initialDate = useMemo(() => new Date(), []);

  function extractItems(response) {
    if (Array.isArray(response)) {
      return response;
    }

    const candidates = [
      response?.planning,
      response?.items,
      response?.data,
      response?.courses,
      response?.sessions,
      response?.results
    ];

    for (const candidate of candidates) {
      if (Array.isArray(candidate)) {
        return candidate;
      }
    }

    return [];
  }

  async function fetchBatch(index) {
    const startDate = formatDateLocal(addDays(initialDate, index * NUMBER_OF_DAYS));

    const responses = await Promise.all(
      CENTER_IDS.map((centerId) =>
        fetch(buildUrl(centerId, startDate)).then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP ${response.status} for center ${centerId}`);
          }
          return response.json();
        })
      )
    );

    const mergedItems = [];

    responses.forEach((response, responseIndex) => {
      const centerId = CENTER_IDS[responseIndex];
      const extracted = extractItems(response);

      extracted.forEach((item) => {
        mergedItems.push({ ...item, center_id: centerId });
      });
    });

    return mergedItems;
  }

  useEffect(() => {
    let isMounted = true;

    async function loadInitial() {
      setLoading(true);
      setError("");

      try {
        const firstBatch = await fetchBatch(0);
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
      (entries) => {
        const [entry] = entries;
        if (!entry.isIntersecting || loadingMore || loading) {
          return;
        }

        setLoadingMore(true);
        const nextIndex = pageIndex + 1;

        fetchBatch(nextIndex)
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
        <h1 className="text-2xl font-semibold sm:text-3xl">Planning des cours</h1>
        <p className="mt-2 text-sm text-slate-400">
          Donnees brutes chargees depuis deux centres.
        </p>

        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          {loading && <p className="text-slate-300">Chargement en cours...</p>}
          {!loading && error && (
            <p className="text-rose-300">Erreur: {error}</p>
          )}
          {!loading && !error && (
            <pre className="overflow-auto text-xs text-slate-200">
              {JSON.stringify(sortedItems, null, 2)}
            </pre>
          )}
          {!loading && !error && (
            <div className="mt-6 flex items-center justify-center text-xs text-slate-400">
              {loadingMore ? "Chargement des jours suivants..." : "Scroll pour charger la suite"}
            </div>
          )}
          <div ref={sentinelRef} className="h-8" />
        </div>
      </main>
    </div>
  );
}
