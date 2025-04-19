import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { UserButton, useUser } from "@civic/auth-web3/react";
import "../../styles/civic-button.css";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const userContext = useUser();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    try {
      await userContext.signOut();
      window.location.href = '/'; // Force refresh after sign out
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-500`}
    >
      {/* Main gradient and glass effect container */}
      <div className={`absolute inset-0 transition-opacity duration-500 ${scrolled
        ? 'opacity-100'
        : 'opacity-90'
        }`}>
        {/* Base black background */}
        <div className="absolute inset-0 bg-black" />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10" />

        {/* Additional subtle gradients */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
        </div>

        {/* Glass effect */}
        <div className="absolute inset-0 backdrop-blur-md" />
      </div>

      {/* Border bottom with gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      {/* Main content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex-shrink-0 flex items-center space-x-2">
            <h1 className="text-xl font-display font-bold text-white">
              ARTVAULT<span className="text-primary">.</span>
            </h1>
            <div className="flex items-center space-x-1 text-gray-400 text-xs">
              <span>by</span>
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
              <span>Civic</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center justify-center space-x-8 font-sans">
            <Link
              to="/marketplace"
              className="text-white/90 hover:text-white transition-colors relative group"
            >
              Marketplace
              <span className="absolute inset-x-0 -bottom-1 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
            </Link>

            <Link
              to="/create"
              className="text-white/90 hover:text-white transition-colors relative group"
            >
              List Artwork
              <span className="absolute inset-x-0 -bottom-1 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
            </Link>

            <Link
              to="/dashboard"
              className="text-white/90 hover:text-white transition-colors relative group"
            >
              Dashboard
              <span className="absolute inset-x-0 -bottom-1 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
            </Link>
          </div>

          <div className="hidden md:block civic-button-container">
            <UserButton
              style={{
                border: '2px solid #9333EA',
                borderRadius: '0',
                background: 'rgba(147, 51, 234, 0.1)',
                padding: '8px 24px',
                backdropFilter: 'blur(4px)',
              }}
            />
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-white/90 hover:text-white transition-colors"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden relative"
          >
            <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" />
            <div className="relative px-4 py-4 space-y-4">
              <Link
                to="/marketplace"
                className="block text-white/90 hover:text-white transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Marketplace
              </Link>
              <Link
                to="/create"
                className="block text-white/90 hover:text-white transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                List Artwork
              </Link>
              <Link
                to="/dashboard"
                className="block text-white/90 hover:text-white transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
              <div className="pt-4 border-t border-gray-800/50">
                <UserButton
                  style={{
                    border: '2px solid #9333EA',
                    borderRadius: '0',
                    background: 'rgba(147, 51, 234, 0.1)',
                    padding: '8px 24px',
                    width: '100%',
                  }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}