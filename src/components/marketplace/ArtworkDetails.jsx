import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from "@civic/auth-web3/react";

// Temporary mock data - will be replaced with actual data from database
const MOCK_ARTWORK = {
  id: 1,
  title: "Digital Dreams",
  artist: "Artist Name",
  price: "50",
  description: "A beautiful digital artwork that explores the intersection of technology and creativity. Created using various digital tools and techniques.",
  image: "https://placeholder.com/800",
  category: "digital-art",
  createdAt: "2024-02-20",
};

export default function ArtworkDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  // In real implementation, fetch artwork data based on id
  const artwork = MOCK_ARTWORK;

  const handlePurchase = async () => {
    if (!user) {
      alert('Please sign in to purchase artwork');
      return;
    }

    setLoading(true);
    try {
      // Here we'll implement the purchase logic later
      console.log('Purchasing artwork:', artwork);
      // For now just show success message
      alert('Purchase successful!');
      navigate('/marketplace');
    } catch (error) {
      console.error('Purchase failed:', error);
      alert('Purchase failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 pt-24 pb-12">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Artwork Image */}
        <div className="relative">
          <img
            src={artwork.image}
            alt={artwork.title}
            className="w-full rounded-2xl shadow-2xl"
          />
          <div className="absolute top-4 right-4">
            <span className="bg-gray-900/80 backdrop-blur-sm text-white px-4 py-2 rounded-full">
              {artwork.category}
            </span>
          </div>
        </div>

        {/* Artwork Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">{artwork.title}</h1>
            <p className="text-gray-400">by {artwork.artist}</p>
          </div>

          <div className="bg-gray-900/50 rounded-xl p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-400">Current Price</p>
                <p className="text-3xl font-bold text-primary">
                  {artwork.price} USDC
                </p>
              </div>
              <button
                onClick={handlePurchase}
                disabled={loading}
                className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-full disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Purchase Now'}
              </button>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-3">Description</h2>
            <p className="text-gray-300 leading-relaxed">
              {artwork.description}
            </p>
          </div>

          <div className="border-t border-gray-800 pt-6">
            <h2 className="text-xl font-semibold mb-3">Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-400">Category</p>
                <p className="text-gray-200">{artwork.category}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Created</p>
                <p className="text-gray-200">{artwork.createdAt}</p>
              </div>
            </div>
          </div>

          {/* Artist Info */}
          <div className="border-t border-gray-800 pt-6">
            <h2 className="text-xl font-semibold mb-3">About the Artist</h2>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-800 rounded-full"></div>
              <div>
                <p className="font-medium">{artwork.artist}</p>
                <p className="text-sm text-gray-400">Digital Artist</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
