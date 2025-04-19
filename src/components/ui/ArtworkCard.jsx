import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CryptoAmount } from '../../hooks/useCryptoPrices';

export default function ArtworkCard({ artwork, className = '' }) {
  return (
    <Link
      to={`/artwork/${artwork.id}`}
      className={`block bg-white/5 border-2 border-white/10 hover:border-primary/50 
        transition-all ${className}`}
    >
      <div className="relative pt-[100%] overflow-hidden">
        <img
          src={artwork.image_url}
          alt={artwork.title}
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
      </div>
      <div className="p-4 space-y-2">
        <h3 className="text-lg font-bold line-clamp-1">{artwork.title}</h3>
        <p className="text-gray-400 text-sm line-clamp-2 min-h-[2.5rem]">
          {artwork.description}
        </p>
        <div className="flex items-center justify-between pt-2">
          <CryptoAmount
            amount={artwork.price}
            cryptoType="SOL"
            className="text-primary font-bold"
          />
          <span className="text-xs text-gray-400">#{artwork.id.slice(0, 6)}</span>
        </div>
      </div>
    </Link>
  );
}
