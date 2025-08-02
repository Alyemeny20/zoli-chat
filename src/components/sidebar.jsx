// src/components/Sidebar.jsx
import React from 'react';

const Sidebar = () => {
  return (
    <div className="w-1/4 h-screen bg-gray-800 text-white p-4">
      <h2 className="text-xl font-bold mb-4">Zoli</h2>
      <ul>
        <li className="mb-2 cursor-pointer hover:bg-gray-700 p-2 rounded">Chat 1</li>
        <li className="mb-2 cursor-pointer hover:bg-gray-700 p-2 rounded">Chat 2</li>
        <li className="mb-2 cursor-pointer hover:bg-gray-700 p-2 rounded">Chat 3</li>
      </ul>
    </div>
  );
};

export default Sidebar;
