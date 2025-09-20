import React from 'react';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar - Always visible, fixed width */}
      <div className="w-64 flex-shrink-0 border-r border-gray-200">
        <Sidebar />
      </div>
      
      {/* Main content area */}
      <main className="flex-1 overflow-auto bg-gray-50">
        <div className="p-6 md:p-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;