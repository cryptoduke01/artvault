import { supabase } from '../../lib/supabase/config';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export default function SupabaseTest() {
  const [connectionStatus, setConnectionStatus] = useState('checking');

  useEffect(() => {
    async function testConnection() {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('count')
          .single();

        if (error) throw error;

        setConnectionStatus('connected');
        toast.success('Supabase connected successfully!');
      } catch (error) {
        console.error('Supabase connection error:', error);
        setConnectionStatus('error');
        toast.error('Failed to connect to Supabase', {
          description: error.message
        });
      }
    }

    testConnection();
  }, []);

  return (
    <div className="p-4">
      <h2>Supabase Connection Status: {connectionStatus}</h2>
    </div>
  );
} 