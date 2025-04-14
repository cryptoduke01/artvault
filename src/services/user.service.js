import { supabase } from '../lib/supabase/config';

export const userService = {
  async createOrUpdateUser(civicUser, walletAddress) {
    const { data, error } = await supabase
      .from('users')
      .upsert({
        id: civicUser.id,
        wallet_address: walletAddress,
        username: civicUser.username,
        avatar_url: civicUser.avatar
      });

    if (error) throw error;
    return data;
  },

  async getUserByWallet(walletAddress) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('wallet_address', walletAddress)
      .single();

    if (error) throw error;
    return data;
  }
}; 