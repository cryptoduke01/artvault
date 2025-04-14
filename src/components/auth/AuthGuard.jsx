import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@civic/auth-web3/react';
import { toast } from 'sonner';
import { UserButton } from "@civic/auth-web3/react";

export default function AuthGuard({ children }) {
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      toast.error('Authentication Required', {
        description: 'Please sign in to access this page',
      });
      navigate('/');
    }
  }, [user, navigate]);

  if (!user) {
    return (
      <div className="min-h-screen pt-24 px-4">
        <div className="max-w-md mx-auto text-center space-y-6 p-8 bg-[#1A1A1A] border border-gray-800/50 rounded-lg">
          <h2 className="text-2xl font-bold">Authentication Required</h2>
          <p className="text-gray-400">Please sign in to access this feature</p>
          <div className="civic-button-container flex justify-center">
            <UserButton
              style={{
                border: '2px solid #6b7280',
                borderRadius: '0',
                background: 'transparent',
                padding: '8px 24px',
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  return children;
} 