import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { UserButton } from "@civic/auth-web3/react";
import "../../styles/civic-button.css";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${scrolled
      ? 'bg-black/80 backdrop-blur-md border-gray-800/50'
      : 'bg-[#0A0A0A]/95 backdrop-blur-md border-gray-800/50'
      }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex-shrink-0">
            <h1 className="text-xl font-display font-bold text-white">ARTVAULT.</h1>
          </Link>

          <div className="hidden md:flex items-center justify-center space-x-8 font-sans">
            <Link to="/marketplace" className="text-white hover:text-primary transition-colors">
              Marketplace
            </Link>

            <Link to="/create" className="text-white hover:text-primary transition-colors">
              List Artwork
            </Link>

            <Link to="/dashboard" className="text-white hover:text-primary transition-colors">
              Dashboard
            </Link>
          </div>

          <div className="hidden md:block civic-button-container">
            <UserButton
              style={{
                border: '2px solid #9333EA',
                borderRadius: '0',
                background: 'transparent',
                padding: '8px 24px',
              }}
            />
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-white"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="md:hidden overflow-hidden bg-black/95 backdrop-blur-lg border-b border-gray-800/50"
          >
            <motion.div
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              exit={{ y: -20 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="px-4 py-4 space-y-4"
            >
              <Link to="/marketplace" className="block px-3 py-2 text-gray-300 hover:text-white">
                Marketplace
              </Link>
              <Link to="/create" className="block px-3 py-2 text-gray-300 hover:text-white">
                List Artwork
              </Link>
              <Link to="/dashboard" className="block px-3 py-2 text-gray-300 hover:text-white">
                Dashboard
              </Link>
              <div className="px-3 py-2 civic-button-container">
                <UserButton
                  style={{
                    border: '2px solid #6b7280',
                    borderRadius: '0',
                    background: 'transparent',
                    padding: '8px 24px',
                    width: '100%',
                  }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}