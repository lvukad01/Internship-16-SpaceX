import { useEffect, useState, useRef, useCallback } from "react";
import { useSearchParams } from 'react-router-dom';
import styles from "./ShipsPage.module.css";
import { fetchShips } from "../../api/spacex";
import type { Ship } from "../../types/spacex";
import { Link } from 'react-router-dom';

export const ShipsPage = () => {
  const [ships, setShips] = useState<Ship[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(true);

  const pageRef = useRef(1);
  const fetchingRef = useRef(false);
  const hasNextPageRef = useRef(true);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('search') || '';
  const [inputValue, setInputValue] = useState(search);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadMore = useCallback(async (isNewSearch = false) => {
    if (fetchingRef.current || (!hasNextPageRef.current && !isNewSearch)) return;

    fetchingRef.current = true;
    setLoading(true);

    const pageToLoad = isNewSearch ? 1 : pageRef.current;

    try {
      const data = await fetchShips(pageToLoad, search);

      setShips(prev => {
        if (pageToLoad === 1) return data.docs;
        const ids = new Set(prev.map(s => s.id));
        const newUnique = data.docs.filter(s => !ids.has(s.id));
        return [...prev, ...newUnique];
      });

      hasNextPageRef.current = data.hasNextPage;
      setHasNextPage(data.hasNextPage);

      if (data.hasNextPage) {
        pageRef.current = pageToLoad + 1;
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      fetchingRef.current = false;
    }
  }, [search]);

  useEffect(() => {
    loadMore(true);
  }, [search, loadMore]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !fetchingRef.current) {
          loadMore();
        }
      },
      { rootMargin: '300px' }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      setSearchParams({ search: value });
    }, 500);
  };

  return (
    <div className={styles.container}>
      <h1>SpaceX Ships</h1>
      
      <input
        className={styles.searchInput}
        type="text"
        placeholder="Search ships..."
        value={inputValue}
        onChange={handleSearch}
      />

      <div className={styles.grid}>
        {ships.map((ship) => (
<Link to={`/ships/${ship.id}`} key={ship.id} className={styles.cardLink}>
      <div className={styles.card}>
        <div className={styles.imageContainer}>
          <img
            src={ship.image || "https://placehold.co/400x300?text=No+Image"}
            alt={ship.name}
          />
        </div>
        <div className={styles.info}>
          <h3>{ship.name}</h3>
          <p>Type: {ship.type || "Unknown"}</p>
          <p>Port: {ship.home_port || "Unknown"}</p>
          <span className={ship.active ? styles.active : styles.inactive}>
            {ship.active ? "● Active" : "○ Inactive"}
          </span>
        </div>
      </div>
    </Link>
        ))}
      </div>

      <div ref={sentinelRef} style={{ height: '10px' }} />

      {loading && (
        <div className={styles.loader}>Loading ships...</div>
      )}

      {!hasNextPage && ships.length > 0 && (
        <div className={styles.end}>No more ships 🚢</div>
      )}
    </div>
  );
};