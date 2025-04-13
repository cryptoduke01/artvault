import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { UserButton } from "@civic/auth-web3/react";
import "../../styles/civic-button.css";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-black/40 backdrop-blur-md border-b border-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex-shrink-0">
            <h1 className="text-xl font-display font-bold">ARTVAULT.</h1>
          </Link>

          <div className="hidden md:flex items-center justify-center space-x-8 font-sans">
            <Link to="/marketplace" className="text-gray-300 hover:text-white transition-colors">
              Marketplace
            </Link>
            
            <Link to="/create" className="text-gray-300 hover:text-white transition-colors">
              List Artwork
            </Link>
          </div>

          <div className="hidden md:block civic-button-container">
            <UserButton
              style={{
                border: '2px solid #6b7280',
                borderRadius: '0',
                background: 'transparent',
                padding: '8px 24px',
              }}
            />
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2"
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
              <Link to="/discover" className="block px-3 py-2 text-gray-300 hover:text-white">
                Discover Art
              </Link>
              <Link to="/sell" className="block px-3 py-2 text-gray-300 hover:text-white">
                Sell Artwork
              </Link>
              <Link to="/collection" className="block px-3 py-2 text-gray-300 hover:text-white">
                My Collection
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