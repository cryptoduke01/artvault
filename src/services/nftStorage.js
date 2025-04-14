const API_BASE_URL = 'https://preserve.nft.storage/api/v1';
const API_KEY = import.meta.env.VITE_NFT_STORAGE_KEY;

export const nftStorageService = {
  // Create a new collection
  async createCollection(name) {
    try {
      const response = await fetch(`${API_BASE_URL}/collection/create_collection`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
          contractAddress: `artvault_${Date.now()}`, // Unique string for Solana
          collectionName: name,
          chainID: "1", // Using Solana
          network: "Solana"
        })
      });
      return await response.json();
    } catch (error) {
      console.error('Error creating collection:', error);
      throw error;
    }
  },

  // Upload artwork to collection
  async uploadArtwork(collectionId, file, metadata) {
    try {
      // First upload file to get CID
      const formData = new FormData();
      formData.append('file', file);

      const uploadResponse = await fetch('https://api.nft.storage/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`
        },
        body: formData
      });

      const { cid } = await uploadResponse.json();

      // Create CSV content
      const csvContent = `tokenAddress,cid\n${metadata.tokenAddress},${cid}`;
      const csvFile = new File([csvContent], 'tokens.csv', { type: 'text/csv' });

      // Add token to collection
      const tokenFormData = new FormData();
      tokenFormData.append('collectionID', collectionId);
      tokenFormData.append('file', csvFile);

      const response = await fetch(`${API_BASE_URL}/collection/add_tokens`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`
        },
        body: tokenFormData
      });

      return await response.json();
    } catch (error) {
      console.error('Error uploading artwork:', error);
      throw error;
    }
  },

  // List all collections
  async listCollections() {
    try {
      const response = await fetch(`${API_BASE_URL}/collection/list_collections`, {
        headers: {
          'Authorization': `Bearer ${API_KEY}`
        }
      });
      return await response.json();
    } catch (error) {
      console.error('Error listing collections:', error);
      throw error;
    }
  },

  // List tokens in a collection
  async listTokens(collectionId, lastKey = undefined) {
    try {
      const url = new URL(`${API_BASE_URL}/collection/list_tokens`);
      url.searchParams.append('collectionID', collectionId);
      if (lastKey) url.searchParams.append('lastKey', lastKey);

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${API_KEY}`
        }
      });
      return await response.json();
    } catch (error) {
      console.error('Error listing tokens:', error);
      throw error;
    }
  }
};
