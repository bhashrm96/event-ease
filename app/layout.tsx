// app/layout.tsx

import '../styles/globals.css'; // if you're using global styles
import { ReactNode } from 'react';
import Navbar from '@/components/NavBar';
import SessionProviderWrapper from './providers/SessionProviderWrapper';
import { Toaster } from 'sonner';

export const metadata = {
  title: 'EventEase',
  description: 'Manage and attend events effortlessly',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SessionProviderWrapper>
        <Navbar />
                <Toaster position="top-center" richColors />
        <main>{children}</main>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
