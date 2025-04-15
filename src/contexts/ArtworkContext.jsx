import { createContext, useContext, useState, useEffect } from 'react';
import { useUser } from "@civic/auth-web3/react";
import { supabase } from '../lib/supabaseClient';

const ArtworkContext = createContext();

export function ArtworkProvider({ children }) {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchArtworks = async () => {
    try {
      setLoading(true);
      const { data, error: supabaseError } = await supabase
        .from('artworks')
        .select('*')
        .order('created_at', { ascending: false });

      if (supabaseError) throw supabaseError;
      setArtworks(data || []);
    } catch (err) {
      console.error('Error in fetchArtworks:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch artworks when the provider mounts
  useEffect(() => {
    fetchArtworks();
  }, []); // Only run once when mounted

  const addArtwork = async (artworkData) => {
    try {
      const { data, error } = await supabase
        .from('artworks')
        .insert([artworkData])
        .select();

      if (error) throw error;
      setArtworks(prev => [data[0], ...prev]);
      return { data, error: null };
    } catch (err) {
      console.error('Error adding artwork:', err);
      return { data: null, error: err };
    }
  };

  return (
    <ArtworkContext.Provider value={{ artworks, loading, error, fetchArtworks, addArtwork }}>
      {children}
    </ArtworkContext.Provider>
  );
}

export function useArtworks() {
  const context = useContext(ArtworkContext);
  if (context === undefined) {
    throw new Error('useArtworks must be used within an ArtworkProvider');
  }
  return context;
} 