import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'VibeSphere',
  description: 'A clean, creator-focused social experience.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
