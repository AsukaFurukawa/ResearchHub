// src/components/teams/TeamCard.jsx
import React, { useState } from 'react';

export default function TeamCard({ team }) {
  // Possibly a state for showing/hiding a modal with team details
  const [showDetails, setShowDetails] = useState(false);

  const handleViewDetails = () => setShowDetails(true);
  const handleCloseModal = () => setShowDetails(false);

  return (
    <div className="bg-gh-subtle border border-gh p-3 mb-2 rounded">
      <h4 className="font-semibold mb-1">{team.name}</h4>
      <p className="text-sm text-muted">Members: {team.members?.length || 0}</p>
      <button
        onClick={handleViewDetails}
        className="text-[var(--gh-accent)] underline text-sm mt-2"
      >
        View Details
      </button>

      {/* Simple modal if showDetails is true */}
      {showDetails && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-gh-subtle border border-gh p-4 rounded w-80 relative">
            <h3 className="font-bold text-lg mb-2">{team.name} Details</h3>

            {/* List members */}
            <h4 className="text-md font-semibold mb-1">Members</h4>
            <ul className="mb-3">
              {team.members?.map((member) => (
                <li key={member.id}>
                  {member.name} – {member.designation}
                </li>
              ))}
            </ul>

            {/* Possible projects */}
            <h4 className="text-md font-semibold mb-1">Projects</h4>
            <ul>
              {team.projects?.map((proj) => (
                <li key={proj.id}>
                  {proj.title}{' '}
                  <button
                    // Navigate or handle project view
                    onClick={() => { /* e.g. router.push(`/projects/${proj.id}`) */}}
                    className="underline text-[var(--gh-accent)] ml-1"
                  >
                    View Project
                  </button>
                </li>
              ))}
            </ul>

            <button
              onClick={handleCloseModal}
              className="absolute top-2 right-2 text-muted hover:text-white"
            >
              X
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
