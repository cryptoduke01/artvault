import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CryptoAmount } from '../../hooks/useCryptoPrices';

const TransactionSuccessModalPurchase = ({ isOpen, onClose, type, details }) => {
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    if (isOpen) {
      setVisible(true);
    } else {
      const timeout = setTimeout(() => {
        setVisible(false);
      }, 200);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);
  
  if (!visible || !details) return null;
  
  const isError = type === 'error';
  
  const getExplorerUrl = (signature) => {
    return `https://explorer.solana.com/tx/${signature}?cluster=devnet`;
  };

  const shortenSignature = (signature) => {
    if (!signature) return '';
    return `${signature.substring(0, 4)}...${signature.substring(signature.length - 4)}`;
  };

  const downloadReceipt = () => {
    // Create receipt content
    const receiptDate = new Date().toLocaleString();
    const receiptContent = `
      Transaction Receipt
      -------------------
      Date: ${receiptDate}
      ${type === 'purchase' ? `Artwork: ${details.artworkTitle}` : ''}
      ${details.price ? `Price: ${details.price} SOL` : ''}
      ${details.amount ? `Amount: ${details.amount} SOL` : ''}
      ${details.recipient ? `Recipient: ${details.recipient}` : ''}
      Transaction ID: ${details.signature}
    `;

    // Create blob and download
    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt-${shortenSignature(details.signature)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black/80" 
          onClick={onClose}
        />
        
        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-md bg-black border border-white/10 p-5 text-left shadow-xl z-10 rounded-md"
        >
          <div className="text-center">
            {/* Success/Error Icon */}
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-green-100 mb-3">
              {isError ? (
                <svg className="h-6 w-6 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </div>
            
            {/* Title */}
            <h3 className="text-lg font-bold text-white mb-1">
              {isError ? details.title : (type === 'purchase' ? 'Purchase Successful!' : 'Successful!')}
            </h3>
            
            {/* Minimal Details */}
            <div className="mt-3 bg-white/5 p-3 border border-white/10 rounded-md text-left">
              {isError ? (
                <p className="text-red-400">{details.message}</p>
              ) : type === 'purchase' ? (
                <>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400">Artwork:</span>
                    <span className="font-medium">{details.artworkTitle}</span>
                  </div>
                  
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400">Price:</span>
                    <span className="font-medium">
                      <CryptoAmount amount={details.price} cryptoType="SOL" />
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">TX ID:</span>
                    <span className="font-mono text-xs">{shortenSignature(details.signature)}</span>
                  </div>
                </>
              ) : (
                <>
                  {details.amount && (
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-400">Amount:</span>
                      <span className="font-medium">{details.amount} SOL</span>
                    </div>
                  )}
                  
                  {details.recipient && (
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-400">To:</span>
                      <span className="font-mono text-xs">{shortenSignature(details.recipient)}</span>
                    </div>
                  )}
                  
                  {details.signature && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">TX ID:</span>
                      <span className="font-mono text-xs">{shortenSignature(details.signature)}</span>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Action Buttons */}
            <div className="mt-4 grid grid-cols-2 gap-2">
              {details.signature && (
                <>
                  <a
                    href={getExplorerUrl(details.signature)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-transparent text-white px-3 py-2 text-sm font-medium hover:bg-white/5 transition-colors border border-white/20 rounded"
                  >
                    View on Explorer
                  </a>
                  
                  <button
                    type="button"
                    onClick={downloadReceipt}
                    className="bg-transparent text-white px-3 py-2 text-sm font-medium hover:bg-white/5 transition-colors border border-white/20 rounded"
                  >
                    Download Receipt
                  </button>
                </>
              )}

              <button
                type="button"
                onClick={onClose}
                className="col-span-2 bg-primary text-white px-3 py-2 text-sm font-medium hover:bg-primary/80 transition-colors rounded mt-1"
              >
                {isError ? 'Close' : 'Done'}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default TransactionSuccessModalPurchase;