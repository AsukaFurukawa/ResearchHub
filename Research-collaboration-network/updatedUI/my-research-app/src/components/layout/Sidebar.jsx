'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  FiGrid, 
  FiFolder, 
  FiUsers, 
  FiCalendar, 
  FiMessageSquare, 
  FiSettings, 
  FiShield,
  FiBeaker
} from 'react-icons/fi';
import NavItem from './NavItem';

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-[#161b22] border-r border-[#21262d] flex flex-col fixed h-full">
      {/* Logo */}
      <div className="px-4 py-5 flex items-center">
        <span className="text-[#3fb950] text-2xl mr-2">⚗️</span>
        <Link href="/dashboard" className="text-xl font-bold text-[#3fb950]">
          ResearchHub
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-0.5">
        <NavItem href="/overview" icon={FiGrid} isActive={pathname === '/overview'}>
          Overview
        </NavItem>
        <NavItem href="/projects" icon={FiFolder} isActive={pathname === '/projects'}>
          Projects
        </NavItem>
        <NavItem href="/teams" icon={FiUsers} isActive={pathname === '/teams'} hasSubmenu>
          Teams
        </NavItem>
        <NavItem href="/events" icon={FiCalendar} isActive={pathname === '/events'} hasSubmenu>
          Events
        </NavItem>
        <NavItem href="/messages" icon={FiMessageSquare} isActive={pathname === '/messages'}>
          Messages
        </NavItem>
        <NavItem href="/research" icon={FiBeaker} isActive={pathname === '/research'} hasSubmenu>
          Research
        </NavItem>
      </nav>

      {/* Bottom section */}
      <div className="px-2 py-4 mt-auto">
        <NavItem href="/settings" icon={FiSettings} isActive={pathname === '/settings'}>
          Settings
        </NavItem>
        <NavItem href="/security" icon={FiShield} isActive={pathname === '/security'}>
          Security
        </NavItem>
      </div>
    </div>
  );
}
