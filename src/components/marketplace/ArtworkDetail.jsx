import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useUser } from "@civic/auth-web3/react";
import { supabase } from '../../lib/supabaseClient';
import LoadingSpinner from '../ui/LoadingSpinner';
import { motion } from 'framer-motion';

const ArtworkDetail = () => {
  const { id } = useParams();
  const { user } = useUser();
  const [artwork, setArtwork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [solPrice, setSolPrice] = useState(null);

  useEffect(() => {
    const fetchSolPrice = async () => {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd');
        const data = await response.json();
        setSolPrice(data.solana.usd);
      } catch (err) {
        console.error('Error fetching SOL price:', err);
      }
    };

    const fetchArtwork = async () => {
      try {
        const { data, error } = await supabase
          .from('artworks')
          .select(`
            *,
            users (
              id,
              name,
              email,
              avatar_url
            )
          `)
          .eq('id', id)
          .single();

        if (error) throw error;
        setArtwork(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchArtwork();
    fetchSolPrice();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (!artwork) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-400">Artwork not found</p>
      </div>
    );
  }

  const usdPrice = solPrice ? (parseFloat(artwork.price) * solPrice).toFixed(2) : null;

  return (
    <div className="container mx-auto px-4 py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid lg:grid-cols-[1fr,400px] gap-8 lg:gap-12 items-start"
      >
        {/* Left Column - Image */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative bg-black/50"
        >
          <div className="max-h-[70vh] overflow-hidden">
            <img
              src={artwork.image_url}
              alt={artwork.title}
              className="w-full h-full object-contain border-2 border-white/10"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
        </motion.div>

        {/* Right Column - Details */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6 lg:sticky lg:top-24"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4 font-display">{artwork.title}</h1>
            <div className="flex items-center space-x-4 bg-white/5 p-4 border-2 border-white/10">
              <img
                src={artwork.users?.avatar_url}
                alt={artwork.users?.name}
                className="w-12 h-12 rounded-none border-2 border-primary"
              />
              <div className="font-general-sans">
                <p className="text-gray-400">Created by</p>
                <p className="font-bold">{artwork.users?.name}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 p-6 border-2 border-white/10">
            <p className="text-gray-400 mb-2 font-general-sans">Description</p>
            <p className="text-lg">{artwork.description}</p>
          </div>

          <div className="bg-white/5 p-6 border-2 border-white/10">
            <p className="text-gray-400 mb-2 font-general-sans">Price</p>
            <div className="space-y-2">
              <p className="text-4xl font-bold text-primary">{artwork.price} SOL</p>
              {usdPrice && (
                <p className="text-gray-400">≈ ${usdPrice} USD</p>
              )}
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-primary text-white px-8 py-4 hover:bg-primary/80 transition-colors border-2 border-primary hover:border-primary/80 font-general-sans"
          >
            Purchase Now
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ArtworkDetail;
