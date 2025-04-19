import { motion, AnimatePresence } from 'framer-motion';

const TransactionSuccessModal = ({ isOpen, onClose, type, details }) => {
  if (!isOpen) return null;

  const isError = type === 'error';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-[#1a1a1a] border-2 border-primary/20 p-6 max-w-md w-full mx-4 relative"
        >
          <div className="text-center space-y-4">
            {/* Success/Error Icon */}
            <div className="flex justify-center">
              <div className={`w-16 h-16 ${isError ? 'bg-red-500/20' : 'bg-primary/20'} rounded-full flex items-center justify-center`}>
                {isError ? (
                  <svg
                    className="w-8 h-8 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-8 h-8 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </div>
            </div>

            <h3 className={`text-2xl font-bold font-display ${isError ? 'text-red-500' : ''}`}>
              {isError ? details.title : (type === 'purchase' ? 'Purchase Successful!' : 'Transfer Successful!')}
            </h3>

            <div className="space-y-2 text-gray-300">
              {isError ? (
                <p className="text-red-400">{details.message}</p>
              ) : (
                <>
                  {details.amount && (
                    <p>Amount: {details.amount} SOL</p>
                  )}
                  {details.recipient && (
                    <p className="text-sm break-all">
                      To: {details.recipient}
                    </p>
                  )}
                </>
              )}

              {details.signature && (
                <a
                  href={`https://explorer.solana.com/tx/${details.signature}?cluster=devnet`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80 underline block mt-2"
                >
                  View on Solana Explorer
                </a>
              )}
            </div>

            <button
              onClick={onClose}
              className={`mt-6 ${isError ? 'bg-red-500 hover:bg-red-600' : 'bg-primary hover:bg-primary/80'} 
                text-white px-8 py-2 transition-colors w-full`}
            >
              {isError ? 'Close' : 'Done'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default TransactionSuccessModal; 