import { supabase } from '../lib/supabase/config';

export const artworkService = {
  async createArtwork(artworkData, userId, walletAddress) {
    // First upload image to Supabase Storage
    const { data: imageData, error: imageError } = await supabase.storage
      .from('artwork-images')
      .upload(`${userId}/${Date.now()}`, artworkData.image);

    if (imageError) throw imageError;

    // Then create artwork record
    const { data, error } = await supabase
      .from('artworks')
      .insert({
        title: artworkData.title,
        description: artworkData.description,
        price: artworkData.price,
        image_url: imageData.path,
        creator_id: userId,
        wallet_address: walletAddress,
        category: artworkData.category
      });

    if (error) throw error;
    return data;
  },

  async getArtworks(filters = {}) {
    let query = supabase
      .from('artworks')
      .select(`
        *,
        users (
          username,
          avatar_url
        )
      `);

    // Apply filters
    if (filters.category) {
      query = query.eq('category', filters.category);
    }

    const { data, error } = await query
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getArtworkById(id) {
    const { data, error } = await supabase
      .from('artworks')
      .select(`
        *,
        users (
          username,
          avatar_url
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }
}; 