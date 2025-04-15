import { BrowserRouter as Router } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import { CivicAuthProvider } from '@civic/auth-web3/react';
import { ArtworkProvider } from './contexts/ArtworkContext';
import Navbar from './components/layout/Navbar.jsx';
import Footer from './components/layout/Footer.jsx';
import Hero from './components/home/Hero.jsx';
import Dashboard from './components/dashboard/Dashboard.jsx';
import CreateArtwork from './components/marketplace/CreateArtwork.jsx';
import ArtworkGrid from './components/marketplace/ArtworkGrid.jsx';
import ArtworkDetail from './components/marketplace/ArtworkDetail.jsx';
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