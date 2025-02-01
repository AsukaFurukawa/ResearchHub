'use client';

import { AuthProvider } from '@/context/AuthContext';
import Sidebar from './Sidebar';
import TopNav from './TopNav';

export default function AppLayout({ children }) {
  return (
    <AuthProvider>
      <div className="flex min-h-screen bg-[#0d1117] text-[#c9d1d9]">
        <Sidebar />
        <div className="flex flex-col flex-1">
          <TopNav />
          <main className="flex-1 p-4">
            {children}
          </main>
        </div>
      </div>
    </AuthProvider>
  );
} 