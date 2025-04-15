import { useEffect, useState } from 'react';
import { useUser } from "@civic/auth-web3/react";
import { userHasWallet } from "@civic/auth-web3";
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import LoadingSpinner from '../ui/LoadingSpinner';
import { Connection } from '@solana/web3.js';
import { ethers } from 'ethers';

const solanaEndpoint = "https://api.devnet.solana.com";
const solanaConnection = new Connection(solanaEndpoint);

// Initialize Ethereum provider
const ethereumProvider = new ethers.BrowserProvider(window.ethereum);

const Dashboard = () => {
  const userContext = useUser();
  const [solanaBalance, setSolanaBalance] = useState(null);
  const [ethereumBalance, setEthereumBalance] = useState(null);
  const [userArtworks, setUserArtworks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!userContext.user) {
          setLoading(false);
          return;
        }

        // Create wallet if needed
        if (!userHasWallet(userContext)) {
          try {
            await userContext.createWallet();
          } catch (err) {
            console.error('Error creating wallet:', err);
          }
        }

        // Fetch Solana balance
        if (userHasWallet(userContext) && userContext.solana?.wallet) {
          try {
            const bal = await solanaConnection.getBalance(userContext.solana.wallet.publicKey);
            setSolanaBalance(bal / 1e9);
          } catch (err) {
            console.error('Error fetching Solana balance:', err);
          }
        }

        // Fetch Ethereum balance if available
        if (userContext.ethereum?.address) {
          try {
            const balance = await ethereumProvider.getBalance(userContext.ethereum.address);
            setEthereumBalance(ethers.formatEther(balance));
          } catch (err) {
            console.error('Error fetching Ethereum balance:', err);
          }
        }

        // Simplified artwork fetching
        try {
          // First get artworks
          const { data: artworksData, error: artworksError } = await supabase
            .from('artworks')
            .select('*')
            .eq('creator_email', userContext.user.email);

          if (artworksError) throw artworksError;

          // Then get user data
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('email', userContext.user.email)
            .single();

          if (userError) throw userError;

          // Combine the data
          const artworksWithUser = artworksData.map(artwork => ({
            ...artwork,
            users: userData
          }));

          setUserArtworks(artworksWithUser || []);
        } catch (err) {
          console.error('Error fetching artworks:', err);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userContext]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (!userContext.user) {
    return (
      <div className="container mx-auto px-4 py-24">
        <div className="text-center">
          <p className="text-gray-400 text-lg">Please sign in to view your dashboard</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {/* User Profile Section */}
        <div className="bg-white/5 border-2 border-white/10 p-6">
          <div className="flex items-center space-x-4">
            <img
              src={userContext.user?.picture}
              alt={userContext.user?.name}
              className="w-16 h-16 rounded-none border-2 border-primary"
            />
            <div className="flex-grow">
              <h2 className="text-2xl font-bold font-display">{userContext.user?.name}</h2>
              <p className="text-gray-400 font-general-sans">{userContext.user?.email}</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-primary font-display">{userArtworks.length}</p>
              <p className="text-gray-400 font-general-sans text-sm">Artworks Created</p>
            </div>
          </div>
        </div>

        {/* Wallets Section */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Solana Wallet */}
          <div className="bg-white/5 border-2 border-white/10 p-6">
            <h3 className="text-xl font-bold mb-4 font-display">Solana Wallet</h3>
            <div className="space-y-2 font-general-sans">
              <p className="text-gray-400">Address:</p>
              <p className="font-mono text-sm break-all bg-black/50 p-2 border border-white/10">
                {userHasWallet(userContext) && userContext.solana?.wallet
                  ? userContext.solana.wallet.publicKey.toString()
                  : 'No wallet created'}
              </p>
              {userHasWallet(userContext) && (
                <>
                  <p className="text-gray-400 mt-4">Balance:</p>
                  <p className="text-2xl font-bold text-primary">
                    {solanaBalance !== null ? `${solanaBalance.toFixed(4)} SOL` : 'Loading...'}
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Ethereum Wallet */}
          <div className="bg-white/5 border-2 border-white/10 p-6">
            <h3 className="text-xl font-bold mb-4 font-display">Ethereum Wallet</h3>
            <div className="space-y-2 font-general-sans">
              <p className="text-gray-400">Address:</p>
              <p className="font-mono text-sm break-all bg-black/50 p-2 border border-white/10">
                {userContext.ethereum?.address || 'No ETH wallet available'}
              </p>
              {userContext.ethereum?.address && (
                <>
                  <p className="text-gray-400 mt-4">Balance:</p>
                  <p className="text-2xl font-bold text-primary">
                    {ethereumBalance !== null ? `${Number(ethereumBalance).toFixed(4)} ETH` : 'Loading...'}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Created Artworks Section */}
        <div>
          <h3 className="text-xl font-bold mb-6 font-display">Your Artworks</h3>
          {userArtworks.length === 0 ? (
            <div className="text-center py-12 bg-white/5 border-2 border-white/10">
              <p className="text-gray-400 font-general-sans">No artworks created yet</p>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="mt-4"
              >
                <Link
                  to="/create"
                  className="inline-block px-6 py-3 border-2 border-primary text-white hover:bg-primary/10 transition-all"
                >
                  Create Your First Artwork
                </Link>
              </motion.div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userArtworks.map((artwork) => (
                <motion.div
                  key={artwork.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white/5 border-2 border-white/10"
                >
                  <div className="aspect-square">
                    <img
                      src={artwork.image_url}
                      alt={artwork.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h4 className="text-lg font-bold font-display">{artwork.title}</h4>
                    <p className="text-gray-400 mt-1 font-general-sans">{artwork.description}</p>
                    <p className="text-primary font-bold mt-2">{artwork.price} SOL</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
