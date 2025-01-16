import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiPlus, FiSearch, FiFilter, FiLock, FiUnlock } from 'react-icons/fi';

const ProjectCard = ({ project }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-[#1e2028] rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-gray-700"
      onClick={() => navigate(`/projects/${project.id}`)}
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-gray-100 flex items-center">
            {project.title}
            {project.visibility === 'private' ? (
              <FiLock className="ml-2 text-gray-400" />
            ) : (
              <FiUnlock className="ml-2 text-gray-400" />
            )}
          </h3>
          <span className="px-2 py-1 text-xs rounded-full bg-green-900 text-green-300">
            {project.category || 'Research'}
          </span>
        </div>

        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
          {project.description}
        </p>

        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-400 mb-1">
            <span>Progress</span>
            <span>{project.progress}%</span>
          </div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-green-500"
              initial={{ width: 0 }}
              animate={{ width: `${project.progress}%` }}
              transition={{ duration: 0.8, delay: 0.3 }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex -space-x-2">
            {project.team?.members?.slice(0, 3).map((member, index) => (
              <img
                key={member.id}
                src={member.avatar || '/default-avatar.png'}
                alt={member.name}
                className="w-8 h-8 rounded-full border-2 border-gray-800"
              />
            ))}
            {project.team?.members?.length > 3 && (
              <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs text-gray-300 border-2 border-gray-800">
                +{project.team.members.length - 3}
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-4 text-sm text-gray-400">
            <div className="flex items-center space-x-1">
              <span>{project.datasets || 0}</span>
              <span>datasets</span>
            </div>
            <div className="flex items-center space-x-1">
              <span>{project.citations?.length || 0}</span>
              <span>citations</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const EmptyState = () => (
  <div className="text-center py-12">
    <img
      src="/empty-projects.svg"
      alt="No projects"
      className="w-48 h-48 mx-auto mb-6 opacity-50"
    />
    <h3 className="text-lg font-medium text-gray-200 mb-2">
      No projects yet
    </h3>
    <p className="text-gray-400 mb-6">
      Create your first project to start collaborating with your team
    </p>
    <button
      onClick={() => {}}
      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
    >
      <FiPlus className="mr-2" />
      Create New Project
    </button>
  </div>
);

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        setProjects(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching projects:', error);
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const filteredProjects = projects
    .filter(project => {
      if (filter === 'active') return project.progress < 100;
      if (filter === 'completed') return project.progress === 100;
      return true;
    })
    .filter(project =>
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#13141a] text-gray-300">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#13141a] text-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-100">Projects</h1>
          <button
            onClick={() => navigate('/projects/new')}
            className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <FiPlus className="mr-2" />
            Create Project
          </button>
        </div>

        <div className="flex space-x-4 mb-8">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search projects..."
              className="w-full pl-10 pr-4 py-2 bg-[#1e2028] border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-100"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative">
            <select
              className="appearance-none pl-4 pr-10 py-2 bg-[#1e2028] border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-100"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Projects</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
            <FiFilter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {projects.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects; 