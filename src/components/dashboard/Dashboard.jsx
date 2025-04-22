import { useEffect, useState, useCallback } from 'react';
import { useUser } from "@civic/auth-web3/react";
import { userHasWallet } from "@civic/auth-web3";
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import LoadingSpinner from '../ui/LoadingSpinner';
import { Connection, SystemProgram, PublicKey, LAMPORTS_PER_SOL, Transaction } from '@solana/web3.js';
import toast from 'react-hot-toast';
import TransactionSuccessModal from '../ui/TransactionSuccessModal';
import TransactionHistory from '../transactions/TransactionHistory';
import SendTokenModal from '../ui/SendTokenModal';
import ProfileCardModal from '../profile/ProfileCardModal';
import SolanaLogo from '../icons/SolanaLogo';
import EthereumLogo from '../icons/EthereumLogo';
import CopyButton from '../ui/CopyButton';
import { ethers } from 'ethers';
import { CryptoAmount } from '../../hooks/useCryptoPrices';

const solanaEndpoint = "https://api.devnet.solana.com";
const solanaConnection = new Connection(solanaEndpoint);

const Dashboard = () => {
  const userContext = useUser();
  const [solanaBalance, setSolanaBalance] = useState(null);
  const [userArtworks, setUserArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sendAmount, setSendAmount] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [showSendSolModal, setShowSendSolModal] = useState(false);
  const [isProfileCardOpen, setIsProfileCardOpen] = useState(false);
  const [sendingState, setSendingState] = useState({
    loading: false,
    status: '',
    authPending: false
  });
  const [successModal, setSuccessModal] = useState({
    isOpen: false,
    type: '',
    details: {}
  });
  const [ethAddress, setEthAddress] = useState(null);
  const [sepoliaBalance, setSepoliaBalance] = useState(null);
  const [refreshingSol, setRefreshingSol] = useState(false);
  const [refreshingEth, setRefreshingEth] = useState(false);

  const refreshSolBalance = useCallback(async () => {
    if (!userContext.solana?.wallet) return;

    try {
      setRefreshingSol(true);
      const bal = await solanaConnection.getBalance(userContext.solana.wallet.publicKey);
      setSolanaBalance(bal / LAMPORTS_PER_SOL);
      toast.success('SOL balance updated!');
    } catch (err) {
      console.error('Error fetching SOL balance:', err);
      toast.error('Failed to fetch SOL balance');
    } finally {
      setRefreshingSol(false);
    }
  }, [userContext.solana?.wallet]);

  const refreshEthBalance = useCallback(async () => {
    if (!userContext.ethereum?.address) return;

    try {
      setRefreshingEth(true);
      console.log('Fetching ETH balance for address:', userContext.ethereum.address);

      // Get provider and ensure we're on Sepolia
      const provider = new ethers.BrowserProvider(window.ethereum);
      const network = await provider.getNetwork();
      console.log('Current network:', {
        name: network.name,
        chainId: Number(network.chainId)
      });

      if (Number(network.chainId) !== 11155111) {
        toast.error('Please switch to Sepolia network (Chain ID: 11155111)');
        return;
      }

      const balance = await provider.getBalance(userContext.ethereum.address);
      const formattedBalance = ethers.formatEther(balance);
      console.log('Fetched ETH balance:', formattedBalance);
      
      setSepoliaBalance(formattedBalance);
      toast.success('ETH balance updated!');
    } catch (err) {
      console.error('Error fetching ETH balance:', err);
      toast.error(`Failed to fetch ETH balance: ${err.message}`);
    } finally {
      setRefreshingEth(false);
    }
  }, [userContext.ethereum?.address]);

  useEffect(() => {
    const fetchBalances = async () => {
      if (userContext.solana?.wallet) {
        await refreshSolBalance();
      }
      if (userContext.ethereum?.address) {
        await refreshEthBalance();
      }
    };

    fetchBalances();

    // Refresh every 15 seconds
    const interval = setInterval(fetchBalances, 15000);
    return () => clearInterval(interval);
  }, [refreshSolBalance, refreshEthBalance]);

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
            setSolanaBalance(bal / LAMPORTS_PER_SOL);
          } catch (err) {
            console.error('Error fetching Solana balance:', err);
          }
        }

        // Fetch artworks
        try {
          const { data: artworksData, error: artworksError } = await supabase
            .from('artworks')
            .select('*')
            .eq('creator_email', userContext.user.email);

          if (artworksError) throw artworksError;
          setUserArtworks(artworksData || []);
        } catch (err) {
          console.error('Error fetching artworks:', err);
        }

        // Fetch Ethereum info if available in userContext
        if (userContext.ethereum?.address) {
          setEthAddress(userContext.ethereum.address);
          // You might want to fetch balance here if available
        }

        // Fetch Ethereum Sepolia balance if available
        if (userContext.ethereum?.address) {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const balance = await provider.getBalance(userContext.ethereum.address);
          setSepoliaBalance(ethers.formatEther(balance));
        }

      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userContext.user]);

  const handleSendSol = async () => {
    setSendingState({ loading: true, status: 'Initiating transaction...', authPending: false });
    const loadingToast = toast.loading('Processing transaction...');

    try {
      if (!userContext.user || !userHasWallet(userContext)) {
        throw new Error('Please sign in and create a wallet first');
      }

      const { wallet } = userContext.solana;

      // Validate recipient address
      let recipientPubKey;
      try {
        recipientPubKey = new PublicKey(recipientAddress);
      } catch (error) {
        throw new Error('Invalid recipient address');
      }

      // Validate amount
      const amount = parseFloat(sendAmount);
      if (isNaN(amount) || amount <= 0) {
        throw new Error('Please enter a valid amount');
      }

      // Check balance
      const balance = await solanaConnection.getBalance(wallet.publicKey);
      const balanceInSOL = balance / LAMPORTS_PER_SOL;

      if (amount > balanceInSOL) {
        throw new Error(`Insufficient balance. You have ${balanceInSOL.toFixed(4)} SOL`);
      }

      // Calculate fee buffer (0.001 SOL for fees)
      const feeBuffer = 0.001;
      if (amount + feeBuffer > balanceInSOL) {
        throw new Error(`Insufficient balance for transaction fee. Please leave at least ${feeBuffer} SOL for fees`);
      }

      const lamports = Math.floor(amount * LAMPORTS_PER_SOL);

      setSendingState(prev => ({ ...prev, status: 'Creating transaction...' }));

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: wallet.publicKey,
          toPubkey: recipientPubKey,
          lamports
        })
      );

      const { blockhash } = await solanaConnection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = wallet.publicKey;

      setSendingState(prev => ({ ...prev, status: 'Waiting for approval...', authPending: true }));

      const signature = await wallet.sendTransaction(
        transaction,
        solanaConnection
      );

      setSendingState(prev => ({ ...prev, status: 'Confirming transaction...', authPending: false }));

      const confirmation = await solanaConnection.confirmTransaction(signature, 'confirmed');

      if (confirmation.value.err) {
        throw new Error('Transaction failed to confirm');
      }

      // Refresh balance
      const newBalance = await solanaConnection.getBalance(wallet.publicKey);
      setSolanaBalance(newBalance / LAMPORTS_PER_SOL);

      // Show success modal
      setSuccessModal({
        isOpen: true,
        type: 'transfer',
        details: {
          amount: sendAmount,
          recipient: recipientAddress,
          signature
        }
      });

      // Clear form and close modal
      setSendAmount('');
      setRecipientAddress('');
      setShowSendSolModal(false);
      toast.success('Transaction successful!', { id: loadingToast });

    } catch (error) {
      console.error('Send error:', error);

      // Handle specific error types
      if (error.message.includes('insufficient lamports')) {
        toast.error('Insufficient balance to complete the transaction', { id: loadingToast });
      } else if (error.message.includes('Insufficient balance')) {
        toast.error(error.message, { id: loadingToast });
      } else if (error.name === 'WalletSendTransactionError') {
        toast.error('Transaction failed. Please try again.', { id: loadingToast });
      } else if (error.message.includes('Invalid recipient')) {
        toast.error('Invalid recipient address', { id: loadingToast });
      } else {
        toast.error(error.message || 'Failed to send SOL', { id: loadingToast });
      }
    } finally {
      setSendingState({ loading: false, status: '', authPending: false });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
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
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsProfileCardOpen(true)}
              className="px-4 py-2 border border-primary bg-primary/10 hover:bg-primary/20 text-white transition-colors"
            >
              <span className="flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="16" rx="2" />
                  <circle cx="9" cy="10" r="2" />
                  <path d="M15 8h2" />
                  <path d="M15 12h2" />
                  <path d="M7 16h10" />
                </svg>
                <span>ID Card</span>
              </span>
            </motion.button>
          </div>
        </div>

        {/* Wallets Section */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Solana Wallet */}
          <div className="bg-white/5 border-2 border-white/10 p-6">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-xl font-bold font-display">Solana Wallet</h3>
              <SolanaLogo className="w-6 h-6" />
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-gray-400">Your Address:</p>
                <div className="flex items-center bg-black/50 p-2 border border-white/10">
                  <p className="font-mono text-sm break-all flex-grow">
                    {userHasWallet(userContext) && userContext.solana?.wallet
                      ? userContext.solana.wallet.publicKey.toString()
                      : 'No wallet created'}
                  </p>
                  {userHasWallet(userContext) && userContext.solana?.wallet && (
                    <CopyButton
                      text={userContext.solana.wallet.publicKey.toString()}
                      onCopy={() => toast.success('Address copied!')}
                    />
                  )}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <p className="text-gray-400">Balance:</p>
                  <button
                    onClick={refreshSolBalance}
                    disabled={refreshingSol}
                    className="p-1 hover:bg-white/5 transition-colors rounded-full"
                    title="Refresh SOL balance"
                  >
                    <svg
                      className={`w-4 h-4 text-gray-400 hover:text-white ${refreshingSol ? 'animate-spin' : ''
                        }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                  </button>
                </div>
                <div className="flex items-center space-x-2">
                  <CryptoAmount
                    amount={solanaBalance}
                    cryptoType="SOL"
                    className="text-2xl font-bold text-primary"
                  />
                  {refreshingSol && (
                    <span className="text-xs text-gray-400">Refreshing...</span>
                  )}
                </div>
              </div>

              <button
                onClick={() => setShowSendSolModal(true)}
                className="w-full bg-primary/20 hover:bg-primary/30 text-white px-4 py-3 
                  transition-colors border border-primary mt-4"
              >
                Withdraw SOL
              </button>
            </div>
          </div>

          {/* Ethereum Wallet */}
          <div className="bg-white/5 border-2 border-white/10 p-6">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-xl font-bold font-display">Ethereum Wallet (Sepolia)</h3>
              <EthereumLogo className="w-6 h-6" />
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-gray-400">Your Address:</p>
                <div className="flex items-center bg-black/50 p-2 border border-white/10">
                  <p className="font-mono text-sm break-all flex-grow">
                    {ethAddress || 'No wallet connected'}
                  </p>
                  {ethAddress && (
                    <CopyButton
                      text={ethAddress}
                      onCopy={() => toast.success('Address copied!')}
                    />
                  )}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <p className="text-gray-400">Sepolia Balance:</p>
                  <button
                    onClick={refreshEthBalance}
                    disabled={refreshingEth}
                    className="p-1 hover:bg-white/5 transition-colors rounded-full"
                    title="Refresh ETH balance"
                  >
                    <svg
                      className={`w-4 h-4 text-gray-400 hover:text-white ${refreshingEth ? 'animate-spin' : ''
                        }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                  </button>
                </div>
                <div className="flex items-center space-x-2">
                  <CryptoAmount
                    amount={Number(sepoliaBalance)}
                    cryptoType="ETH"
                    className="text-2xl font-bold text-primary"
                  />
                  {refreshingEth && (
                    <span className="text-xs text-gray-400">Refreshing...</span>
                  )}
                </div>
              </div>

              <div className="mt-2 p-2 bg-white/5 rounded text-sm">
                <p className="text-gray-400">
                  Network: <span className="text-primary">Sepolia Testnet</span>
                </p>
                <p className="text-gray-400 text-xs mt-1">
                  Chain ID: 11155111
                </p>
              </div>
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
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {userArtworks.map((artwork) => (
                <motion.div
                  key={artwork.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white/5 border border-white/10 hover:border-primary/50 transition-colors"
                >
                  <Link to={`/artwork/${artwork.id}`}>
                    <div className="aspect-square w-full">
                      <img
                        src={artwork.image_url}
                        alt={artwork.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-3 space-y-1">
                      <h4 className="text-sm font-bold font-display line-clamp-1">{artwork.title}</h4>
                      <p className="text-primary font-bold text-sm">{artwork.price} SOL</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Transaction History */}
        <TransactionHistory />
      </motion.div>

      {/* Modals */}
      <SendTokenModal
        isOpen={showSendSolModal}
        onClose={() => setShowSendSolModal(false)}
        type="Solana"
        balance={solanaBalance}
        amount={sendAmount}
        setAmount={setSendAmount}
        recipientAddress={recipientAddress}
        setRecipientAddress={setRecipientAddress}
        onSend={handleSendSol}
        loading={sendingState.loading}
      />

      <TransactionSuccessModal
        isOpen={successModal.isOpen}
        onClose={() => setSuccessModal({ isOpen: false, type: '', details: {} })}
        type={successModal.type}
        details={successModal.details}
      />

      <ProfileCardModal
        isOpen={isProfileCardOpen}
        onClose={() => setIsProfileCardOpen(false)}
        user={userContext.user}
        solanaWallet={userContext.solana?.wallet?.publicKey}
        ethereumWallet={ethAddress}
      />
    </div>
  );
};

export default Dashboard;