import React from 'react'

const Header = () => {

    return (
    <div className="mb-8">
      <h1 className="text-4xl font-bold mb-2 bg-linear-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
        Learning Queue
      </h1>
      <p className="text-slate-400">
        Your personal learning backlog manager
      </p>
    </div>
  );
}

export default Header