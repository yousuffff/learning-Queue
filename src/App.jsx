import { useEffect, useMemo, useState } from "react";
import Header from "./Components/Header";
import Stats from "./Components/Stats";

import AddItemForm from "./Components/AddItemForm";
import Filters from "./Components/Filters";
import QueueList from "./Components/QueueList";

/* ================== Helpers ================== */

// Extract YouTube video ID
const getYouTubeId = (url) => {
  const regExp =
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]{11}).*/;
  const match = url.match(regExp);
  return match ? match[2] : null;
};

// Check if URL is YouTube
const isYouTube = (url) => /youtube\.com|youtu\.be|m\.youtube\.com/.test(url);

// Fetch YouTube metadata (oEmbed)
const fetchYouTubeData = async (videoId) => {
  try {
    const res = await fetch(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`,
    );
    const data = await res.json();
    return {
      title: data.title,
      thumbnail: data.thumbnail_url,
      author: data.author_name,
    };
  } catch {
    return null;
  }
};

// Fallback metadata for articles
const getFallbackWebMetadata = (url) => {
  try {
    const domain = new URL(url).hostname.replace("www.", "");
    return { title: domain };
  } catch {
    return { title: "Web Article" };
  }
};

/* ================== App ================== */

function App() {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem("learningQueue");
    return saved ? JSON.parse(saved) : [];
  });
  const [newUrl, setNewUrl] = useState("");
  const [category, setCategory] = useState("");
  const [filter, setFilter] = useState("all"); // all | pending | completed
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  /* -------- LocalStorage -------- */

  useEffect(() => {
    localStorage.setItem("learningQueue", JSON.stringify(items));
  }, [items]);

  /* -------- Actions -------- */

  const addItem = async () => {
    if (!newUrl.trim()) return;

    setLoading(true);

    const baseItem = {
      id: Date.now(),
      url: newUrl,
      category: category.trim() || "Uncategorized",
      completed: false,
      addedAt: new Date().toISOString(),
      type: isYouTube(newUrl) ? "youtube" : "article",
    };

    let finalItem = { ...baseItem };

    if (baseItem.type === "youtube") {
      const videoId = getYouTubeId(newUrl);
      if (videoId) {
        const ytData = await fetchYouTubeData(videoId);
        finalItem = {
          ...finalItem,
          title: ytData?.title || "YouTube Video",
          thumbnail: ytData?.thumbnail,
          author: ytData?.author,
          videoId,
        };
      }
    } else {
      const webData = getFallbackWebMetadata(newUrl);
      finalItem.title = webData.title;
    }

    setItems((prev) => [finalItem, ...prev]);
    setNewUrl("");
    setCategory("");
    setLoading(false);
  };

  const toggleComplete = (id) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item,
      ),
    );
  };

  const deleteItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  /* -------- Derived Data -------- */

  const categories = useMemo(
    () => ["all", ...new Set(items.map((i) => i.category))],
    [items],
  );

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const statusMatch =
        filter === "all" ||
        (filter === "pending" && !item.completed) ||
        (filter === "completed" && item.completed);

      const categoryMatch =
        categoryFilter === "all" || item.category === categoryFilter;

      const searchMatch =
        (item.title ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.url.toLowerCase().includes(searchTerm.toLowerCase());

      return statusMatch && categoryMatch && searchMatch;
    });
  }, [items, filter, categoryFilter, searchTerm]);

  const totalItems = items.length;
  const completedItems = items.filter((i) => i.completed).length;
  const pendingItems = totalItems - completedItems;

  /* -------- UI -------- */

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <Header />

        <Stats
          total={totalItems}
          pending={pendingItems}
          completed={completedItems}
        />

        <AddItemForm
          newUrl={newUrl}
          setNewUrl={setNewUrl}
          category={category}
          setCategory={setCategory}
          addItem={addItem}
          loading={loading}
        />

        <Filters
          filter={filter}
          setFilter={setFilter}
          categories={categories}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />

        <QueueList
          items={filteredItems}
          toggleComplete={toggleComplete}
          deleteItem={deleteItem}
        />

        {items.length > 0 && (
          <div className="mt-8 text-center text-slate-500 text-sm">
            💡 Tip: Your queue is saved automatically in your browser
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
