import { BrowserRouter as Router } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import { CivicAuthProvider } from '@civic/auth-web3/react';
import { ArtworkProvider } from './contexts/ArtworkContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import Dashboard from '@/components/dashboard/Dashboard';
import CreateArtwork from '@/components/marketplace/CreateArtwork';
import ArtworkGrid from '@/components/marketplace/ArtworkGrid';
import ArtworkDetail from '@/components/marketplace/ArtworkDetail';
import './styles/civic-button.css';

function App() {
  return (
    <CivicAuthProvider clientId={import.meta.env.VITE_CIVIC_APP_ID}>
      <ArtworkProvider>
        <Router>
          <div className="min-h-screen flex flex-col bg-black text-white">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Hero />} />
                <Route path="/marketplace" element={<ArtworkGrid />} />
                <Route path="/create" element={<CreateArtwork />} />
                <Route path="/artwork/:id" element={<ArtworkDetail />} />
                <Route path="/dashboard" element={<Dashboard />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </ArtworkProvider>
    </CivicAuthProvider>
  );
}

export default App;