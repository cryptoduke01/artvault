import { useState } from 'react';
import { useUser } from "@civic/auth-web3/react";
import { userHasWallet } from "@civic/auth-web3";
import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import toast from 'react-hot-toast';
import { supabase } from '../../lib/supabaseClient';

const SOLANA_NETWORK = "devnet";
const SOLANA_RPC_URL = `https://api.${SOLANA_NETWORK}.solana.com`;

const PurchaseButton = ({ artwork, onSuccess }) => {
  const userContext = useUser();
  const [processing, setProcessing] = useState(false);

  const handlePurchase = async () => {
    if (!userContext.user) {
      toast.error('Please sign in to make a purchase');
      return;
    }

    if (!userHasWallet(userContext)) {
      try {
        await userContext.createWallet();
        toast.success('Wallet created successfully');
      } catch (error) {
        toast.error('Failed to create wallet');
        return;
      }
    }

    setProcessing(true);
    try {
      const connection = new Connection(SOLANA_RPC_URL);
      const buyerWallet = userContext.solana.wallet;

      // Get seller's public key
      const { data: sellerData, error: sellerError } = await supabase
        .from('users')
        .select('wallet_address')
        .eq('id', artwork.creator_id)
        .single();

      if (sellerError) throw sellerError;

      const sellerPublicKey = new PublicKey(sellerData.wallet_address);
      const priceInLamports = artwork.price * LAMPORTS_PER_SOL;

      // Create and send transaction
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: buyerWallet.publicKey,
          toPubkey: sellerPublicKey,
          lamports: priceInLamports,
        })
      );

      const signature = await buyerWallet.sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature);

      // Update artwork status in database
      const { error: updateError } = await supabase
        .from('artworks')
        .update({
          sold: true,
          buyer_id: userContext.user.id,
          purchase_date: new Date().toISOString()
        })
        .eq('id', artwork.id);

      if (updateError) throw updateError;

      toast.success('Purchase successful!');
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Purchase error:', error);
      toast.error('Failed to complete purchase');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <button
      onClick={handlePurchase}
      disabled={processing}
      className={`px-6 py-3 border-2 border-primary text-white 
        ${processing ? 'bg-primary/50' : 'hover:bg-primary/10'} 
        transition-all flex items-center justify-center space-x-2`}
    >
      {processing ? (
        <>
          <span className="animate-spin">⚡</span>
          <span>Processing...</span>
        </>
      ) : (
        <span>Buy for {artwork.price} SOL</span>
      )}
    </button>
  );
};

export default PurchaseButton; 