import { useEffect, useState, useRef, useCallback } from "react"
import styles from "./ShipsPage.module.css"
import { fetchShips } from "../../api/spacex"
import type { Ship } from "../../types/spacex"

export const ShipsPage = () => {
  const [ships, setShips] = useState<Ship[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(true);
  
  const pageRef = useRef(1);
  const fetchingRef = useRef(false);
  const hasNextPageRef = useRef(true);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const initialLoadDone = useRef(false);

  const loadMore = useCallback(async () => {
    if (fetchingRef.current || !hasNextPageRef.current) return;

    fetchingRef.current = true;
    setLoading(true);

    try {
      const data = await fetchShips(pageRef.current);
      
      setShips(prev => {
        const ids = new Set(prev.map(s => s.id));
        const newUnique = data.docs.filter(s => !ids.has(s.id));
        return [...prev, ...newUnique];
      });

      const nextPage = data.hasNextPage;
      hasNextPageRef.current = nextPage;
      setHasNextPage(nextPage);
      
      if (nextPage) {
        pageRef.current += 1;
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      fetchingRef.current = false;
      initialLoadDone.current = true;
    }
  }, []);

  useEffect(() => {
    loadMore();
  }, []);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && initialLoadDone.current) {
          loadMore();
        }
      },
      { rootMargin: '300px' }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={styles.container}>
      <h1>SpaceX Fleet</h1>

      <div className={styles.grid}>
        {ships.map((ship) => (
          <div key={ship.id} className={styles.card}>
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
        ))}
      </div>

      <div ref={sentinelRef} style={{ height: '1px' }} />

      {loading && (
        <div className={styles.loader}>Učitavam još brodova...</div>
      )}

      {!hasNextPage && (
        <div className={styles.end}>Nema više brodova 🚢</div>
      )}
    </div>
  )
}