import { motion } from 'framer-motion';

const LoadingSpinner = ({ size = 'md', light = true }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className={`${sizeClasses[size]} border-2 rounded-full 
        border-primary/20 border-t-primary animate-spin`}
      />
    </div>
  );
};

export default LoadingSpinner;
