import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';

export default function ProjectDetails() {
  const router = useRouter();
  const { projectId } = router.query;
  const [project, setProject] = useState(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!projectId) return;
    const token = localStorage.getItem('token');
    fetch(`http://localhost:5000/api/projects/${projectId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setProject(data);
        setProgress(data.progress || 0);
      })
      .catch(console.error);
  }, [projectId]);

  const handleProgressChange = async () => {
    const token = localStorage.getItem('token');
    try {
      await fetch(`http://localhost:5000/api/projects/${projectId}/progress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ progress }),
      });
    } catch (err) {
      console.error(err);
    }
  };

  if (!project) return <div>Loading...</div>;

  return (
    <div className="p-4 text-gh">
      <h1 className="text-2xl font-bold mb-4">{project.title}</h1>
      <p className="mb-4">{project.description}</p>

      <div className="mb-6">
        <motion.div
          className="w-full bg-gh-border rounded h-3"
          initial={{ width: 0 }}
          animate={{ width: `${project.progress}%` }}
          style={{ backgroundColor: 'var(--gh-accent)' }}
        />
        <span>{project.progress}%</span>
      </div>

      <label>
        Update Progress:
        <input
          type="number"
          value={progress}
          onChange={(e) => setProgress(e.target.value)}
          className="w-20 ml-2 p-2 border border-gh rounded"
        />
      </label>
      <button
        onClick={handleProgressChange}
        className="btn-accent px-3 py-1 rounded ml-4"
      >
        Update
      </button>
    </div>
  );
}
