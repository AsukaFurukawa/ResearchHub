// src/components/teams/InvitationCard.jsx
import React from 'react';

export default function InvitationCard({ invitation }) {
  const { id, teamName } = invitation;

  const handleAccept = async () => {
    const token = localStorage.getItem('token');
    await fetch(`http://localhost:5000/api/teams/invitations/${id}/accept`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    // Optionally reload teams/invitations
  };

  const handleReject = async () => {
    const token = localStorage.getItem('token');
    await fetch(`http://localhost:5000/api/teams/invitations/${id}/reject`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    // Optionally reload
  };

  return (
    <div className="bg-gh-subtle border border-gh p-3 mb-2 rounded flex items-center justify-between">
      <div>
        <p className="font-semibold">Team: {teamName}</p>
        <p className="text-sm text-muted">Invitation ID: {id}</p>
      </div>
      <div>
        <button onClick={handleAccept} className="btn-accent px-2 py-1 mr-2">
          Accept
        </button>
        <button onClick={handleReject} className="bg-red-600 text-white px-2 py-1 rounded">
          Reject
        </button>
      </div>
    </div>
  );
}
