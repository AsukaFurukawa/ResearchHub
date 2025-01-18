'use client';

import React, { useState, useEffect } from 'react';
import { FiPlus, FiSearch, FiFilter, FiLock, FiUnlock, FiUsers } from 'react-icons/fi';
import Link from 'next/link';

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/projects', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#3fb950]"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-[#0d1117]">
      {/* Header */}
      <div className="border-b border-[#21262d] bg-[#0d1117]">
        <div className="px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-semibold text-[#c9d1d9]">All Projects</h1>
              <button className="px-3 py-1.5 text-sm font-medium text-[#c9d1d9] bg-[#238636] hover:bg-[#2ea043] rounded-md transition-colors flex items-center gap-2">
                <FiPlus className="w-4 h-4" />
                New Project
              </button>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8b949e]" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  className="w-64 px-10 py-1.5 bg-[#0d1117] border border-[#30363d] rounded-md text-[#c9d1d9] placeholder-[#8b949e] focus:outline-none focus:border-[#3fb950] focus:ring-1 focus:ring-[#3fb950]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button className="px-3 py-1.5 text-sm text-[#c9d1d9] border border-[#30363d] rounded-md hover:border-[#8b949e] transition-colors flex items-center gap-2">
                <FiFilter className="w-4 h-4" />
                Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Project List */}
      <div className="px-8 py-6">
        {projects.length === 0 ? (
          <div className="text-center py-16 bg-[#161b22] rounded-lg border border-[#30363d]">
            <h3 className="text-xl font-medium text-[#c9d1d9] mb-2">No projects found</h3>
            <p className="text-[#8b949e] mb-6">Get started by creating a new project</p>
            <button className="px-4 py-2 text-sm font-medium text-[#c9d1d9] bg-[#238636] hover:bg-[#2ea043] rounded-md transition-colors flex items-center gap-2 mx-auto">
              <FiPlus className="w-4 h-4" />
              New Project
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {projects.map((project) => (
              <div
                key={project.id}
                className="flex items-center justify-between px-4 py-3 bg-[#0d1117] hover:bg-[#161b22] border border-[#30363d] rounded-md transition-colors group"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="text-[#8b949e]">
                    {project.isPrivate ? <FiLock className="w-4 h-4" /> : <FiUnlock className="w-4 h-4" />}
                  </div>
                  <div>
                    <Link
                      href={`/projects/${project.id}`}
                      className="text-[#58a6ff] hover:underline font-medium"
                    >
                      {project.title}
                    </Link>
                    <p className="text-sm text-[#8b949e] mt-0.5">{project.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-sm text-[#8b949e]">
                  {project.mainTechnology && (
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#3fb950]"></span>
                      <span>{project.mainTechnology}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5">
                    <FiUsers className="w-4 h-4" />
                    <span>{project.collaborators?.length || 0}</span>
                  </div>
                  <span>Updated {new Date(project.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 