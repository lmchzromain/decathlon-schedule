import { useEffect, useMemo, useRef, useState } from "react";
import Filters from "./components/Filters.jsx";
import List from "./components/List.jsx";
import Footer from "./components/Footer.jsx";
import Title from "./components/Title.jsx";
import { fetchBatch } from "./utils/planning.js";

const ALL_CENTERS = [5279, 5280];

const parseCenters = (value) => {
  if (value === null) {
    return ALL_CENTERS;
  }

  if (value.trim() === "") {
    return [];
  }

  return value
    .split(",")
    .map((entry) => Number(entry))
    .filter((entry) => !Number.isNaN(entry))
    .filter((entry, index, array) => array.indexOf(entry) === index)
    .filter((entry) => ALL_CENTERS.includes(entry));
};

const getInitialFilters = () => {
  const params = new URLSearchParams(window.location.search);
  const centersParam = params.get("centers");
  const searchParam = params.get("q");

  return {
    selectedCenters: parseCenters(centersParam),
    searchTerm: searchParam ?? ""
  };
};

export default function App() {
  const initialFilters = useMemo(() => getInitialFilters(), []);
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const sentinelRef = useRef(null);
  const [selectedCenters, setSelectedCenters] = useState(initialFilters.selectedCenters);
  const [searchTerm, setSearchTerm] = useState(initialFilters.searchTerm);

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
          setHasMore(firstBatch.length > 0);
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
    const params = new URLSearchParams(window.location.search);
    if (selectedCenters.length > 0) {
      params.set("centers", selectedCenters.join(","));
    } else {
      params.set("centers", "");
    }

    if (searchTerm.trim()) {
      params.set("q", searchTerm.trim());
    } else {
      params.delete("q");
    }

    const nextUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState(null, "", nextUrl);
  }, [selectedCenters, searchTerm]);


  useEffect(() => {
    if (!sentinelRef.current) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || loadingMore || loading || !hasMore) {
          return;
        }

        setLoadingMore(true);
        const nextIndex = pageIndex + 1;

        fetchBatch(nextIndex, initialDate)
          .then((nextBatch) => {
            setItems((prev) => [...prev, ...nextBatch]);
            setPageIndex(nextIndex);
            setHasMore(nextBatch.length > 0);
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
  }, [loadingMore, loading, pageIndex, hasMore]);

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      const aTime = a?.start ? new Date(a.start).getTime() : 0;
      const bTime = b?.start ? new Date(b.start).getTime() : 0;
      return aTime - bTime;
    });
  }, [items]);

  const filteredItems = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const cutoff = Date.now() - 90 * 60 * 1000;
    return sortedItems
      .filter((item) => {
        if (!item?.start) {
          return false;
        }
        const startTime = new Date(item.start).getTime();
        return Number.isNaN(startTime) ? false : startTime >= cutoff;
      })
      .filter((item) => selectedCenters.includes(item?.center_id))
      .filter((item) => {
        if (!normalizedSearch) {
          return true;
        }
        const activity = item?.activity ? String(item.activity).toLowerCase() : "";
        const coach = item?.employee ? String(item.employee).toLowerCase() : "";
        return activity.includes(normalizedSearch) || coach.includes(normalizedSearch);
      });
  }, [sortedItems, selectedCenters, searchTerm]);

  const toggleCenter = (centerId) => {
    setSelectedCenters((prev) =>
      prev.includes(centerId) ? prev.filter((id) => id !== centerId) : [...prev, centerId]
    );
  };

  return (
    <div className="min-h-screen bg-bg text-text">
      <main className="mx-auto flex min-h-screen max-w-4xl flex-col px-0 py-6 pb-28 ">
        <Title />

        <div className="mt-8">
          <List
            items={filteredItems}
            loading={loading}
            error={error}
            loadingMore={loadingMore}
            hasMore={hasMore}
            sentinelRef={sentinelRef}
          />
        </div>
        <Footer />
      </main>
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-bg/40 px-3 py-3 backdrop-blur-md sm:px-6">
        <div className="mx-auto w-full max-w-4xl">
          <Filters
            selectedCenters={selectedCenters}
            searchTerm={searchTerm}
            onToggleCenter={toggleCenter}
            onSearch={setSearchTerm}
          />
        </div>
      </div>
    </div>
  );
}
