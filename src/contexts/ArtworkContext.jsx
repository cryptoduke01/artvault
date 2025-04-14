import { createContext, useContext, useState, useEffect } from 'react';
import { useUser } from "@civic/auth-web3/react";
import { supabase } from '../lib/supabaseClient';

const ArtworkContext = createContext();

export function ArtworkProvider({ children }) {
  const { user } = useUser();
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchArtworks = async () => {
    try {
      const { data, error } = await supabase
        .from('artworks')
        .select(`
          id,
          title,
          description,
          price,
          image_url,
          created_at,
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
      console.error('Error fetching artworks:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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

  useEffect(() => {
    fetchArtworks();
  }, []);

  const value = {
    artworks,
    loading,
    error,
    fetchArtworks,
    addArtwork
  };

  return (
    <ArtworkContext.Provider value={value}>
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