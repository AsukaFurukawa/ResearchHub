'use client';

import { Inter } from 'next/font/google';
import '@/styles/globals.css';
import Sidebar from '@/components/layout/Sidebar';
import TopNav from '@/components/layout/TopNav';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#0d1117] text-[#c9d1d9]`}>
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex flex-col flex-1">
            <TopNav />
            <main className="flex-1">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
} 