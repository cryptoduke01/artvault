import { useState, useEffect } from 'react';

export const useCryptoPrices = () => {
  const [prices, setPrices] = useState({
    solana: null,
    ethereum: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?ids=solana,ethereum&vs_currencies=usd'
        );
        const data = await response.json();
        setPrices({
          solana: data.solana.usd,
          ethereum: data.ethereum.usd,
          loading: false,
          error: null
        });
      } catch (error) {
        setPrices(prev => ({
          ...prev,
          loading: false,
          error: 'Failed to fetch prices'
        }));
      }
    };

    fetchPrices();
    // Refresh prices every 60 seconds
    const interval = setInterval(fetchPrices, 60000);
    return () => clearInterval(interval);
  }, []);

  return prices;
};

export const formatUSD = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

export const CryptoAmount = ({ amount, cryptoType, className = '' }) => {
  const { solana, ethereum, loading } = useCryptoPrices();

  const price = cryptoType.toLowerCase() === 'sol' ? solana : ethereum;
  const symbol = cryptoType.toUpperCase();

  if (loading || !price) {
    return <span className={className}>{amount} {symbol}</span>;
  }

  const usdValue = amount * price;

  return (
    <div className={`flex flex-col ${className}`}>
      <span>{amount} {symbol}</span>
      <span className="text-gray-400 text-sm">{formatUSD(usdValue)}</span>
    </div>
  );
}; 