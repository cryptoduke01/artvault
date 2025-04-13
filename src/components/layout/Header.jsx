// src/components/layout/Header.jsx
import { AuthButton } from '../auth/AuthButton';
import { Navigation } from './Navigation';

export const Header = () => {
  return (
    <header className="w-full px-6 py-4 bg-black/90 backdrop-blur-sm fixed top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="text-2xl font-bold text-white">NFTMARKET.</div>
        <Navigation />
        <AuthButton />
      </div>
    </header>
  );
};