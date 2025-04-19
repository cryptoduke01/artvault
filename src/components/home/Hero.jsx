import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import heroImage from '../../assets/hero.png';

export default function Hero() {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 40 + 20,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 5,
      opacity: Math.random() * 0.15 + 0.05
    }));
    setParticles(newParticles);
  }, []);

  const featuredArtwork = {
    title: "Lost Worlds",
    price: "3.4",
    creator: "duke.sol"
  };

  const FeaturedArtworkCard = () => (
    <div className="relative w-full max-w-[400px] bg-black/50 border-2 border-white/10">
      {/* Civic Logo Watermark */}
      <div className="absolute inset-0 flex items-center justify-center z-0 opacity-10">
        <img
          src="https://cdn.prod.website-files.com/6721152f5cf7d1402980ed13/6725013885cfef9f1f06a89e_civic-logo-white.png"
          alt="Civic"
          className="w-48 h-auto"
        />
      </div>

      <div className="aspect-square relative z-10">
        <img
          src={heroImage}
          alt="Lost Worlds"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/80 to-transparent z-20">
        <h3 className="text-xl font-bold font-display">{featuredArtwork.title}</h3>
        <p className="text-primary font-bold text-lg mt-2">{featuredArtwork.price} SOL</p>
        <p className="text-gray-400 text-sm font-general-sans">by {featuredArtwork.creator}</p>
      </div>
    </div>
  );

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
              <span className="text-white">Discover,</span><br />
              <span className="text-white">Share,</span>{' '}
              <span className="text-white">And</span>{' '}
              <motion.span
                className="text-primary"
                animate={{
                  color: ['#9333EA', '#A855F7', '#9333EA'],
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
              className="text-gray-200 text-lg max-w-xl font-general-sans"
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
              <Link
                to="/marketplace"
                className="px-8 py-3 border-2 border-primary bg-transparent text-white hover:bg-primary/20 transition-all"
              >
                Get Started
              </Link>
              <Link
                to="/create"
                className="px-8 py-3 border-2 border-white/30 bg-transparent text-white hover:bg-white/10 transition-all"
              >
                List Artwork
              </Link>
            </motion.div>

            <div className="grid grid-cols-3 gap-8 pt-12">
              <div>
                <h3 className="text-4xl font-bold font-mono text-white">2K+</h3>
                <p className="text-gray-200 mt-1 font-general-sans">Active Artists</p>
              </div>
              <div>
                <h3 className="text-4xl font-bold font-mono text-white">10K+</h3>
                <p className="text-gray-200 mt-1 font-general-sans">Artworks Sold</p>
              </div>
              <div>
                <h3 className="text-4xl font-bold font-mono text-white">$2M+</h3>
                <p className="text-gray-200 mt-1 font-general-sans">Creator Earnings</p>
              </div>
            </div>
          </motion.div>

          {/* Right side with both Featured Artwork and Civic Logo */}
          <div className="relative w-full h-[600px] -mt-8 hidden lg:block">
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
                  <FeaturedArtworkCard />
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
                  <FeaturedArtworkCard />
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
                  <FeaturedArtworkCard />
                </motion.div>

                {/* Add Civic Logo below the artwork */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="absolute bottom-0 left-1/2 transform -translate-x-1/2 mt-8"
                >
                  <motion.img
                    src="https://cdn.prod.website-files.com/6721152f5cf7d1402980ed13/6725013885cfef9f1f06a89e_civic-logo-white.png"
                    alt="Powered by Civic"
                    className="w-48 h-auto"
                    animate={{
                      opacity: [0.7, 1, 0.7],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-transparent to-blue-900/20 pointer-events-none" />

      <div className="bg-[#0A0A0A]">
        {/* How It Works Section */}
        <section className="py-24 bg-black/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">How It Works</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">Get started with ArtVault in three simple steps</p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Connect Wallet",
                  description: "Sign in securely with Civic and connect your crypto wallet",
                  icon: (
                    <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  )
                },
                {
                  title: "Create & List",
                  description: "Upload your digital artwork and set your desired price",
                  icon: (
                    <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                  )
                },
                {
                  title: "Sell & Earn",
                  description: "Earn crypto when collectors purchase your artwork",
                  icon: (
                    <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )
                }
              ].map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.5,
                    delay: i * 0.2,
                    type: "spring",
                    stiffness: 100
                  }}
                  whileHover={{
                    scale: 1.02,
                    transition: { duration: 0.2 }
                  }}
                  className="relative group"
                >
                  <motion.div
                    className="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity"
                    animate={{
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  <div className="relative text-center p-6 bg-white/5 border-2 border-white/10 hover:border-primary/50 transition-colors">
                    <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center bg-primary/10 rounded-full">
                      {step.icon}
                    </div>
                    <h3 className="text-xl font-bold font-display mb-4">{step.title}</h3>
                    <p className="text-gray-400">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Civic Authentication Banner */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-black to-primary/20" />
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[linear-gradient(30deg,#9333EA11,transparent_70%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(150deg,#9333EA11,transparent_70%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#9333EA11,transparent_70%)]" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col md:flex-row items-center justify-between gap-8"
            >
              <div className="md:w-2/3 text-center md:text-left">
                <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
                  Secured by Civic Authentication
                </h2>
                <p className="text-gray-400 text-lg mb-6">
                  Experience top-tier security with Civic's blockchain-based authentication. Your digital identity and assets are protected by industry-leading technology.
                </p>
                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  <div className="flex items-center space-x-2 bg-white/5 px-4 py-2 border border-white/10">
                    <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                    <span className="text-gray-300">Secure Authentication</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-white/5 px-4 py-2 border border-white/10">
                    <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                    <span className="text-gray-300">Embedded Wallets</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-white/5 px-4 py-2 border border-white/10">
                    <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span className="text-gray-300">Flexible Usage</span>
                  </div>
                </div>
              </div>

              <div className="md:w-1/3 flex justify-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 blur-2xl" />
                  <div className="relative bg-black/50 border-2 border-primary/50 p-8">
                    <div className="flex items-center justify-center mb-6">
                      <img
                        src="https://cdn.prod.website-files.com/6721152f5cf7d1402980ed13/6725013885cfef9f1f06a89e_civic-logo-white.png"
                        alt="Civic Logo"
                        className="w-32 h-auto"
                      />
                    </div>
                    <div className="text-center">
                      <h3 className="text-xl font-bold mb-2">Civic Powered</h3>
                      <p className="text-gray-400 text-sm">
                        Protecting your digital identity and assets
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
}