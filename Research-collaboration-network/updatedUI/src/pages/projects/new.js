import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSave, FiX } from 'react-icons/fi';

const NewProject = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Research',
    visibility: 'private',
    tools: '',
    progress: 0
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();
        navigate(`/projects/${data.id}`);
      } else {
        throw new Error('Failed to create project');
      }
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-[#13141a] text-gray-100">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Create New Project</h1>
          <div className="flex space-x-4">
            <button
              onClick={() => navigate('/projects')}
              className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-gray-400 hover:text-gray-200"
            >
              <FiX className="mr-2" />
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <FiSave className="mr-2" />
              Create Project
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Project Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-[#1e2028] border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-100"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-2 bg-[#1e2028] border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-100"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-[#1e2028] border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-100"
              >
                <option value="Research">Research</option>
                <option value="Development">Development</option>
                <option value="Analysis">Analysis</option>
                <option value="Documentation">Documentation</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Visibility
              </label>
              <select
                name="visibility"
                value={formData.visibility}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-[#1e2028] border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-100"
              >
                <option value="private">Private</option>
                <option value="public">Public</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Tools & Technologies
            </label>
            <input
              type="text"
              name="tools"
              value={formData.tools}
              onChange={handleChange}
              placeholder="e.g., Python, TensorFlow, NumPy"
              className="w-full px-4 py-2 bg-[#1e2028] border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-100"
            />
            <p className="mt-1 text-sm text-gray-400">
              Separate multiple tools with commas
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Initial Progress
            </label>
            <input
              type="number"
              name="progress"
              value={formData.progress}
              onChange={handleChange}
              min="0"
              max="100"
              className="w-full px-4 py-2 bg-[#1e2028] border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-100"
            />
            <p className="mt-1 text-sm text-gray-400">
              Set the initial progress percentage (0-100)
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewProject; 