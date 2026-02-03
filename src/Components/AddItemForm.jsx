import { Plus } from "lucide-react";

function AddItemForm({
  newUrl,
  setNewUrl,
  category,
  setCategory,
  addItem,
  loading,
}) {
  return (
    <div className="bg-slate-800/50 backdrop-blur rounded-lg p-6 mb-8 border border-slate-700">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Plus className="w-5 h-5" />
        Add to Queue
      </h2>

      <div className="flex flex-col md:flex-row gap-3">
        <input
          type="text"
          placeholder="Paste YouTube or documentation URL..."
          value={newUrl}
          onChange={(e) => setNewUrl(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addItem()}
          className="flex-1 bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="text"
          placeholder="Category (e.g., React, Python)"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addItem()}
          className="md:w-48 bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={addItem}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-medium transition disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            "Adding..."
          ) : (
            <>
              <Plus className="w-5 h-5" /> Add
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default AddItemForm;
