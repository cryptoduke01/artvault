import { CivicAuthProvider, UserButton } from "@civic/auth-web3/react";
import Navbar from './components/layout/Navbar';
import Hero from './components/home/Hero';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Marketplace from './components/marketplace/Marketplace';
import CreateArtwork from './components/marketplace/CreateArtwork';
import ArtworkDetails from './components/marketplace/ArtworkDetails';
import Dashboard from './components/dashboard/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <CivicAuthProvider clientId={import.meta.env.VITE_CIVIC_APP_ID}>
        <div className="min-h-screen bg-black">
          <Navbar />
          <Routes>
            <Route path="/" element={<Hero />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/create" element={<CreateArtwork />} />
            <Route path="/artwork/:id" element={<ArtworkDetails />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </div>
      </CivicAuthProvider>
    </BrowserRouter>
  );
}

export default App;