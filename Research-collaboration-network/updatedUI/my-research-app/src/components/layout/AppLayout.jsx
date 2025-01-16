'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiHome, FiUsers, FiCalendar, FiMessageSquare, FiFolder, FiSettings, FiShield } from 'react-icons/fi';

function NavItem({ href, icon: Icon, children, isActive }) {
  return (
    <Link 
      href={href}
      className={`flex items-center px-4 py-2 text-sm ${
        isActive 
          ? 'text-white bg-[#21262d]' 
          : 'text-[#8b949e] hover:text-white'
      } rounded-lg transition-colors`}
    >
      <Icon className="w-5 h-5 mr-3" />
      {children}
    </Link>
  );
}

export default function AppLayout({ children }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-gh">
      {/* Sidebar */}
      <div className="w-64 bg-gh border-r border-gh-border flex flex-col fixed h-full">
        {/* Logo */}
        <div className="px-4 py-5">
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold text-[#3fb950]">ResearchHub</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-1">
          <NavItem href="/overview" icon={FiHome} isActive={pathname === '/overview'}>
            Overview
          </NavItem>
          <NavItem href="/projects" icon={FiFolder} isActive={pathname === '/projects'}>
            Projects
          </NavItem>
          <NavItem href="/teams" icon={FiUsers} isActive={pathname === '/teams'}>
            Teams
          </NavItem>
          <NavItem href="/events" icon={FiCalendar} isActive={pathname === '/events'}>
            Events
          </NavItem>
          <NavItem href="/messages" icon={FiMessageSquare} isActive={pathname === '/messages'}>
            Messages
          </NavItem>
        </nav>

        {/* Bottom section */}
        <div className="px-2 py-4 border-t border-gh-border">
          <NavItem href="/settings" icon={FiSettings} isActive={pathname === '/settings'}>
            Settings
          </NavItem>
          <NavItem href="/security" icon={FiShield} isActive={pathname === '/security'}>
            Security
          </NavItem>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 ml-64">
        {/* Top Navigation */}
        <div className="h-16 bg-gh border-b border-gh-border px-4 flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gh">Research Collaboration Network</h1>
          </div>
          <div className="flex items-center space-x-4">
            {/* Add notification bell, user avatar, etc. here */}
            <div className="w-8 h-8 rounded-full bg-gh-subtle flex items-center justify-center">
              <span className="text-white">U</span>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
} 