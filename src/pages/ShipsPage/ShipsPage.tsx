import { useEffect, useState, useRef, useCallback } from "react";
import { useSearchParams, Link } from 'react-router-dom';
import { fetchShips } from "../../api/spacex";
import type { Ship } from "../../types/spacex";
import { withLoading } from '../../hoc/withLoading';
import { useDebounce } from '../../hooks/useDebounce';
import styles from "./ShipsPage.module.css";

const ShipsPageBase = ({ initialShips }: { initialShips: Ship[] }) => {
  const [ships, setShips] = useState<Ship[]>(initialShips);
  const [fetching, setFetching] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(true);

  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('search') || '';
  const [inputValue, setInputValue] = useState(search);
  const debouncedSearch = useDebounce(inputValue, 500);

  const pageRef = useRef(2);
  const fetchingRef = useRef(false);
  const hasNextPageRef = useRef(true);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setShips(initialShips);
    pageRef.current = 2;
    hasNextPageRef.current = initialShips.length >= 10; 
    setHasNextPage(initialShips.length >= 10);
    window.scrollTo(0, 0);
  }, [initialShips]);

  useEffect(() => {
    if (debouncedSearch !== search) {
      setSearchParams({ search: debouncedSearch });
    }
  }, [debouncedSearch, search, setSearchParams]);

  const loadMore = useCallback(async () => {
    if (fetchingRef.current || !hasNextPageRef.current) return;

    fetchingRef.current = true;
    setFetching(true);

    try {
      const data = await fetchShips(pageRef.current, search);
      setShips(prev => {
        const ids = new Set(prev.map(s => s.id));
        const newUnique = data.docs.filter(s => !ids.has(s.id));
        return [...prev, ...newUnique];
      });

      hasNextPageRef.current = data.hasNextPage;
      setHasNextPage(data.hasNextPage);
      if (data.hasNextPage) pageRef.current += 1;
    } catch (err) {
      console.error(err);
    } finally {
      setFetching(false);
      fetchingRef.current = false;
    }
  }, [search]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: '300px' }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore]);

  return (
    <div className={styles.container}>
      <h1>SpaceX Fleet</h1>
      <input
        className={styles.searchInput}
        type="text"
        placeholder="Search ships..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <div className={styles.grid}>
        {ships.map((ship) => (
          <Link to={`/ship/${ship.id}`} key={ship.id} className={styles.cardLink}>
            <div className={styles.card}>
              <div className={styles.imageContainer}>
                <img src={ship.image || "https://placehold.co/400x300?text=No+Image"} alt={ship.name} />
              </div>
              <div className={styles.info}>
                <h3>{ship.name}</h3>
                <p>{ship.type}</p>
                <span className={ship.active ? styles.active : styles.inactive}>
                  {ship.active ? "● Active" : "○ Inactive"}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <div ref={sentinelRef} style={{ height: '20px' }} />
      {fetching && <div className={styles.loader}>Loading more...</div>}
      {!hasNextPage && ships.length > 0 && <div className={styles.end}>No more ships 🚢</div>}
    </div>
  );
};

const ShipsWithHOC = withLoading(ShipsPageBase);

export const ShipsPage = () => {
  const [initialShips, setInitialShips] = useState<Ship[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const search = searchParams.get('search') || '';

  useEffect(() => {
    const getInitialData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchShips(1, search);
        setInitialShips(data.docs);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    getInitialData();
  }, [search]);

  return <ShipsWithHOC isLoading={isLoading} initialShips={initialShips} />;
};