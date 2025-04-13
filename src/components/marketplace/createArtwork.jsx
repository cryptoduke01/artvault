import { useState } from 'react';
import { useUser } from "@civic/auth-web3/react";
import { UserButton } from "@civic/auth-web3/react";
import { useNavigate } from 'react-router-dom';

export default function CreateArtwork() {
  const { user } = useUser();
  const navigate = useNavigate();

  const [artworkData, setArtworkData] = useState({
    title: '',
    description: '',
    price: '',
    category: 'digital-art',
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setArtworkData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please sign in to upload artwork');
      return;
    }

    setLoading(true);
    try {
      // Here we'll add the artwork upload logic later
      // For now just console.log
      console.log('Uploading artwork:', { ...artworkData, image });
      navigate('/marketplace');
    } catch (error) {
      console.error('Failed to upload artwork:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Sign In Required</h2>
          <p className="text-gray-400">Please sign in to upload your artwork</p>
          <div className="px-12 py-12 civic-button-container">
                <UserButton
                  style={{
                    border: '2px solid #6b7280',
                    borderRadius: '0',
                    background: 'transparent',
                    padding: '8px 24px',
                    width: '100%',
                  }}
                />
              </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 pt-24">
      <h2 className="text-3xl font-bold mb-8">Upload Your Artwork</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Artwork Image</label>
          <div className="border-2 border-dashed border-gray-700 rounded-lg p-4">
            {image ? (
              <div className="relative">
                <img src={image} alt="Preview" className="max-h-64 mx-auto rounded-lg" />
                <button
                  type="button"
                  onClick={() => setImage(null)}
                  className="absolute top-2 right-2 bg-red-500 p-2 rounded-full"
                >
                  ×
                </button>
              </div>
            ) : (
              <div className="text-center py-12">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="artwork-upload"
                />
                <label
                  htmlFor="artwork-upload"
                  className="cursor-pointer text-primary hover:text-primary/80"
                >
                  <div className="space-y-2">
                    <span className="block">Click to upload image</span>
                    <span className="text-sm text-gray-400">PNG, JPG, GIF up to 10MB</span>
                  </div>
                </label>
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Title</label>
          <input
            type="text"
            name="title"
            value={artworkData.title}
            onChange={handleInputChange}
            className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            name="description"
            value={artworkData.description}
            onChange={handleInputChange}
            rows={4}
            className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Price (USDC)</label>
          <input
            type="number"
            name="price"
            value={artworkData.price}
            onChange={handleInputChange}
            step="0.01"
            min="0"
            className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Category</label>
          <select
            name="category"
            value={artworkData.category}
            onChange={handleInputChange}
            className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2"
          >
            <option value="digital-art">Digital Art</option>
            <option value="illustration">Illustration</option>
            <option value="photography">Photography</option>
            <option value="3d">3D Art</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading || !image}
          className="w-full bg-primary hover:bg-primary/90 text-white py-3 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Uploading...' : 'Upload Artwork'}
        </button>
      </form>
    </div>
  );
}