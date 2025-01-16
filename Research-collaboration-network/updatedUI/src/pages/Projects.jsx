import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Projects() {
  const navigate = useNavigate();

  return (
    <div className="flex-1">
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Projects & Papers</h1>
          <button 
            onClick={() => navigate('/projects/new')}
            className="px-4 py-2 bg-[#238636] text-white rounded hover:bg-[#2ea043] transition-colors"
          >
            Add New Project
          </button>
        </div>

        {/* Project Card */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6 mb-4">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-semibold text-white">Neural Network Optimization</h3>
            <span className="text-[#8b949e]">Progress: 60%</span>
          </div>
          <div className="mb-4">
            <div className="w-full bg-[#21262d] rounded-full h-2">
              <div className="bg-[#3fb950] h-2 rounded-full" style={{ width: '60%' }}></div>
            </div>
          </div>
          <div className="text-[#8b949e]">
            <p>Tools: Python, TensorFlow</p>
            <p>Citations: Paper 1, Paper 2</p>
          </div>
        </div>
      </div>
    </div>
  );
} 