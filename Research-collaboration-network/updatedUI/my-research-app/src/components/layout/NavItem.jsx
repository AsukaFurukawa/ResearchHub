'use client';

import React from 'react';
import Link from 'next/link';

export default function NavItem({ href, icon: Icon, children, isActive, hasSubmenu }) {
  if (!Icon) return null;
  
  return (
    <Link 
      href={href}
      className={`flex items-center px-4 py-2 text-sm ${
        isActive 
          ? 'text-[#3fb950] bg-[#0d1117]' 
          : 'text-[#8b949e] hover:text-[#3fb950]'
      } rounded-lg transition-colors group relative`}
    >
      <Icon className="w-5 h-5 mr-3" />
      <span>{children}</span>
      {hasSubmenu && (
        <svg className="w-4 h-4 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      )}
    </Link>
  );
} 