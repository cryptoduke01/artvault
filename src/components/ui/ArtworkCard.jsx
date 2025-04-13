export default function ArtworkCard({ artwork, className = '' }) {
  return (
    <div className={`relative ${className}`}>
      {/* Main card */}
      <div className="relative bg-[#0A0A0A] border border-gray-800/30">
        {/* Time left badge */}
        <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-sm px-3 py-1 text-xs text-gray-300 z-10">
          5 days left
        </div>

        {/* Artwork Image Container */}
        <div className="relative aspect-square w-full overflow-hidden">
          <img
            src={artwork.image}
            alt={artwork.title}
            className="w-full h-full object-cover"
          />

          {/* Bottom gradient overlay */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/90 to-transparent" />

          {/* Bottom content */}
          <div className="absolute bottom-0 inset-x-0 p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="bg-black/40 backdrop-blur-sm p-1.5 rounded-full border border-gray-800/30">
                <div className="w-6 h-6 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center">
                  🎨
                </div>
              </div>
              <span className="text-white font-medium">{artwork.title}</span>
            </div>
            <span className="text-primary font-semibold">
              {artwork.price} SOL
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
