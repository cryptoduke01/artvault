import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabaseClient';
import ArtworkCard from '../ui/ArtworkCard';
import LoadingSpinner from '../ui/LoadingSpinner';

export default function ArtworkGrid() {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        const { data, error } = await supabase
          .from('artworks')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setArtworks(data || []);
      } catch (error) {
        console.error('Error fetching artworks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArtworks();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen pt-24">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center min-h-[400px]">
            <LoadingSpinner size="lg" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 font-display">Marketplace</h1>

        {!artworks?.length ? (
          <div className="text-center py-12 bg-white/5 border-2 border-white/10">
            <p className="text-gray-400">No artworks available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {artworks.map((artwork) => (
              <motion.div
                key={artwork.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <ArtworkCard artwork={artwork} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
