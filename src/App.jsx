import { useEffect, useState } from "react";

const START_DATE = "2026-02-05";
const NUMBER_OF_DAYS = 2;
const CENTER_IDS = [5279, 5280];

function buildUrl(centerId) {
  const params = new URLSearchParams({
    startDate: START_DATE,
    numberOfDays: String(NUMBER_OF_DAYS),
    idCenter: String(centerId)
  });
  return `/heitzfit/c/5279/ws/api/planning/browse?${params.toString()}`;
}

export default function App() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchPlanning() {
      setLoading(true);
      setError("");

      try {
        const responses = await Promise.all(
          CENTER_IDS.map((centerId) =>
            fetch(buildUrl(centerId)).then((response) => {
              if (!response.ok) {
                throw new Error(`HTTP ${response.status} for center ${centerId}`);
              }
              return response.json();
            })
          )
        );

        const merged = CENTER_IDS.reduce((acc, centerId, index) => {
          acc[`center_${centerId}`] = responses[index];
          return acc;
        }, {});

        if (isMounted) {
          setData(merged);
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

    fetchPlanning();

    return () => {
      isMounted = false;
    };
  }, []);

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
              {JSON.stringify(data, null, 2)}
            </pre>
          )}
        </div>
      </main>
    </div>
  );
}
