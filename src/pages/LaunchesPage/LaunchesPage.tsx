import { useEffect, useState, useRef } from 'react';
import { fetchLaunches } from '../../api/spacex';
import type { Launch, QueryResponse } from '../../types/spacex';
import styles from './Launches.module.css';

export const LaunchesPage = () => {
  const [data, setData] = useState<QueryResponse<Launch> | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const debounceRef = useRef<number | null>(null);
  const [inputValue, setInputValue] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = window.setTimeout(() => {
      setSearch(value);
    }, 500);
  };

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      try {
        const result = await fetchLaunches(page, search);
        setData(result);
      } catch (error) {
        console.error('Greška:', error);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, [page, search]);

  if (loading && !data) return <div>Učitavam...</div>;

  return (
    <div className={styles.container}>
      <h1>SpaceX Lansiranja</h1>

      <input
        type="text"
        placeholder="Search launches"
        value={inputValue}
        onChange={handleSearch}
        className={styles.searchInput}
      />

      <div className={styles.grid}>
        {data?.docs.map((launch) => (
          <div key={launch.id} className={styles.card}>
            <h3>{launch.name}</h3>
            <p>Datum: {new Date(launch.date_utc).toLocaleDateString()}</p>
          </div>
        ))}
      </div>

      <div className={styles.pagination}>
        <button
          disabled={!data?.hasPrevPage || loading}
          onClick={() => setPage((p) => p - 1)}
        >
          Prethodna
        </button>

        <span>
          Stranica {data?.page} od {data?.totalPages}
        </span>

        <button
          disabled={!data?.hasNextPage || loading}
          onClick={() => setPage((p) => p + 1)}
        >
          Sljedeća
        </button>
      </div>
    </div>
  );
};