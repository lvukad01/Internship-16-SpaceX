import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchLaunches } from '../../api/spacex';
import type { Launch, QueryResponse } from '../../types/spacex';
import styles from './Launches.module.css'; 
import { Link } from 'react-router-dom';

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
          <option value="all">All</option>
          <option value="upcoming">Upcoming</option> 
          <option value="success">Success</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      {loading && !data ? (
        <div>Učitavam...</div>
      ) : (
        <>
        <div className={styles.launchesGrid}>
          {data?.docs.map((launch) => (
            <Link 
              key={launch.id} 
              to={`/launch/${launch.id}`} 
              className={styles.cardLink} 
            >
              <div className={styles.card}>
                <h3>{launch.name}</h3>
                <p>Datum: {new Date(launch.date_utc).toLocaleDateString()}</p>
                
                <span className={`${styles.status} ${
                  launch.upcoming ? styles.upcoming : launch.success ? styles.success : styles.failed
                }`}>
                  {launch.upcoming ? "Upcoming" : launch.success ? "Success" : "Failed"}
                </span>
              </div>
            </Link>
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