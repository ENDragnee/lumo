// src/app/layout.tsx
import './globals.css';
import { ReactNode } from 'react';
import 'katex/dist/katex.min.css';
import { Providers } from '@/components/providers/providers'; // Import the new client component

// Define your metadata here
export const metadata = {
  title: 'Lumo Creator',
  description: 'This is the creator studio for Lumo, a platform for creating and sharing interactive learing materials.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
            {children}
        </Providers>
      </body>
    </html>
  );
}
