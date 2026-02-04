import { useEffect, useMemo, useState } from "react";
import Header from "./Components/Header";
import Stats from "./Components/Stats";

import AddItemForm from "./Components/AddItemForm";
import Filters from "./Components/Filters";
import QueueList from "./Components/QueueList";

import Landing from "./Components/Landing";
import Auth from "./Components/Auth";

import { getCurrentUser, logoutUser } from "./auth";

import { databases } from "./appwrite";
import { Query } from "appwrite";

import { ID } from "appwrite";
// import { getCurrentUser } from "./auth";

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;

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
  const [page, setPage] = useState("landing");
  // landing | login | signup

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

  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  /* -------- LocalStorage -------- */

  // useEffect(() => {
  //   localStorage.setItem("learningQueue", JSON.stringify(items));
  // }, [items]);

  //-------appwrite------------

  // useEffect(() => {
  //   const loadItems = async () => {
  //     const res = await databases.listDocuments(DATABASE_ID, COLLECTION_ID);

  //     setItems(res.documents);
  //   };

  //   loadItems();
  // }, []);
  useEffect(() => {
    if (!user) return;

    const loadItems = async () => {
      const res = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
        Query.equal("user_id", user.$id),
        Query.orderDesc("$createdAt"),
      ]);

      setItems(res.documents);
    };

    loadItems();
  }, [user]);

  //----------Check login

  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch {
        setUser(null);
      } finally {
        setAuthLoading(false);
      }
    };

    checkUser();
  }, []);

  //-----------log out-----------
  const handleLogout = async () => {
    await logoutUser();
    setUser(null);
  };

  /* -------- Actions -------- */

  // const addItem = async () => {
  //   if (!newUrl.trim()) return;

  //   setLoading(true);

  //   const baseItem = {
  //     id: Date.now(),
  //     url: newUrl,
  //     category: category.trim() || "Uncategorized",
  //     completed: false,
  //     addedAt: new Date().toISOString(),
  //     type: isYouTube(newUrl) ? "youtube" : "article",
  //   };

  //   let finalItem = { ...baseItem };

  //   if (baseItem.type === "youtube") {
  //     const videoId = getYouTubeId(newUrl);
  //     if (videoId) {
  //       const ytData = await fetchYouTubeData(videoId);
  //       finalItem = {
  //         ...finalItem,
  //         title: ytData?.title || "YouTube Video",
  //         thumbnail: ytData?.thumbnail,
  //         author: ytData?.author,
  //         videoId,
  //       };
  //     }
  //   } else {
  //     const webData = getFallbackWebMetadata(newUrl);
  //     finalItem.title = webData.title;
  //   }

  //   setItems((prev) => [finalItem, ...prev]);
  //   setNewUrl("");
  //   setCategory("");
  //   setLoading(false);
  // };

  // const addItem = async () => {
  //   if (!newUrl.trim()) return;
  //   setLoading(true);

  //   const baseItem = {
  //     url: newUrl,
  //     category: category || "Uncategorized",
  //     completed: false,
  //     type: isYouTube(newUrl) ? "youtube" : "article",
  //   };

  //   let finalItem = { ...baseItem };

  //   if (finalItem.type === "youtube") {
  //     const videoId = getYouTubeId(newUrl);
  //     const yt = await fetchYouTubeData(videoId);

  //     finalItem = {
  //       ...finalItem,
  //       title: yt?.title || "YouTube Video",
  //       thumbnail: yt?.thumbnail,
  //       author: yt?.author,
  //       video_id: videoId,
  //     };
  //   } else {
  //     finalItem.title = getFallbackWebMetadata(newUrl).title;
  //   }

  //   const doc = await databases.createDocument(
  //     DATABASE_ID,
  //     COLLECTION_ID,
  //     ID.unique(),
  //     finalItem,
  //   );

  //   setItems((prev) => [doc, ...prev]);
  //   setNewUrl("");
  //   setCategory("");
  //   setLoading(false);
  // };
  const addItem = async () => {
    if (!newUrl.trim()) return;
    setLoading(true);

    const finalItem = {
      url: newUrl,
      category: category || "Uncategorized",
      completed: false,
      type: isYouTube(newUrl) ? "youtube" : "article",
      user_id: user.$id, // 🔥 IMPORTANT
    };

    if (finalItem.type === "youtube") {
      const videoId = getYouTubeId(newUrl);
      const yt = await fetchYouTubeData(videoId);

      finalItem.title = yt?.title || "YouTube Video";
      finalItem.thumbnail = yt?.thumbnail;
      finalItem.author = yt?.author;
      finalItem.video_id = videoId;
    } else {
      finalItem.title = getFallbackWebMetadata(newUrl).title;
    }

    const doc = await databases.createDocument(
      DATABASE_ID,
      COLLECTION_ID,
      ID.unique(),
      finalItem,
    );

    setItems((prev) => [doc, ...prev]);
    setNewUrl("");
    setCategory("");
    setLoading(false);
  };

  // const toggleComplete = (id) => {
  //   setItems((prev) =>
  //     prev.map((item) =>
  //       item.id === id ? { ...item, completed: !item.completed } : item,
  //     ),
  //   );
  // };
  const toggleComplete = async (id, completed) => {
    // console.log("ID TYPE:", typeof id);
    // console.log("ID VALUE:", id);

    try {
      const res = await databases.updateDocument(
        DATABASE_ID,
        COLLECTION_ID,
        id,
        { completed: !completed },
        [], // permissions (empty = keep existing)
      );

      setItems((prev) =>
        prev.map((item) =>
          item.$id === id ? { ...item, completed: res.completed } : item,
        ),
      );
    } catch (err) {
      console.error("UPDATE FAILED:", err);
    }
  };
  // const toggleComplete = async (id) => {
  //   try {
  //     await databases.updateDocument(DATABASE_ID, COLLECTION_ID, id, {
  //       completed: true,
  //     });
  //     console.log("UPDATE OK");
  //   } catch (e) {
  //     console.error("UPDATE ERROR FULL:", e);
  //   }
  // };

  // const deleteItem = (id) => {
  //   setItems((prev) => prev.filter((item) => item.id !== id));
  // };
  const deleteItem = async (id) => {
    await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, id);

    setItems((prev) => prev.filter((item) => item.$id !== id));
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

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  if (!user && page === "landing") {
    return (
      <Landing
        onLogin={() => setPage("login")}
        onSignup={() => setPage("signup")}
      />
    );
  }

  if (!user && page === "login") {
    return <Auth defaultMode="login" onAuth={() => window.location.reload()} />;
  }

  if (!user && page === "signup") {
    return (
      <Auth defaultMode="signup" onAuth={() => window.location.reload()} />
    );
  }

  /* -------- UI -------- */

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <Header handleLogout={handleLogout} />

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
