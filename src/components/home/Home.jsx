import { Link } from 'react-router-dom';
import { useUser } from "@civic/auth-web3/react";

const Home = () => {
  const { user } = useUser();

  return (
    <div className="container mx-auto px-4">
      <div className="min-h-[80vh] flex flex-col md:flex-row items-center justify-between py-12">
        {/* Left Side - Text Content */}
        <div className="md:w-1/2 space-y-6 text-center md:text-left mb-8 md:mb-0">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Discover and Collect
            <span className="text-primary"> Digital Art</span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-md">
            ArtVault is your gateway to the world of digital art. Buy, sell, and showcase your creations.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center md:justify-start">
            <Link
              to="/marketplace"
              className="px-8 py-3 bg-primary text-white hover:bg-primary/80 transition-colors"
            >
              Explore
            </Link>
            {user && (
              <Link
                to="/list-artwork"
                className="px-8 py-3 border border-primary text-primary hover:bg-primary/10 transition-colors"
              >
                Create
              </Link>
            )}
          </div>
        </div>

        {/* Right Side - Featured Artwork */}
        <div className="md:w-1/2 flex justify-center">
          <div className="relative w-full max-w-lg">
            <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
            <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
            <div className="relative">
              <img
                src="/hero-art.png"
                alt="Featured Artwork"
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
