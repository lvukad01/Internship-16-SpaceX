import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchLaunches } from '../../api/spacex';
import type { Launch, QueryResponse } from '../../types/spacex';
import styles from './Launches.module.css'; 

export const LaunchesPage = () => {
  const [data, setData] = useState<QueryResponse<Launch> | null>(null);
  const [loading, setLoading] = useState(true);

  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get('page')) || 1;
  const search = searchParams.get('search') || '';
  const status = searchParams.get('status') || 'all'; 

  const [inputValue, setInputValue] = useState(search);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      try {
        const result = await fetchLaunches(page, search,status);
        setData(result);
      } catch (error) {
        console.error("Greška:", error);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [page, search, status]); 

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      setSearchParams({ search: value, status, page: '1' });
    }, 500);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSearchParams({ search, status: e.target.value, page: '1' });
  };

  return (
    <div className={styles.launchesContainer}>
      <h1>SpaceX Lansiranja</h1>
      
      <div className={styles.searchSection}>
        <input 
          className={styles.searchInput}
          type="text" 
          placeholder="Pretraži misije..." 
          value={inputValue} 
          onChange={handleSearch}
        />

        <select 
          className={styles.filterSelect} 
          value={status} 
          onChange={handleStatusChange}
        >
          <option value="all">Svi statusi</option>
          <option value="success">Uspješno</option>
          <option value="failed">Neuspješno</option>
        </select>
      </div>

      {loading && !data ? (
        <div>Učitavam...</div>
      ) : (
        <>
          <div className={styles.launchesGrid}>
            {data?.docs.map((launch) => (
              <div key={launch.id} className={styles.launchCard}>
                <h3>{launch.name}</h3>
                <p>Datum: {new Date(launch.date_utc).toLocaleDateString()}</p>
                <p>{launch.success ? '✅ Uspješno' : '❌ Neuspješno'}</p>
              </div>
            ))}
          </div>

          <div className={styles.paginationControls}>
            <button 
              className={styles.paginationButton}
              disabled={!data?.hasPrevPage || loading} 
              onClick={() => setSearchParams({ search, status, page: (page - 1).toString() })}
            >
              Prethodna
            </button>

            <span>Stranica {data?.page} od {data?.totalPages}</span>

            <button 
              className={styles.paginationButton}
              disabled={!data?.hasNextPage || loading} 
              onClick={() => setSearchParams({ search, status, page: (page + 1).toString() })}
            >
              Sljedeća
            </button>
          </div>
        </>
      )}
    </div>
  );
}