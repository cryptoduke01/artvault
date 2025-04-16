import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import html2canvas from 'html2canvas';

const ProfileCardModal = ({ isOpen, onClose, user, solanaWallet, ethereumWallet }) => {
  const [downloading, setDownloading] = useState(false);
  const cardRef = useRef(null);

  // Function to download the card as an image
  const downloadCard = async () => {
    if (!cardRef.current) return;
    
    try {
      setDownloading(true);
      
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2, // Higher quality
      });
      
      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = `${user.name}-artvault-card.png`;
      link.click();
    } catch (error) {
      console.error("Error generating image:", error);
    } finally {
      setDownloading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="w-full max-w-md"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Profile Card */}
          <div 
            ref={cardRef}
            className="bg-gradient-to-br from-black to-gray-900 border-2 border-white/10 p-6 relative overflow-hidden"
          >
            {/* ArtVault Logo/Watermark */}
            <div className="absolute -bottom-8 -right-8 opacity-10">
              <svg width="200" height="200" viewBox="0 0 100 100">
                <text x="10" y="50" fontSize="20" fill="white" fontWeight="bold">ArtVault</text>
              </svg>
            </div>
            
            {/* Header */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold font-display text-primary">ArtVault Profile</h2>
              <p className="text-gray-400 font-general-sans text-sm">Digital Identity Card</p>
            </div>
            
            {/* User Profile */}
            <div className="flex items-center space-x-4 mb-6">
              <img
                src={user?.picture}
                alt={user?.name}
                className="w-20 h-20 border-2 border-primary"
              />
              <div>
                <h3 className="text-xl font-bold font-display">{user?.name}</h3>
                <p className="text-gray-400 font-general-sans text-sm">{user?.email}</p>
              </div>
            </div>
            
            {/* Wallets with QR Codes */}
            <div className="space-y-4">
              {/* Solana Wallet */}
              {solanaWallet && (
                <div className="bg-white/5 p-4 border border-white/10">
                  <div className="flex items-start">
                    <div className="flex-grow">
                      <h4 className="text-md font-bold mb-1 font-display">Solana</h4>
                      <p className="text-gray-400 font-mono text-xs break-all">
                        {solanaWallet.toString()}
                      </p>
                    </div>
                    <div className="bg-white p-2 rounded-sm">
                      <QRCodeSVG 
                        value={solanaWallet.toString()} 
                        size={80} 
                        bgColor={"#FFFFFF"} 
                        fgColor={"#000000"} 
                        level={"L"} 
                        includeMargin={false}
                      />
                    </div>
                  </div>
                </div>
              )}
              
              {/* Ethereum Wallet */}
              {ethereumWallet && (
                <div className="bg-white/5 p-4 border border-white/10">
                  <div className="flex items-start">
                    <div className="flex-grow">
                      <h4 className="text-md font-bold mb-1 font-display">Ethereum</h4>
                      <p className="text-gray-400 font-mono text-xs break-all">
                        {ethereumWallet}
                      </p>
                    </div>
                    <div className="bg-white p-2 rounded-sm">
                      <QRCodeSVG 
                        value={ethereumWallet}
                        size={80} 
                        bgColor={"#FFFFFF"} 
                        fgColor={"#000000"} 
                        level={"L"} 
                        includeMargin={false}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Footer */}
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-400 font-general-sans">Scan QR codes to transfer assets</p>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex justify-between mt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-white/30 text-gray-400 hover:bg-white/5 transition-colors"
            >
              Close
            </button>
            <button
              onClick={downloadCard}
              disabled={downloading}
              className={`px-4 py-2 border-2 border-primary bg-primary/20 hover:bg-primary/30 text-white transition-colors flex items-center ${downloading ? 'opacity-70' : ''}`}
            >
              {downloading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                  </svg>
                  Download Card
                </>
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProfileCardModal;