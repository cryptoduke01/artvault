// src/pages/Home.jsx
import { motion } from 'framer-motion';

export const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-purple-600">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Discover, <span className="text-purple-400">Collect</span>, And{' '}
            <span className="text-purple-400">Sell</span> Extraordinary NFTS
          </h1>
          <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto">
            Since 2023, we've guided millions of global users on their digital assets journey!
          </p>
        </motion.div>
      </div>
    </div>
  );
};