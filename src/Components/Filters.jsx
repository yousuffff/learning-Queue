import { Search } from "lucide-react";

function Filters({
  filter,
  setFilter,
  categories,
  categoryFilter,
  setCategoryFilter,
  searchTerm,
  setSearchTerm,
}) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder="Search items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-slate-800/50 border border-slate-700 rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex gap-2">
        {["all", "pending", "completed"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg ${
              filter === f
                ? f === "completed"
                  ? "bg-green-600"
                  : f === "pending"
                  ? "bg-yellow-600"
                  : "bg-blue-600"
                : "bg-slate-700 hover:bg-slate-600"
            }`}
          >
            {f[0].toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <select
        value={categoryFilter}
        onChange={(e) => setCategoryFilter(e.target.value)}
        className="bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2"
      >
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat === "all" ? "All Categories" : cat}
          </option>
        ))}
      </select>
    </div>
  );
}

export default Filters;
