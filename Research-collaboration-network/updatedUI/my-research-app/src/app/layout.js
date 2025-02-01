import { Inter } from 'next/font/google';
import '@/app/globals.css';
import AppLayout from '@/components/layout/AppLayout';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Research Collaboration Network',
  description: 'A platform for research collaboration',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className} style={{ margin: 0, backgroundColor: '#0d1117' }}>
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
} 