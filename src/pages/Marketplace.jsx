// src/pages/Marketplace.jsx
import { ArtGrid } from '../components/marketplace/ArtGrid';

export const Marketplace = () => {
  const mockItems = [
    {
      id: 1,
      title: "Cyberpunk Girl",
      imageUrl: "/path-to-image.jpg",
      daysLeft: 5,
      currentBid: 1.7,
    },
    // Add more mock items as needed
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-purple-600 pt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold text-white mb-8">Featured Artworks</h2>
        <ArtGrid items={mockItems} />
      </div>
    </div>
  );
};