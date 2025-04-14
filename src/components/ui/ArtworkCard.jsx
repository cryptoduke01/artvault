import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function ArtworkCard({ artwork, className = '' }) {
  return (
    <Link to={`/artwork/${artwork.id}`} className={`relative overflow-hidden ${className}`}>
      <img
        src={artwork.image_url}
        alt={artwork.title}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h3 className="text-xl font-bold">{artwork.title}</h3>
          <p className="text-primary font-bold">{artwork.price} SOL</p>
        </div>
      </div>
    </Link>
  );
}
