import React, { useState, useEffect } from 'react';
import { FiPlus, FiLock, FiUnlock, FiDatabase, FiFileText } from 'react-icons/fi';
import { motion } from 'framer-motion';

const ProjectCard = ({ project }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-white mb-1">{project.title}</h3>
          <span className="inline-block bg-green-400/10 text-green-400 text-sm px-3 py-1 rounded-full">
            {project.category}
          </span>
        </div>
        {project.isPrivate ? (
          <FiLock className="text-gray-400" />
        ) : (
          <FiUnlock className="text-gray-400" />
        )}
      </div>

      <p className="text-gray-400 text-sm mb-4">{project.description}</p>

      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-400">Progress</span>
          <span className="text-green-400">{project.progress}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div
            className="bg-green-400 rounded-full h-2 transition-all duration-300"
            style={{ width: `${project.progress}%` }}
          />
        </div>
      </div>

      <div className="flex items-center space-x-2 mb-4">
        {project.tools.map((tool, index) => (
          <span
            key={index}
            className="px-2 py-1 bg-gray-700 rounded text-gray-300 text-sm"
          >
            {tool}
          </span>
        ))}
      </div>

      <div className="flex justify-between items-center">
        <div className="flex -space-x-2">
          {project.members.map((member, index) => (
            <div
              key={index}
              className="w-8 h-8 rounded-full bg-gray-600 border-2 border-gray-800 flex items-center justify-center text-sm font-medium text-white"
            >
              {member.charAt(0).toUpperCase()}
            </div>
          ))}
        </div>
        
        <div className="flex items-center space-x-4 text-gray-400">
          <div className="flex items-center">
            <FiDatabase className="mr-1" />
            <span className="text-sm">{project.datasets}</span>
          </div>
          <div className="flex items-center">
            <FiFileText className="mr-1" />
            <span className="text-sm">{project.citations}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch projects from API
    const fetchProjects = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/projects', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-white">Projects & Papers</h1>
        <button className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
          <FiPlus className="mr-2" />
          Add New Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
};

export default Projects; 