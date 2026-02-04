import React from "react";
import AnimatedCursor from "./AnimatedCursor";

const Header = ({ handleLogout }) => {
  return (
    <div className="mb-8 flex items-start justify-between gap-4">
      <AnimatedCursor />
      <div>
        <h1 className="text-4xl font-bold mb-2 bg-linear-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Learning Queue
        </h1>
        <p className="text-slate-400">Your personal learning backlog manager</p>
      </div>

      <button
        onClick={handleLogout}
        className="text-sm text-red-400 hover:bg-red-500 cursor-pointer hover:text-white border border-red-400/30 px-3 py-1 rounded-md"
      >
        Logout
      </button>
    </div>
  );
};

export default Header;
