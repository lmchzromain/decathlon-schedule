export default function Item({ item }) {
  return (
    <pre className="overflow-auto rounded-xl border border-slate-800 bg-slate-950/40 p-3 text-xs text-slate-200">
      {JSON.stringify(item, null, 2)}
    </pre>
  );
}
