import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from "@civic/auth-web3/react";
import { userHasWallet } from "@civic/auth-web3";
import { supabase } from '../../lib/supabaseClient';
import { Connection, SystemProgram, Transaction, PublicKey } from '@solana/web3.js';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import LoadingSpinner from '../ui/LoadingSpinner';

// Initialize connection
const connection = new Connection("https://api.devnet.solana.com");
const TEMP_CREATOR_WALLET = "9XrAiHdCeAyBwXtu8uCoFXVjC72KbUZG65PxybUtVjm3";

const ArtworkDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const userContext = useUser();
  const [artwork, setArtwork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [walletBalance, setWalletBalance] = useState(null);

  useEffect(() => {
    const fetchArtwork = async () => {
      try {
        const { data, error } = await supabase
          .from('artworks')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setArtwork(data);

        if (userContext.user && userHasWallet(userContext)) {
          const balance = await connection.getBalance(userContext.solana.wallet.publicKey);
          setWalletBalance(balance / 1e9);
        }
      } catch (err) {
        console.error('Error:', err);
        toast.error('Error loading artwork');
      } finally {
        setLoading(false);
      }
    };

    fetchArtwork();
  }, [id, userContext]);

  const handlePurchase = async () => {
    const loadingToast = toast.loading('Processing purchase...');

    try {
      setPurchasing(true);

      if (!userContext.user) {
        throw new Error('Please sign in first');
      }

      if (!userHasWallet(userContext)) {
        await userContext.createWallet();
      }

      const { wallet } = userContext.solana;
      const lamports = Math.floor(artwork.price * 1e9);

      const transferInstruction = SystemProgram.transfer({
        fromPubkey: wallet.publicKey,
        toPubkey: new PublicKey(TEMP_CREATOR_WALLET),
        lamports,
      });

      const transaction = new Transaction().add(transferInstruction);
      const signature = await wallet.sendTransaction(transaction, connection);

      await connection.confirmTransaction(signature);

      const { error: updateError } = await supabase
        .from('artworks')
        .update({
          owner_email: userContext.user.email,
          purchase_date: new Date().toISOString(),
          transaction_signature: signature
        })
        .eq('id', artwork.id);

      if (updateError) throw updateError;

      toast.success('Purchase successful!', { id: loadingToast });
      setTimeout(() => navigate('/dashboard'), 2000);

    } catch (error) {
      console.error('Purchase error:', error);
      toast.error(error.message || 'Purchase failed', { id: loadingToast });
    } finally {
      setPurchasing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (!artwork) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-400">Artwork not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid lg:grid-cols-[1fr,400px] gap-8 lg:gap-12 items-start"
      >
        {/* Left Column - Image */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative bg-black/50"
        >
          <div className="max-h-[70vh] overflow-hidden">
            <img
              src={artwork.image_url}
              alt={artwork.title}
              className="w-full h-full object-contain border-2 border-white/10"
            />
          </div>
        </motion.div>

        {/* Right Column - Details */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6 lg:sticky lg:top-24"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4 font-display">
              {artwork.title}
            </h1>
            <div className="flex items-center space-x-4 bg-white/5 p-4 border-2 border-white/10">
              <div>
                <p className="text-gray-400">Price</p>
                <p className="text-2xl font-bold">{artwork.price} SOL</p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 p-6 border-2 border-white/10">
            <p className="text-gray-400 mb-2">Description</p>
            <p className="text-lg">{artwork.description}</p>
          </div>

          {walletBalance !== null && (
            <div className="bg-white/5 p-4 border-2 border-white/10">
              <p className="text-gray-400">Your balance</p>
              <p className="text-lg">{walletBalance} SOL</p>
            </div>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handlePurchase}
            disabled={purchasing || !userContext.user}
            className="w-full bg-primary text-white px-8 py-4 hover:bg-primary/80 
              transition-colors border-2 border-primary hover:border-primary/80 
              disabled:bg-gray-600 disabled:border-gray-600 disabled:cursor-not-allowed"
          >
            {purchasing ? (
              <div className="flex items-center justify-center space-x-2">
                <LoadingSpinner />
                <span>Processing...</span>
              </div>
            ) : (
              <span>Purchase for {artwork.price} SOL</span>
            )}
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ArtworkDetail;
