import { ReactNode } from 'react';
import '../styles/globals.css'

// Metadata para o root layout
export const metadata = {
  title: 'LearnHouse',
  description: 'Learning Management System',
}

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html suppressHydrationWarning>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
