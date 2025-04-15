import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from "@civic/auth-web3/react";
import { supabase } from '../../lib/supabaseClient';
import LoadingSpinner from '../ui/LoadingSpinner';
import { motion } from 'framer-motion';

const ArtworkCard = ({ artwork }) => {
  return (
    <div className="bg-black/50 border-2 border-white/10">
      <div className="aspect-square w-full h-[200px] sm:h-[250px] md:h-[300px]">
        <img
          src={artwork.image_url}
          alt={artwork.title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4 space-y-3">
        <div>
          <h3 className="text-lg font-bold font-display truncate">{artwork.title}</h3>
          <p className="text-gray-400 text-sm font-general-sans truncate">
            By: {artwork.users?.name || 'Anonymous'}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-primary font-bold text-xl">{artwork.price} SOL</p>
          <Link
            to={`/artwork/${artwork.id}`}
            className="px-4 py-2 border-2 border-primary text-white hover:bg-primary/10 transition-colors font-general-sans text-sm"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

const ArtworkGrid = () => {
  const { user } = useUser();
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArtworks = async () => {
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
          .order('created_at', { ascending: false });

        if (error) throw error;
        setArtworks(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArtworks();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold mb-8 mt-8 font-display"
      >
        Digital Art Marketplace
      </motion.h2>

      {artworks.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-400 text-lg font-general-sans">No artworks available yet</p>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8"
        >
          {artworks.map((artwork) => (
            <motion.div
              key={artwork.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ArtworkCard artwork={artwork} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default ArtworkGrid;
