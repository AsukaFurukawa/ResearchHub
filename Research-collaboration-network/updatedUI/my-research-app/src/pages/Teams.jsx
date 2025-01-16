import React, { useState, useEffect } from 'react';
import { FiPlus, FiLock } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import CreateTeamModal from '../components/CreateTeamModal';

const TeamCard = ({ team }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-xl font-semibold text-white">{team.name}</h3>
            {team.isPrivate && <FiLock className="text-gray-400" />}
          </div>
          <div className="flex items-center mt-1 space-x-2">
            <span className="text-green-400 text-sm">{team.projectCount} projects</span>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-400">Overall Progress</span>
          <span className="text-green-400">{team.progress}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div
            className="bg-green-400 rounded-full h-2 transition-all duration-300"
            style={{ width: `${team.progress}%` }}
          />
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex -space-x-2">
          {team.members.map((member, index) => (
            <div
              key={index}
              className="w-8 h-8 rounded-full bg-gray-600 border-2 border-gray-800 flex items-center justify-center text-sm font-medium text-white"
            >
              {member.charAt(0).toUpperCase()}
            </div>
          ))}
          {team.memberCount > team.members.length && (
            <div className="w-8 h-8 rounded-full bg-gray-700 border-2 border-gray-800 flex items-center justify-center text-sm font-medium text-gray-400">
              +{team.memberCount - team.members.length}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const fetchTeams = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/teams', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setTeams(data);
    } catch (error) {
      console.error('Error fetching teams:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const handleCreateTeam = (newTeam) => {
    setTeams([...teams, newTeam]);
  };

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
        <h1 className="text-2xl font-bold text-white">Your Teams</h1>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          <FiPlus className="mr-2" />
          Create New Team
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {teams.map((team) => (
          <TeamCard key={team.id} team={team} />
        ))}
      </div>

      <AnimatePresence>
        {showCreateModal && (
          <CreateTeamModal
            isOpen={showCreateModal}
            onClose={() => setShowCreateModal(false)}
            onCreateTeam={handleCreateTeam}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Teams; 