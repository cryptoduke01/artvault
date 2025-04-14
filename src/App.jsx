import { BrowserRouter as Router } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import { CivicAuthProvider } from '@civic/auth-web3/react';
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { Toaster } from 'react-hot-toast';
import { ArtworkProvider } from './contexts/ArtworkContext';
import Navbar from './components/layout/Navbar';
import Hero from './components/home/Hero';
import CreateArtwork from './components/marketplace/CreateArtwork';
import ArtworkGrid from './components/marketplace/ArtworkGrid';
import ArtworkDetail from './components/marketplace/ArtworkDetail';
import './styles/civic-button.css';

// You can change this to mainnet-beta for production
const endpoint = "https://api.devnet.solana.com";

function App() {
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={[]} autoConnect>
        <WalletModalProvider>
          <CivicAuthProvider clientId={import.meta.env.VITE_CIVIC_APP_ID}>
            <ArtworkProvider>
              <Router>
                <div className="min-h-screen bg-black text-white">
                  <Navbar />
                  <main className="pt-16">
                    <Routes>
                      <Route path="/" element={<Hero />} />
                      <Route path="/marketplace" element={<ArtworkGrid />} />
                      <Route path="/create" element={<CreateArtwork />} />
                      <Route path="/artwork/:id" element={<ArtworkDetail />} />
                    </Routes>
                  </main>
                  <Toaster
                    position="top-right"
                    toastOptions={{
                      style: {
                        background: '#333',
                        color: '#fff',
                        border: '1px solid #8B5CF6'
                      },
                    }}
                  />
                </div>
              </Router>
            </ArtworkProvider>
          </CivicAuthProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;