import { motion, AnimatePresence } from 'framer-motion';
import LoadingSpinner from './LoadingSpinner';
import { CryptoAmount } from '../../hooks/useCryptoPrices';

const SendTokenModal = ({
  isOpen,
  onClose,
  type,
  balance,
  amount,
  setAmount,
  recipientAddress,
  setRecipientAddress,
  onSend,
  loading
}) => {
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSend();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-[#1a1a1a] border-2 border-primary/20 p-6 max-w-md w-full mx-4"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold font-display">
              Send {type}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">
                Recipient Address
              </label>
              <input
                type="text"
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
                className="w-full p-3 bg-black/50 border border-white/10 
                  focus:border-primary transition-colors outline-none"
                placeholder={`Enter ${type} address`}
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">
                Amount ({type === 'Solana' ? 'SOL' : 'ETH'})
              </label>
              <input
                type="number"
                step="0.000001"
                min="0"
                max={balance}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full p-3 bg-black/50 border border-white/10 
                  focus:border-primary transition-colors outline-none"
                placeholder="0.0"
                required
              />
              <p className="text-sm text-gray-400 mt-1">
                Available: <CryptoAmount amount={balance} cryptoType={type === 'Solana' ? 'SOL' : 'ETH'} />
              </p>
            </div>

            <div className="flex space-x-4 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-white/10 
                  hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-primary text-white px-6 py-3 
                  hover:bg-primary/80 transition-colors disabled:bg-gray-600 
                  disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <LoadingSpinner size="sm" />
                    <span>Sending...</span>
                  </div>
                ) : (
                  `Send ${type}`
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default SendTokenModal; 