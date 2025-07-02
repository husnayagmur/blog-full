import React from 'react';
import Sidebar from './Sidebar';

const AdminLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen ">
      <div className="w-1/6">
        <Sidebar />
      </div>
      <main className="w-4/5 p-5 justify-center items-center">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
