import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from "@civic/auth-web3/react";
import { userHasWallet } from "@civic/auth-web3";
import { supabase } from '../../lib/supabaseClient';
import { Connection, SystemProgram, PublicKey, LAMPORTS_PER_SOL, Transaction } from '@solana/web3.js';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import LoadingSpinner from '../ui/LoadingSpinner';
import TransactionSuccessModal from '../ui/TransactionSuccessModal';
import { CryptoAmount } from '../../hooks/useCryptoPrices';

// Initialize Solana connection
const connection = new Connection("https://api.devnet.solana.com", "confirmed");
const RECIPIENT_ADDRESS = "9XrAiHdCeAyBwXtu8uCoFXVjC72KbUZG65PxybUtVjm3";

const ArtworkDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const userContext = useUser();
  const [artwork, setArtwork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [walletBalance, setWalletBalance] = useState(null);
  const [successModal, setSuccessModal] = useState({
    isOpen: false,
    details: {}
  });

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
          setWalletBalance(balance / LAMPORTS_PER_SOL);
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
        toast.error('Please sign in first', { id: loadingToast });
        return;
      }

      if (!userHasWallet(userContext)) {
        await userContext.createWallet();
      }

      const { wallet } = userContext.solana;

      // Check balance before attempting purchase
      const balance = await connection.getBalance(wallet.publicKey);
      const balanceInSOL = balance / LAMPORTS_PER_SOL;
      const priceInSOL = artwork.price;

      if (balanceInSOL < priceInSOL) {
        // Show error modal
        setSuccessModal({
          isOpen: true,
          type: 'error',
          details: {
            title: 'Insufficient Balance',
            message: `You need ${priceInSOL} SOL but have ${balanceInSOL.toFixed(4)} SOL`,
            amount: priceInSOL,
            balance: balanceInSOL
          }
        });
        toast.error('Insufficient balance', { id: loadingToast });
        return;
      }

      // Create transaction
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: wallet.publicKey,
          toPubkey: new PublicKey(RECIPIENT_ADDRESS),
          lamports: Math.floor(artwork.price * LAMPORTS_PER_SOL)
        })
      );

      // Get latest blockhash
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = wallet.publicKey;

      // Send transaction
      const signature = await wallet.sendTransaction(
        transaction,
        connection
      );

      // Wait for confirmation with longer timeout
      const confirmation = await connection.confirmTransaction(signature, 'confirmed');

      if (confirmation.value.err) {
        throw new Error('Transaction failed to confirm');
      }

      // Update artwork status
      const { error: updateError } = await supabase
        .from('artworks')
        .update({
          sold: true,
          transaction_signature: signature,
          purchased_at: new Date().toISOString()
        })
        .eq('id', artwork.id);

      if (updateError) throw updateError;

      toast.success('Purchase successful! Redirecting...', { id: loadingToast });
      setTimeout(() => navigate('/dashboard'), 2000);

    } catch (error) {
      console.error('Purchase error:', error);

      // Show error modal for all errors
      setSuccessModal({
        isOpen: true,
        type: 'error',
        details: {
          title: 'Purchase Failed',
          message: error.message || 'Failed to complete purchase',
          error: error.name
        }
      });

      toast.error(error.message || 'Purchase failed', { id: loadingToast });
    } finally {
      setPurchasing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
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
    <>
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
                  <CryptoAmount
                    amount={artwork.price}
                    cryptoType="SOL"
                    className="text-2xl font-bold"
                  />
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
                <CryptoAmount
                  amount={walletBalance}
                  cryptoType="SOL"
                  className="text-lg"
                />
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
                  <LoadingSpinner size="sm" />
                  <span>Processing...</span>
                </div>
              ) : (
                <span>Purchase for <CryptoAmount amount={artwork.price} cryptoType="SOL" /></span>
              )}
            </motion.button>
          </motion.div>
        </motion.div>
      </div>

      <TransactionSuccessModal
        isOpen={successModal.isOpen}
        onClose={() => setSuccessModal({ isOpen: false, details: {} })}
        type={successModal.type}
        details={successModal.details}
      />
    </>
  );
};

export default ArtworkDetail;
