function Stats({ total, pending, completed }) {
  return (
    <div className="grid grid-cols-3 gap-4 mb-8">
      <StatCard label="Total Items" value={total} color="text-blue-400" />
      <StatCard label="Pending" value={pending} color="text-yellow-400" />
      <StatCard label="Completed" value={completed} color="text-green-400" />
    </div>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div className="bg-slate-800/50 backdrop-blur rounded-lg p-4 border border-slate-700">
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
      <div className="text-sm text-slate-400">{label}</div>
    </div>
  );
}

export default Stats;
