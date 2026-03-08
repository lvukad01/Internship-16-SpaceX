import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fetchLaunches } from '../../api/spacex';
import type { Launch, QueryResponse } from '../../types/spacex';
import { withLoading } from '../../hoc/withLoading';
import { useDebounce } from '../../hooks/useDebounce';
import styles from './Launches.module.css';

interface Props {
  data: QueryResponse<Launch> | null;
  page: number;
}

const LaunchesPageBase = ({ data, page }: Props) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('search') || '';
  const status = searchParams.get('status') || 'all';
  const [inputValue, setInputValue] = useState(search);
  const debouncedSearch = useDebounce(inputValue, 500);

  useEffect(() => {
    if (debouncedSearch !== search) {
      setSearchParams({ search: debouncedSearch, status, page: '1' });
    }
  }, [debouncedSearch]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSearchParams({ search: inputValue, status: e.target.value, page: '1' });
  };

  const handlePageChange = (newPage: number) => {
    setSearchParams({ search, status, page: newPage.toString() });
  };

  return (
    <div className={styles.launchesContainer}>
      <motion.h1 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        SpaceX Launches
      </motion.h1>

      <div className={styles.searchSection}>
        <input
          className={styles.searchInput}
          type="text"
          placeholder="Search missions..."
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

      <div className={styles.launchesGrid}>
        {data?.docs.map((launch, index) => (
          <motion.div
            key={launch.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3, delay: (index % 10) * 0.05 }}
          >
            <Link to={`/launch/${launch.id}`} className={styles.cardLink}>
              <div className={styles.card}>
                <div className={styles.patchWrapper}>
                  <img 
                    src={launch.links.patch.small || `https://placehold.co/200x200/1a1a1a/ffffff?text=${encodeURIComponent(launch.name)}`} 
                    alt={launch.name} 
                    className={styles.patchImg}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://placehold.co/200x200?text=No+Patch';
                    }}
                  />
                </div>
                <div className={styles.cardContent}>
                  <h3>{launch.name}</h3>
                  <p>Datum: {new Date(launch.date_utc).toLocaleDateString()}</p>
                  <span className={`${styles.status} ${
                    launch.upcoming ? styles.upcoming : launch.success ? styles.success : styles.failed
                  }`}>
                    {launch.upcoming ? "Upcoming" : launch.success ? "Success" : "Failed"}
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className={styles.paginationControls}>
        <button
          className={styles.paginationButton}
          disabled={!data?.hasPrevPage}
          onClick={() => handlePageChange(page - 1)}
        >
          Before
        </button>
        <span>Page {data?.page} of {data?.totalPages}</span>
        <button
          className={styles.paginationButton}
          disabled={!data?.hasNextPage}
          onClick={() => handlePageChange(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

const PageWithHOC = withLoading(LaunchesPageBase);

export const LaunchesPage = () => {
  const [data, setData] = useState<QueryResponse<Launch> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams] = useSearchParams();
  
  const page = Number(searchParams.get('page')) || 1;
  const search = searchParams.get('search') || '';
  const status = searchParams.get('status') || 'all';

  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);
      try {
        const result = await fetchLaunches(page, search, status);
        setData(result);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    getData();
  }, [page, search, status]);

  return <PageWithHOC isLoading={isLoading} data={data} page={page} />;
};