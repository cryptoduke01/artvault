import { useState, useEffect } from 'react';

export function useCryptoPrices() {
  const [prices, setPrices] = useState({
    solana: { usd: 0 },
    ethereum: { usd: 0 }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        // Fetch SOL and ETH prices from Binance API
        const [solResponse, ethResponse] = await Promise.all([
          fetch('https://api.binance.com/api/v3/ticker/price?symbol=SOLUSDT'),
          fetch('https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDT')
        ]);

        const solData = await solResponse.json();
        const ethData = await ethResponse.json();

        setPrices({
          solana: { usd: parseFloat(solData.price) },
          ethereum: { usd: parseFloat(ethData.price) }
        });
      } catch (error) {
        console.error('Failed to fetch prices:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  return { prices, loading };
}

export const formatUSD = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

export const CryptoAmount = ({ amount, cryptoType, className = '' }) => {
  const { prices, loading } = useCryptoPrices();
  const symbol = cryptoType.toUpperCase();

  if (loading || !prices) {
    return <span className={className}>{amount} {symbol}</span>;
  }

  const price = cryptoType.toLowerCase() === 'sol'
    ? prices.solana.usd
    : prices.ethereum.usd;

  const usdValue = amount * price;

  return (
    <div className={`flex flex-col ${className}`}>
      <span>{amount} {symbol}</span>
      <span className="text-gray-400 text-sm">{formatUSD(usdValue)}</span>
    </div>
  );
}; 