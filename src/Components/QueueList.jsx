import QueueItem from "./QueueItem";

function QueueList({ items, toggleComplete, deleteItem }) {
  if (!items.length) {
    return (
      <div className="bg-slate-800/30 rounded-lg p-12 text-center border border-dashed border-slate-700">
        No items found. Add your first learning resource!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <QueueItem
          key={item.$id}
          item={item}
          toggleComplete={toggleComplete}
          deleteItem={deleteItem}
        />
      ))}
    </div>
  );
}

export default QueueList;
