import React from 'react';
import Sidebar from './Sidebar';

const AdminLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen max-w-7xl">
      <div className="w-1/5">
        <Sidebar />
      </div>
      <main className="w-4/5 p-5">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
