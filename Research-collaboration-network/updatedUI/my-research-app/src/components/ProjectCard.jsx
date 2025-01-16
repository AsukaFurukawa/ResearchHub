'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { FiLock, FiUnlock, FiDatabase, FiFileText, FiUsers } from 'react-icons/fi';

export default function ProjectCard({ project }) {
  const router = useRouter();
  
  if (!project || typeof project !== 'object') return null;

  const handleProjectClick = () => {
    if (project.id) {
      router.push(`/projects/${project.id}`);
    }
  };

  return (
    <div 
      className="bg-[#161b22] border border-[#30363d] rounded-lg p-6 hover:border-[#3fb950] transition-all cursor-pointer"
      onClick={handleProjectClick}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-[#c9d1d9] mb-2">
            {typeof project.title === 'string' ? project.title : 'Untitled Project'}
          </h3>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#238636] text-[#c9d1d9]">
              {typeof project.category === 'string' ? project.category : 'Research'}
            </span>
            {project.isPrivate ? (
              <span className="inline-flex items-center text-[#8b949e]">
                <FiLock className="w-4 h-4 mr-1" />
                <span>Private</span>
              </span>
            ) : (
              <span className="inline-flex items-center text-[#3fb950]">
                <FiUnlock className="w-4 h-4 mr-1" />
                <span>Public</span>
              </span>
            )}
          </div>
        </div>
      </div>

      <p className="text-[#8b949e] text-sm mb-4">
        {typeof project.description === 'string' ? project.description : ''}
      </p>

      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-[#8b949e]">Progress</span>
          <span className="text-[#3fb950]">
            {typeof project.progress === 'number' ? project.progress : 0}%
          </span>
        </div>
        <div className="w-full bg-[#21262d] rounded-full h-2">
          <div
            className="bg-[#3fb950] h-2 rounded-full transition-all duration-300"
            style={{ width: `${typeof project.progress === 'number' ? project.progress : 0}%` }}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {Array.isArray(project.tools) && project.tools.map((tool, index) => (
          typeof tool === 'string' ? (
            <span
              key={index}
              className="px-2 py-1 text-xs font-medium bg-[#21262d] text-[#8b949e] rounded"
            >
              {tool}
            </span>
          ) : null
        ))}
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <div className="flex -space-x-2">
            {Array.isArray(project.members) && project.members.map((member, index) => (
              typeof member === 'object' && member !== null ? (
                <div
                  key={index}
                  className="w-8 h-8 rounded-full border-2 border-[#161b22] bg-[#21262d] flex items-center justify-center"
                >
                  <img
                    src={typeof member.avatar === 'string' ? member.avatar : `https://ui-avatars.com/api/?name=${typeof member.name === 'string' ? member.name : 'User'}&background=238636&color=fff`}
                    alt={typeof member.name === 'string' ? member.name : 'User'}
                    className="w-full h-full rounded-full"
                  />
                </div>
              ) : null
            ))}
          </div>
          <div className="ml-2 flex items-center text-[#8b949e]">
            <FiUsers className="w-4 h-4 mr-1" />
            <span className="text-sm">
              {Array.isArray(project.members) ? project.members.length : 0} members
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-4 text-[#8b949e]">
          <div className="flex items-center">
            <FiDatabase className="w-4 h-4 mr-1" />
            <span className="text-sm">{typeof project.datasets === 'number' ? project.datasets : 0}</span>
          </div>
          <div className="flex items-center">
            <FiFileText className="w-4 h-4 mr-1" />
            <span className="text-sm">{typeof project.citations === 'number' ? project.citations : 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
} 