import { useEffect, useState } from 'react';
import { fetchLaunches } from '../api/spacex';
import type { Launch, QueryResponse } from '../types/spacex';

export const LaunchesPage = () => {
  const [data, setData] = useState<QueryResponse<Launch> | null>(null);
  
  const [page, setPage] = useState(1);
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      try {
        const result = await fetchLaunches(page);
        setData(result);
      } catch (error) {
        console.error("Greška:", error);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, [page]); 

  if (loading && !data) return <div>Učitavam...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>SpaceX Lansiranja</h1>

      <div style={{ display: 'grid', gap: '15px', marginBottom: '20px' }}>
        {data?.docs.map((launch) => (
          <div 
            key={launch.id} 
            style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}
          >
            <h3>{launch.name}</h3>
            <p>Datum: {new Date(launch.date_utc).toLocaleDateString()}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <button 
          disabled={!data?.hasPrevPage || loading} 
          onClick={() => setPage(p => p - 1)}
        >
          Prethodna
        </button>

        <span>Stranica {data?.page} od {data?.totalPages}</span>

        <button 
          disabled={!data?.hasNextPage || loading} 
          onClick={() => setPage(p => p + 1)}
        >
          Sljedeća
        </button>
      </div>
    </div>
  );
};