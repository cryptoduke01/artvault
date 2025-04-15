import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabaseClient';
import toast from 'react-hot-toast';

const ArtworkGrid = () => {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        setLoading(true);
        console.log('Fetching artworks...');

        // First get artworks
        const { data: artworksData, error: artworksError } = await supabase
          .from('artworks')
          .select('*')
          .order('created_at', { ascending: false });

        if (artworksError) throw artworksError;

        // Then get all unique creator emails
        const creatorEmails = [...new Set(artworksData.map(a => a.creator_email))];

        // Fetch user data for those emails
        const { data: usersData, error: usersError } = await supabase
          .from('users')
          .select('email, name, avatar_url')
          .in('email', creatorEmails);

        if (usersError) throw usersError;

        // Create a map of user data by email
        const userMap = Object.fromEntries(
          usersData.map(user => [user.email, user])
        );

        // Combine artwork data with user data
        const artworksWithUsers = artworksData.map(artwork => ({
          ...artwork,
          creator: userMap[artwork.creator_email] || null
        }));

        console.log('Processed artworks:', artworksWithUsers);
        setArtworks(artworksWithUsers);
      } catch (err) {
        console.error('Error:', err);
        setError(err.message);
        toast.error('Failed to load artworks');
      } finally {
        setLoading(false);
      }
    };

    fetchArtworks();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin h-8 w-8 text-primary border-2 border-current border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-24">
        <div className="text-center text-red-500">
          Error loading artworks: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-24">
      <h1 className="text-4xl font-bold mb-8 font-display">Explore Artworks</h1>
      {(!artworks || artworks.length === 0) ? (
        <div className="text-center py-12 bg-white/5 border-2 border-white/10">
          <p className="text-gray-400">No artworks available yet</p>
          <Link
            to="/create"
            className="inline-block mt-4 px-6 py-3 bg-primary text-white hover:bg-primary/80 transition-colors"
          >
            Create First Artwork
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {artworks.map((artwork) => (
            <Link
              key={artwork.id}
              to={`/artwork/${artwork.id}`}
              className="group"
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white/5 border-2 border-white/10 group-hover:border-primary transition-colors"
              >
                <div className="aspect-square relative overflow-hidden">
                  <img
                    src={artwork.image_url}
                    alt={artwork.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold font-display">{artwork.title}</h3>
                  <p className="text-gray-400 mt-1 font-general-sans">{artwork.description}</p>
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-primary font-bold">{artwork.price} SOL</p>
                    {artwork.creator && (
                      <div className="flex items-center space-x-2">
                        {artwork.creator.avatar_url && (
                          <img
                            src={artwork.creator.avatar_url}
                            alt={artwork.creator.name}
                            className="w-6 h-6 rounded-full"
                          />
                        )}
                        <span className="text-sm text-gray-400">
                          {artwork.creator.name || 'Unknown Artist'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default ArtworkGrid;
