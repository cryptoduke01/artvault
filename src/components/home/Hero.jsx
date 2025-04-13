import { motion } from 'framer-motion';
import Button from '../ui/Button';
import ArtworkCard from '../ui/ArtworkCard';
// import HeroImage from '../../assets/hero.jpg';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function Hero() {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Generate random particles
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 40 + 20,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 5,
      opacity: Math.random() * 0.15 + 0.05 // Very transparent particles
    }));
    setParticles(newParticles);
  }, []);

  const featuredArtwork = {
    title: "Cyberpunk Girl",
    price: "1.7",
    image: "/hero.jpg"
  };

  return (
    <div className="relative min-h-screen bg-[#0A0A0A] overflow-hidden">
      {/* Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-lg bg-primary/10"
            style={{
              width: particle.size,
              height: particle.size,
              opacity: particle.opacity,
              left: `${particle.x}%`,
              top: `${particle.y}%`,
            }}
            animate={{
              y: [0, -20, 0],
              x: [0, 10, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: "linear"
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 md:pt-24 pb-16">
        <div className="grid lg:grid-cols-[1fr,500px] gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="space-y-8 z-10"
          >
            <motion.h1
              className="font-display text-[3.5rem] md:text-[4.5rem] lg:text-[5rem] font-bold leading-[1.1] tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <span className="text-gray-200">Discover,</span><br />
              <span className="text-white">Share,</span>{' '}
              <span className="text-white">And</span>{' '}
              <motion.span
                className="text-primary"
                animate={{
                  color: ['#8B5CF6', '#A78BFA', '#8B5CF6'],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Sell
              </motion.span><br />
              <span className="text-white">Digital Art</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-gray-400 text-lg max-w-xl font-sans"
            >
              A secure marketplace for digital artists to showcase and sell their
              creations directly to art enthusiasts. Powered by secure
              authentication and hassle-free crypto payments.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex gap-6"
            >
              <button className="px-8 py-3 border-2 border-primary bg-transparent text-white hover:bg-primary/10 transition-all">
                Get Started
              </button>
              <button className="px-8 py-3 border-2 border-white/20 bg-transparent text-white hover:bg-white/5 transition-all">
                Learn More
              </button>
            </motion.div>

            <div className="grid grid-cols-3 gap-8 pt-12">
              <div>
                <h3 className="text-4xl font-bold font-mono">2K+</h3>
                <p className="text-gray-400 mt-1">Active Artists</p>
              </div>
              <div>
                <h3 className="text-4xl font-bold font-mono">10K+</h3>
                <p className="text-gray-400 mt-1">Artworks Sold</p>
              </div>
              <div>
                <h3 className="text-4xl font-bold font-mono">$2M+</h3>
                <p className="text-gray-400 mt-1">Creator Earnings</p>
              </div>
            </div>
          </motion.div>

          <div className="relative w-full h-[600px] -mt-8">
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              className="absolute top-16 right-0 w-full"
            >
              <div className="relative">
                <motion.div
                  animate={{
                    rotate: [8, 10, 8],
                    y: [10, 0, 10]
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute -top-4 right-8 w-full max-w-[400px] opacity-20"
                >
                  <ArtworkCard artwork={featuredArtwork} />
                </motion.div>

                <motion.div
                  animate={{
                    rotate: [4, 6, 4],
                    y: [5, -5, 5]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute -top-2 right-4 w-full max-w-[400px] opacity-40"
                >
                  <ArtworkCard artwork={featuredArtwork} />
                </motion.div>

                <motion.div
                  animate={{
                    y: [0, -10, 0],
                    rotate: [0, 2, 0]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="relative z-10 w-full max-w-[400px]"
                >
                  <ArtworkCard
                    artwork={featuredArtwork}
                    className="transform hover:scale-105 transition-transform duration-300"
                  />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-transparent to-blue-900/20 pointer-events-none" />
    </div>
  );
}