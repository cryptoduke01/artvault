import { useUser } from "@civic/auth-web3/react";
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useUser();

  return (
    <div className="container mx-auto px-4 pt-24">
      <div className="max-w-6xl mx-auto">
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-800/50">
          <h1 className="text-3xl font-bold mb-8">Welcome, {user?.name || 'Artist'}!</h1>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Quick Actions */}
            <div className="bg-gray-800/50 rounded-xl p-6 space-y-4">
              <h2 className="text-xl font-semibold">Quick Actions</h2>
              <div className="space-y-2">
                <Link
                  to="/create"
                  className="block w-full bg-primary hover:bg-primary/90 text-white py-2 px-4 rounded-lg text-center"
                >
                  Upload New Artwork
                </Link>
                <Link
                  to="/collections"
                  className="block w-full bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg text-center"
                >
                  View My Collection
                </Link>
              </div>
            </div>

            {/* Stats */}
            <div className="bg-gray-800/50 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">Your Stats</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-gray-400">Artworks Listed</p>
                  <p className="text-2xl font-bold">0</p>
                </div>
                <div>
                  <p className="text-gray-400">Total Sales</p>
                  <p className="text-2xl font-bold">0 USDC</p>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-gray-800/50 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
              <div className="text-gray-400 text-center py-8">
                No recent activity
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
