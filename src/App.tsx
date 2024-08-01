import { useEffect, useState } from 'react';
import axios from 'axios';

interface Beer {
  id: number;
  name: string;
  rating: {
    average: number;
    reviews: number;
  };
  price: string;
  image: string;
}

const parsePrice = (price: string): number => {
  return parseFloat(price.replace(/[^0-9.]/g, ''));
};

export default function App() {
  const [data, setData] = useState<Beer[]>([]);
  const [selectedBeerId, setSelectedBeerId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getData = async () => {
    try {
      const response = await axios.get<Beer[]>('https://api.sampleapis.com/beers/ale');
      const filteredData = response.data
        .filter(beer => beer.rating.average > 4.5)
        .sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
      setData(filteredData);
      setError(null);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const selectedBeer = data.find(beer => beer.id === selectedBeerId) || null;

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
      <div style={{
        border: '1px solid #000000',
        padding: '20px',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
      }}>
        {selectedBeer ? (
          <>
            <img src={selectedBeer.image} alt={selectedBeer.name} style={{ width: 150, height: 150, borderRadius: '8px', marginRight: '20px' }} />
            <div>
              <h2>{selectedBeer.name}</h2>
              <p>Rating: {selectedBeer.rating.average}</p>
              <p>Price: {selectedBeer.price}</p>
            </div>
          </>
        ) : (
          <h2>No beer is selected</h2>
        )}
      </div>

      <h1>Beers List</h1>
      {error && <p>Error: {error}</p>}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        {data.map((beer) => (
          <div
            key={beer.id}
            style={{
              border: '1px solid #000000',
              padding: '20px',
              cursor: 'pointer',
              width: '200px',
              marginBottom: '20px'
            }}
            onClick={() => setSelectedBeerId(beer.id)}
          >
            <img src={beer.image} alt={beer.name} style={{ width: 'auto', height: '200px', borderRadius: '8px' }} />
            <h3>{beer.name}</h3>
            <p>Rating: {beer.rating.average}</p>
            <p>Price: {beer.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
