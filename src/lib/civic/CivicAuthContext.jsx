import { createContext, useContext, useState, useEffect } from 'react';
import { CivicAuth } from '@civic/auth-web3';

const CivicAuthContext = createContext({});

export function CivicAuthProvider({ children }) {
  const [auth, setAuth] = useState(null);
  const [user, setUser] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initCivic = async () => {
      try {
        const civicAuth = new CivicAuth({
          appId: import.meta.env.VITE_CIVIC_APP_ID,
          walletOptions: {
            provider: 'solana',
            network: 'devnet', // or 'mainnet' for production
          },
        });

        setAuth(civicAuth);

        // Check if user is already authenticated
        const session = await civicAuth.getSession();
        if (session) {
          setUser(session.user);
          setWallet(session.wallet);
        }
      } catch (error) {
        console.error('Failed to initialize Civic Auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initCivic();
  }, []);

  const login = async () => {
    try {
      const { user, wallet } = await auth.signIn();
      setUser(user);
      setWallet(wallet);
      return { user, wallet };
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await auth.signOut();
      setUser(null);
      setWallet(null);
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  };

  return (
    <CivicAuthContext.Provider
      value={{
        auth,
        user,
        wallet,
        loading,
        login,
        logout,
        isAuthenticated: !!user
      }}
    >
      {children}
    </CivicAuthContext.Provider>
  );
}

export const useCivicAuth = () => useContext(CivicAuthContext);
