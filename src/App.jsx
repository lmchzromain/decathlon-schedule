export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-start justify-center px-6">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">
          Decathlon Schedule
        </p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
          React + Tailwind, pret a demarrer
        </h1>
        <p className="mt-4 text-lg text-slate-300">
          Tu peux commencer a coder dans <code className="rounded bg-slate-800 px-2 py-1">src/App.jsx</code>.
        </p>
        <button className="mt-8 rounded-full bg-emerald-400 px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/30">
          C'est parti
        </button>
      </main>
    </div>
  );
}
