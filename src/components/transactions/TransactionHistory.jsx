import { useState, useEffect } from 'react';
import { useUser } from "@civic/auth-web3/react";
import { useLocation } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { motion } from 'framer-motion';
import LoadingSpinner from '../ui/LoadingSpinner';
import { CryptoAmount } from '../../hooks/useCryptoPrices';

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const userContext = useUser();
  const location = useLocation();

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!userContext.user?.email) {
        setLoading(false);
        return;
      }

      try {
        // Fetch all transactions where user is either sender or recipient
        const { data, error } = await supabase
          .from('transactions')
          .select('*')
          .or(`sender_email.eq.${userContext.user.email}${userContext.solana?.wallet ? ',recipient_address.eq.' + userContext.solana.wallet.publicKey.toString() : ''}`)
          .order('created_at', { ascending: false });

        if (error) throw error;

        setTransactions(data || []);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();

    // Set up a subscription to listen for new transactions
    const subscription = supabase
      .channel('transactions-changes')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'transactions',
          filter: `sender_email=eq.${userContext.user?.email}`
        }, 
        (payload) => {
          setTransactions(current => [payload.new, ...current]);
        })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [userContext.user, userContext.solana?.wallet]);

  if (loading) {
    return (
      <div className="flex justify-center p-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold font-display">Transaction History</h2>

      {transactions.length === 0 ? (
        <div className="text-center py-12 bg-white/5 border-2 border-white/10">
          <p className="text-gray-400">No transactions yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {transactions.map((tx) => {
            const isOutgoing = tx.sender_email === userContext.user?.email;
            const isArtworkPurchase = tx.type === 'purchase';

            return (
              <motion.div
                key={tx.id || tx.signature}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-white/5 border-2 border-white/10 p-4 ${location.state?.highlightTx === tx.signature ? 'ring-2 ring-primary' : ''}`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold">
                      {isArtworkPurchase ? `Artwork Purchase: ${tx.artwork_title || ''}` : 'SOL Transfer'}
                    </p>
                    <p className="text-sm text-gray-400">
                      {new Date(tx.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`text-xl font-bold ${isOutgoing ? 'text-red-500' : 'text-green-500'}`}>
                      {isOutgoing ? '-' : '+'}
                      <CryptoAmount amount={tx.amount} cryptoType="SOL" />
                    </p>
                  </div>
                </div>

                <div className="mt-2 text-sm">
                  {isOutgoing ? (
                    <p className="text-gray-400">
                      To: <span className="text-white break-all">{tx.recipient_address}</span>
                    </p>
                  ) : (
                    <p className="text-gray-400">
                      From: <span className="text-white break-all">{tx.sender_email}</span>
                    </p>
                  )}
                  <a
                    href={`https://explorer.solana.com/tx/${tx.signature}?cluster=devnet`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80 underline mt-2 inline-block"
                  >
                    View on Explorer
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;