
import { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-black text-white font-mono">
      <Navbar />
      <main className="flex-grow px-4 py-8">{children}</main>
      <Footer />
    </div>
  );
}
