import { useState } from 'react';
import { Link } from 'react-router-dom';

// Temporary mock data
const MOCK_ARTWORKS = [
  {
    id: 1,
    title: "Digital Dreams",
    artist: "Artist Name",
    price: "50",
    image: "https://placeholder.com/400",
    category: "digital-art"
  },
  // Add more mock items
];

export default function Marketplace() {
  const [filter, setFilter] = useState('all');

  return (
    <div className="container mx-auto px-4 pt-24">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">Digital Art Marketplace</h2>
        <div className="flex gap-4">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-gray-900 border border-gray-800 rounded-lg px-4 py-2"
          >
            <option value="all">All Categories</option>
            <option value="digital-art">Digital Art</option>
            <option value="illustration">Illustration</option>
            <option value="photography">Photography</option>
            <option value="3d">3D Art</option>
          </select>
          <Link
            to="/create"
            className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-full"
          >
            Upload Artwork
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {MOCK_ARTWORKS.map((artwork) => (
          <Link
            key={artwork.id}
            to={`/artwork/${artwork.id}`}
            className="bg-gray-900 rounded-xl overflow-hidden hover:transform hover:scale-105 transition-transform duration-200"
          >
            <img
              src={artwork.image}
              alt={artwork.title}
              className="w-full aspect-square object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold">{artwork.title}</h3>
              <p className="text-gray-400">{artwork.artist}</p>
              <div className="flex justify-between items-center mt-2">
                <span className="text-primary font-bold">{artwork.price} USDC</span>
                <button className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm">
                  View Details
                </button>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
