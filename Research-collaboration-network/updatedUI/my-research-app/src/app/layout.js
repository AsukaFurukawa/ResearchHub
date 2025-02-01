import { Inter } from 'next/font/google';
import '@/styles/globals.css';
import AppLayout from '@/components/layout/AppLayout';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Research Collaboration Network',
  description: 'A platform for research collaboration',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
} 