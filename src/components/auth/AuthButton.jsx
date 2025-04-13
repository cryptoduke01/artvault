// src/components/auth/AuthButton.jsx
import { useUser } from "@civic/auth-web3/react";
import { motion } from 'framer-motion';
import '../styles/civic-button.css';

export function CustomAuthButton() {
  const { user, signIn, signOut } = useUser();

  const handleAuth = async () => {
    if (user) {
      await signOut();
    } else {
      await signIn();
    }
  };

  return (
    <motion.button
      onClick={handleAuth}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="px-6 py-2 border-2 border-gray-800 hover:border-primary hover:bg-primary/10 text-white transition-all duration-300"
    >
      {user ? (
        <div className="flex items-center space-x-2">
          {user.picture && (
            <img
              src={user.picture}
              alt={user.name}
              className="w-6 h-6 object-cover"
            />
          )}
          <span>{user.name}</span>
        </div>
      ) : (
        'Sign in'
      )}
    </motion.button>
  );
}