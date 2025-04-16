import { useState } from 'react';
import { useUser } from "@civic/auth-web3/react";
import { supabase } from '../../lib/supabaseClient';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const LoadingSpinner = () => (
  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

const CreateArtwork = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.email || !file) return;

    const toastId = toast.loading('Creating your artwork...');

    try {
      setUploading(true);

      // First, check if user exists
      const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('email')
        .eq('email', user.email)
        .single();

      // If user doesn't exist, create them
      if (!existingUser) {
        const { error: userError } = await supabase
          .from('users')
          .insert({
            email: user.email,
            name: user.name || user.email.split('@')[0],
            avatar_url: user.picture
          });

        if (userError) throw userError;
      }

      // Upload image to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('artworks')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('artworks')
        .getPublicUrl(fileName);

      // Create artwork record
      const { data: artwork, error: insertError } = await supabase
        .from('artworks')
        .insert({
          title,
          description,
          price: parseFloat(price),
          image_url: publicUrl,
          creator_email: user.email
        })
        .select()
        .single();

      if (insertError) throw insertError;

      toast.success('Artwork created successfully!', { id: toastId });

      await new Promise(resolve => setTimeout(resolve, 2000));
      navigate('/marketplace');

    } catch (error) {
      console.error('Error creating artwork:', error);
      toast.error(error.message || 'Error creating artwork', { id: toastId });
    } finally {
      setUploading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-lg text-gray-600">Please sign in to create artwork</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 pt-24">
      <h1 className="text-3xl font-bold mb-8 border-b border-white/10 pb-4">Create New Artwork</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column - Form Fields */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 bg-black border border-white/10 focus:border-primary transition-colors outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 bg-black border border-white/10 focus:border-primary transition-colors outline-none h-32"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-200">
                Price (SOL)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                name="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full bg-white/5 border-2 border-white/10 focus:border-primary focus:ring-1 focus:ring-primary/50 text-white px-4 py-2"
                placeholder="Enter price in SOL"
              />
            </div>
          </div>

          {/* Right Column - Image Upload */}
          <div>
            <label className="block text-sm font-medium mb-2">Artwork Image</label>
            <div className="border border-white/10 p-4">
              {preview ? (
                <div className="relative">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-64 object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setFile(null);
                      setPreview(null);
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 border border-dashed border-white/20">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                    id="artwork-upload"
                    required
                  />
                  <label
                    htmlFor="artwork-upload"
                    className="cursor-pointer flex flex-col items-center justify-center w-full h-full"
                  >
                    <svg
                      className="w-12 h-12 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    <span className="mt-2 text-gray-500">Click to upload artwork</span>
                  </label>
                </div>
              )}
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={uploading}
          className="w-full py-3 bg-primary hover:bg-primary/90 disabled:bg-primary/50 
            transition-all flex items-center justify-center space-x-2 h-12"
        >
          {uploading ? (
            <>
              <LoadingSpinner />
              <span>Creating Artwork...</span>
            </>
          ) : (
            <span>Create Artwork</span>
          )}
        </button>
      </form>
    </div>
  );
};

export default CreateArtwork;