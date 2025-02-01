'use client';

import dynamic from 'next/dynamic';

const TeamsContent = dynamic(() => import('@/components/TeamsContent'), {
  ssr: false,
  loading: () => null
});

export default function TeamsClient() {
  return <TeamsContent />;
} 