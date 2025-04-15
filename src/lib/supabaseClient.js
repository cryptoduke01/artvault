import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)

// Updated function with correct Supabase auth methods
export const syncUserWithSupabase = async (civicUser) => {
  if (!civicUser?.email) return;

  try {
    // First try to sign in with Civic email
    const { data: authData, error: authError } = await supabase.auth.signInWithOtp({
      email: civicUser.email,
      options: {
        data: {
          name: civicUser.name,
          avatar_url: civicUser.picture
        }
      }
    });

    if (authError) {
      console.error('Auth error:', authError);
      return;
    }

    // Then upsert the user data into our users table
    const { error: upsertError } = await supabase
      .from('users')
      .upsert({
        email: civicUser.email,
        name: civicUser.name,
        avatar_url: civicUser.picture
      }, {
        onConflict: 'email',
        returning: 'minimal'
      });

    if (upsertError) {
      console.error('Upsert error:', upsertError);
    }

  } catch (error) {
    console.error('Error syncing user:', error);
  }
};
