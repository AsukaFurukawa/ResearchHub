'use client';

import React from 'react';
import Link from 'next/link';
import { FiGitBranch, FiStar, FiLock, FiUnlock, FiUsers } from 'react-icons/fi';

export default function ProjectCard({ project }) {
  if (!project) return null;

  return (
    <div className="p-4 border border-[#30363d] rounded-md bg-[#161b22] hover:bg-[#1c2129] transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Link 
              href={`/projects/${project.id}`}
              className="text-[#58a6ff] hover:underline font-semibold text-lg"
            >
              {project.title}
            </Link>
            <span className="px-2 py-0.5 text-xs font-medium rounded-full border border-[#30363d] text-[#8b949e]">
              {project.isPrivate ? (
                <span className="flex items-center gap-1">
                  <FiLock className="w-3 h-3" />
                  Private
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <FiUnlock className="w-3 h-3" />
                  Public
                </span>
              )}
            </span>
          </div>
          <p className="mt-1 text-sm text-[#8b949e] line-clamp-2">
            {project.description}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-4 text-sm text-[#8b949e]">
        {project.mainTechnology && (
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-[#3178c6]"></span>
            <span>{project.mainTechnology}</span>
          </div>
        )}
        <div className="flex items-center gap-1">
          <FiStar className="w-4 h-4" />
          <span>{project.stars || 0}</span>
        </div>
        <div className="flex items-center gap-1">
          <FiGitBranch className="w-4 h-4" />
          <span>{project.forks || 0}</span>
        </div>
        <div className="flex items-center gap-1">
          <FiUsers className="w-4 h-4" />
          <span>{project.collaborators?.length || 0} collaborators</span>
        </div>
        {project.updatedAt && (
          <span>Updated {new Date(project.updatedAt).toLocaleDateString()}</span>
        )}
      </div>
    </div>
  );
} 