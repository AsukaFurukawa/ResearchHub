import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiSearch, FiX, FiUsers } from 'react-icons/fi';

const CreateTeamModal = ({ isOpen, onClose, onSubmit }) => {
  const [teamName, setTeamName] = useState('');
  const [description, setDescription] = useState('');
  const [members, setMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const searchUsers = async () => {
      if (searchTerm.length < 2) {
        setSearchResults([]);
        return;
      }

      try {
        const response = await fetch(`/api/users/search?q=${searchTerm}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        setSearchResults(data.filter(user => !members.find(m => m.id === user.id)));
      } catch (error) {
        console.error('Error searching users:', error);
      }
    };

    const timeoutId = setTimeout(searchUsers, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, members]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      name: teamName,
      description,
      memberIds: members.map(m => m.id)
    });
    setTeamName('');
    setDescription('');
    setMembers([]);
    onClose();
  };

  const addMember = (user) => {
    setMembers([...members, user]);
    setSearchTerm('');
    setSearchResults([]);
  };

  const removeMember = (userId) => {
    setMembers(members.filter(m => m.id !== userId));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#1e2028] rounded-lg shadow-xl w-full max-w-md p-6">
        <h2 className="text-xl font-semibold text-gray-100 mb-4">Create New Team</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Team Name
            </label>
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="w-full px-3 py-2 bg-[#13141a] border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-100"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-[#13141a] border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-100"
              rows="3"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Add Members
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search users..."
                className="w-full px-3 py-2 bg-[#13141a] border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-100"
              />
              {searchResults.length > 0 && (
                <div className="absolute w-full mt-1 bg-[#1e2028] border border-gray-700 rounded-md shadow-lg max-h-48 overflow-auto">
                  {searchResults.map(user => (
                    <div
                      key={user.id}
                      className="px-4 py-2 hover:bg-gray-700 cursor-pointer flex items-center"
                      onClick={() => addMember(user)}
                    >
                      <img
                        src={user.avatar || '/default-avatar.png'}
                        alt={user.name}
                        className="w-6 h-6 rounded-full mr-2"
                      />
                      <span className="text-gray-200">{user.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {members.length > 0 && (
            <div className="mb-4">
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Team Members
              </label>
              <div className="flex flex-wrap gap-2">
                {members.map(member => (
                  <div
                    key={member.id}
                    className="flex items-center bg-gray-700 rounded-full px-3 py-1"
                  >
                    <img
                      src={member.avatar || '/default-avatar.png'}
                      alt={member.name}
                      className="w-4 h-4 rounded-full mr-2"
                    />
                    <span className="text-sm text-gray-200">{member.name}</span>
                    <button
                      type="button"
                      onClick={() => removeMember(member.id)}
                      className="ml-2 text-gray-400 hover:text-gray-200"
                    >
                      <FiX size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Create Team
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Teams = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await fetch('/api/teams', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        setTeams(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching teams:', error);
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  const handleCreateTeam = async (teamData) => {
    try {
      const response = await fetch('/api/teams', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(teamData)
      });
      const newTeam = await response.json();
      setTeams([...teams, newTeam]);
    } catch (error) {
      console.error('Error creating team:', error);
    }
  };

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
          <h1 className="text-2xl font-bold">Research Teams</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <FiPlus className="mr-2" />
            Create Team
          </button>
        </div>

        <div className="mb-8">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search teams..."
              className="w-full pl-10 pr-4 py-2 bg-[#1e2028] border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-100"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <CreateTeamModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCreateTeam}
        />

        {teams.length === 0 ? (
          <div className="text-center py-12">
            <FiUsers className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-200">No teams yet</h3>
            <p className="mt-1 text-sm text-gray-400">Get started by creating a new team.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teams.map(team => (
              <motion.div
                key={team.id}
                whileHover={{ y: -5 }}
                className="bg-[#1e2028] rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-gray-700 p-6"
              >
                <h3 className="text-lg font-semibold text-gray-100 mb-2">{team.name}</h3>
                <p className="text-gray-400 text-sm mb-4">{team.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex -space-x-2">
                    {team.members?.map((member, index) => (
                      <img
                        key={member.id}
                        src={member.avatar || '/default-avatar.png'}
                        alt={member.name}
                        className="w-8 h-8 rounded-full border-2 border-gray-800"
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-400">
                    {team.members?.length} members
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Teams; 