import { Trash2, Check, ExternalLink, Video, BookOpen } from "lucide-react";

function QueueItem({ item, toggleComplete, deleteItem }) {
  return (
    <div
      className={`bg-slate-800/50 rounded-lg p-4 border ${
        item.completed ? "border-green-500/30 opacity-75" : "border-slate-700"
      }`}
    >
      <div className="flex gap-4">
        {item.thumbnail ? (
          <img
            src={item.thumbnail}
            alt={item.title}
            className="w-32 h-24 object-cover rounded-lg"
          />
        ) : (
          <div className="w-32 h-24 bg-slate-700 rounded-lg flex items-center justify-center">
            {item.type === "youtube" ? <Video /> : <BookOpen />}
          </div>
        )}

        <div className="flex-1">
          <div className="flex justify-between mb-2">
            <h3 className={`font-semibold ${item.completed && "line-through"}`}>
              {item.title}
            </h3>

            <div className="flex gap-2">
              <button
                onClick={() => toggleComplete(item.id)}
                className="p-2 bg-slate-700 rounded-lg"
              >
                <Check />
              </button>

              <button
                onClick={() => deleteItem(item.id)}
                className="p-2 bg-red-600/20 rounded-lg"
              >
                <Trash2 className="text-red-400" />
              </button>
            </div>
          </div>

          <span className="text-sm text-slate-400">{item.category}</span>

          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block mt-2 text-blue-400"
          >
            Open {item.type} <ExternalLink className="inline w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}

export default QueueItem;
