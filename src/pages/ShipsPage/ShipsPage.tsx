import { useEffect,useState,useRef,useCallback } from "react"
import styles from './ShipsPage.module.css'
import { fetchShips } from "../../api/spacex"
import type { Ship } from "../../types/spacex"

export const ShipsPage=()=>{
    const [ships,setShips]=useState<Ship[]>([])
    const [page,setPage]=useState(1)
    const [loading,setLoading]=useState(false)
    const [hasNextPage,setHasNextPage]=useState(true)

    const observer = useRef<IntersectionObserver | null>(null);

    const lastShipElementRef = useCallback((node: HTMLDivElement) => {
        if (loading) return; 
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasNextPage && !loading) {
                setPage(prevPage => prevPage + 1);
            }
            });

            if (node) observer.current.observe(node);
    }, [hasNextPage,loading]);

    useEffect(()=>{
        const loadShips=async()=>{
            setLoading(true)
            try{
                const data =await fetchShips(page)
                setShips(prev => {
                        const newDocs = data.docs.filter(
                        newShip => !prev.some(oldShip => oldShip.id === newShip.id)
                        );
                        return [...prev, ...newDocs];
                    });
                setHasNextPage(data.hasNextPage)
            }catch(error){
                console.error("Error occurred while loading ships",error)
            }finally{
                setLoading(false)
            }
        }
        loadShips()
    },[page])
    useEffect(() => {
        return () => observer.current?.disconnect();
    }, []);
    return (
        <div className={styles.container}>
        <h1>SpaceX Ships</h1>
        <div className={styles.grid}>
            {ships.map((ship, index) => {
            const isLastElement = ships.length === index + 1;
            
            return (
                <div 
                key={ship.id} 
                ref={isLastElement ? lastShipElementRef : null} 
                className={styles.card}
                >
                <div className={styles.imageContainer}>
                    <img 
                    src={ship.image || 'https://placehold.co/400x300?text=No+Image'} 
                    alt={ship.name} 
                    className={styles.shipImage}
                    />
                </div>
                <div className={styles.info}>
                    <h3>{ship.name}</h3>
                    <p>Port: {ship.home_port}</p>
                    <span className={ship.active ? styles.active : styles.inactive}>
                    {ship.active ? "Active" : "Inactive"}
                    </span>
                </div>
                </div>
            );
            })}
        </div>
        {loading && <div className={styles.loader}>Loading more ships...</div>}
        </div>
    );

}