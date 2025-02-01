'use client';

import dynamic from 'next/dynamic';

const TeamsList = dynamic(() => import('@/components/dashboard/TeamsList'), {
  loading: () => <div>Loading...</div>,
  ssr: false
});

export default function TeamsClientWrapper() {
  return <TeamsList />;
} 