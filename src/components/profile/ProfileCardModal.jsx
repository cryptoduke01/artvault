import { useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import html2canvas from 'html2canvas';
import SolanaLogo from '../icons/SolanaLogo';
import EthereumLogo from '../icons/EthereumLogo';
import CopyButton from '../ui/CopyButton';
import { toast } from 'react-hot-toast';

const getInitials = (name) => {
  if (!name) return 'A';
  return name.charAt(0).toUpperCase();
};

const getRandomGradient = (text) => {
  // Create a deterministic gradient based on the text
  const colors = [
    ['#FF6B6B', '#4ECDC4'], // red to teal
    ['#A8E6CF', '#FFD3B6'], // mint to peach
    ['#CAB8FF', '#FF9CEE'], // purple to pink
    ['#FFD93D', '#FF8E9E'], // yellow to pink
    ['#6C63FF', '#FF6584'], // indigo to pink
    ['#4FACFE', '#00F2FE'], // blue to cyan
    ['#43E97B', '#38F9D7'], // green to cyan
    ['#FA709A', '#FEE140'], // pink to yellow
    ['#6A11CB', '#2575FC'], // purple to blue
    ['#FF0844', '#FFB199']  // red to peach
  ];

  // Use the first character's code as a seed
  const seed = text.charCodeAt(0) % colors.length;
  return colors[seed];
};

const AvatarFallback = ({ name, size = 80 }) => {
  const [gradient] = useMemo(() => {
    const [color1, color2] = getRandomGradient(name);
    return [`linear-gradient(135deg, ${color1}, ${color2})`];
  }, [name]);

  return (
    <div
      className="flex items-center justify-center font-bold text-white"
      style={{
        background: gradient,
        width: size,
        height: size,
        fontSize: size * 0.4,
      }}
    >
      {getInitials(name)}
    </div>
  );
};

const ProfileCardModal = ({ isOpen, onClose, user, solanaWallet, ethereumWallet }) => {
  const [downloading, setDownloading] = useState(false);
  const cardRef = useRef(null);

  const downloadCard = async () => {
    if (!cardRef.current) return;

    try {
      setDownloading(true);
      toast.loading('Generating card...');

      // Wait for images to load
      const images = cardRef.current.getElementsByTagName('img');
      await Promise.all(
        Array.from(images).map(
          (img) =>
            new Promise((resolve) => {
              if (img.complete) {
                resolve();
              } else {
                img.onload = resolve;
                img.onerror = resolve; // Handle error case as well
              }
            })
        )
      );

      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2, // Higher quality
        logging: false,
        useCORS: true, // Enable CORS for images
        allowTaint: true,
      });

      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = `${user.name}-artvault-card.png`;
      link.click();
      toast.dismiss();
      toast.success('Card downloaded successfully!');
    } catch (error) {
      console.error("Error generating image:", error);
      toast.error('Failed to generate card');
    } finally {
      setDownloading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-[#1a1a1a] border-2 border-primary/20 p-6 max-w-md w-full mx-4"
        >
          {/* Profile Card */}
          <div
            ref={cardRef}
            className="bg-gradient-to-br from-black to-gray-900 border-2 border-white/10 p-6 relative overflow-hidden"
          >

            {/* Header */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold font-display text-primary">ArtVault Profile</h2>
              <p className="text-gray-400 font-general-sans text-sm">Digital Identity Card</p>
            </div>

            {/* User Profile */}
            <div className="flex items-center space-x-4 mb-6">
              {user?.picture ? (
                <img
                  src={user.picture}
                  alt={user.name}
                  className="w-20 h-20 border-2 border-primary"
                  crossOrigin="anonymous" // Add this to handle CORS
                />
              ) : (
                <AvatarFallback name={user?.name} size={80} />
              )}
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
                  <div className="flex items-start justify-between">
                    <div className="flex-grow">
                      <div className="flex items-center space-x-2 mb-2">
                        <SolanaLogo className="w-4 h-4" />
                        <h4 className="text-md font-bold font-display">Solana</h4>
                      </div>
                      <div className="flex items-center">
                        <p className="text-gray-400 font-mono text-xs break-all">
                          {solanaWallet.toString()}
                        </p>
                        <CopyButton
                          text={solanaWallet.toString()}
                          onCopy={() => toast.success('SOL address copied!')}
                        />
                      </div>
                    </div>
                    <div className="ml-4 bg-white p-2 rounded-sm">
                      <QRCodeSVG
                        value={solanaWallet.toString()}
                        size={64}
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
                  <div className="flex items-start justify-between">
                    <div className="flex-grow">
                      <div className="flex items-center space-x-2 mb-2">
                        <EthereumLogo className="w-4 h-4" />
                        <h4 className="text-md font-bold font-display">Ethereum</h4>
                      </div>
                      <div className="flex items-center">
                        <p className="text-gray-400 font-mono text-xs break-all">
                          {ethereumWallet}
                        </p>
                        <CopyButton
                          text={ethereumWallet}
                          onCopy={() => toast.success('ETH address copied!')}
                        />
                      </div>
                    </div>
                    <div className="ml-4 bg-white p-2 rounded-sm">
                      <QRCodeSVG
                        value={ethereumWallet}
                        size={64}
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

            {/* Footer with Civic branding */}
            <div className="mt-6 pt-4 border-t border-white/10">
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-400 font-general-sans">
                  Scan QR codes to transfer assets
                </p>
                <div className="flex items-center space-x-1 text-gray-400">
                  <span className="text-xs">Powered by Civic</span>
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                </div>
              </div>
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
      </div>
    </AnimatePresence>
  );
};

export default ProfileCardModal;