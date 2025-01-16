'use client';

import React, { useState, useEffect } from 'react';
import { FiX, FiPlus, FiTrash2 } from 'react-icons/fi';

export default function NewProjectModal({ isOpen, onClose, onSubmit }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Research');
  const [isPrivate, setIsPrivate] = useState(false);
  const [tools, setTools] = useState(['']);
  const [members, setMembers] = useState(['']);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      title,
      description,
      category,
      isPrivate,
      tools: tools.filter(Boolean),
      members: members.filter(Boolean).map(member => ({ name: member })),
      progress: 0,
      datasets: 0,
      citations: 0
    });
    resetForm();
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCategory('Research');
    setIsPrivate(false);
    setTools(['']);
    setMembers(['']);
  };

  const handleToolChange = (index, value) => {
    const newTools = [...tools];
    newTools[index] = value;
    setTools(newTools);
  };

  const addTool = () => {
    setTools([...tools, '']);
  };

  const removeTool = (index) => {
    const newTools = tools.filter((_, i) => i !== index);
    setTools(newTools.length ? newTools : ['']);
  };

  const handleMemberChange = (index, value) => {
    const newMembers = [...members];
    newMembers[index] = value;
    setMembers(newMembers);
  };

  const addMember = () => {
    setMembers([...members, '']);
  };

  const removeMember = (index) => {
    const newMembers = members.filter((_, i) => i !== index);
    setMembers(newMembers.length ? newMembers : ['']);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-[#161b22] rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-[#c9d1d9]">Create New Project</h2>
            <button
              onClick={onClose}
              className="text-[#8b949e] hover:text-[#c9d1d9] transition-colors"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-[#c9d1d9] mb-2">
                Project Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 bg-[#0d1117] border border-[#30363d] rounded-lg text-[#c9d1d9] placeholder-[#8b949e] focus:outline-none focus:border-[#3fb950]"
                placeholder="Enter project title"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-[#c9d1d9] mb-2">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 bg-[#0d1117] border border-[#30363d] rounded-lg text-[#c9d1d9] placeholder-[#8b949e] focus:outline-none focus:border-[#3fb950] min-h-[100px]"
                placeholder="Enter project description"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-[#c9d1d9] mb-2">
                  Category
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2 bg-[#0d1117] border border-[#30363d] rounded-lg text-[#c9d1d9] focus:outline-none focus:border-[#3fb950]"
                >
                  <option value="Research">Research</option>
                  <option value="Development">Development</option>
                  <option value="Analysis">Analysis</option>
                  <option value="Documentation">Documentation</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#c9d1d9] mb-2">
                  Visibility
                </label>
                <div className="flex items-center space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      checked={!isPrivate}
                      onChange={() => setIsPrivate(false)}
                      className="form-radio text-[#3fb950]"
                    />
                    <span className="ml-2 text-[#c9d1d9]">Public</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      checked={isPrivate}
                      onChange={() => setIsPrivate(true)}
                      className="form-radio text-[#3fb950]"
                    />
                    <span className="ml-2 text-[#c9d1d9]">Private</span>
                  </label>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#c9d1d9] mb-2">
                Tech Stack
              </label>
              <div className="space-y-2">
                {tools.map((tool, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={tool}
                      onChange={(e) => handleToolChange(index, e.target.value)}
                      className="flex-1 px-4 py-2 bg-[#0d1117] border border-[#30363d] rounded-lg text-[#c9d1d9] placeholder-[#8b949e] focus:outline-none focus:border-[#3fb950]"
                      placeholder="Enter technology"
                    />
                    <button
                      type="button"
                      onClick={() => removeTool(index)}
                      className="p-2 text-[#8b949e] hover:text-[#f85149] transition-colors"
                    >
                      <FiTrash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addTool}
                  className="flex items-center text-sm text-[#3fb950] hover:text-[#2ea043] transition-colors"
                >
                  <FiPlus className="w-4 h-4 mr-1" />
                  Add Technology
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#c9d1d9] mb-2">
                Team Members
              </label>
              <div className="space-y-2">
                {members.map((member, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={member}
                      onChange={(e) => handleMemberChange(index, e.target.value)}
                      className="flex-1 px-4 py-2 bg-[#0d1117] border border-[#30363d] rounded-lg text-[#c9d1d9] placeholder-[#8b949e] focus:outline-none focus:border-[#3fb950]"
                      placeholder="Enter member name"
                    />
                    <button
                      type="button"
                      onClick={() => removeMember(index)}
                      className="p-2 text-[#8b949e] hover:text-[#f85149] transition-colors"
                    >
                      <FiTrash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addMember}
                  className="flex items-center text-sm text-[#3fb950] hover:text-[#2ea043] transition-colors"
                >
                  <FiPlus className="w-4 h-4 mr-1" />
                  Add Member
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-[#c9d1d9] hover:text-white transition-colors mr-4"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#238636] text-white rounded-lg hover:bg-[#2ea043] transition-colors"
              >
                Create Project
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 