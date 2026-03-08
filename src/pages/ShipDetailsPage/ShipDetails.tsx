import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchShipById, fetchLaunchesByIds } from '../../api/spacex';
import type { Ship, Launch } from '../../types/spacex';
import { withLoading } from '../../hoc/withLoading';
import styles from './ShipDetails.module.css';

const ShipDetailsBase = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [ship, setShip] = useState<Ship | null>(null);
  const [launches, setLaunches] = useState<Launch[]>([]);

  useEffect(() => {
    const getFullDetails = async () => {
      if (!id) return;
      try {
        const shipData = await fetchShipById(id);
        setShip(shipData);
        if (shipData.launches && shipData.launches.length > 0) {
          const launchesData = await fetchLaunchesByIds(shipData.launches);
          setLaunches(launchesData);
        }
      } catch (error) {
        console.error(error);
      }
    };
    getFullDetails();
  }, [id]);

  if (!ship) return <div className={styles.errorContainer}><h2>Ship not found</h2></div>;

  return (
    <div className={styles.container}>
      <button onClick={() => navigate(-1)} className={styles.backBtn}>← Back</button>
      <div className={styles.content}>
        <div className={styles.imageWrapper}>
          <img 
            src={ship.image || 'https://placehold.co/600x400?text=No+Image+Available'} 
            alt={ship.name} 
            className={styles.shipImage}
          />
          <span className={ship.active ? styles.statusActive : styles.statusInactive}>
            {ship.active ? "Active" : "Inactive"}
          </span>
        </div>
        <div className={styles.details}>
          <h1 className={styles.shipName}>{ship.name}</h1>
          <p className={styles.type}>{ship.type}</p>
          <div className={styles.stats}>
            <div className={styles.statItem}><strong>Home Port:</strong> {ship.home_port}</div>
            <div className={styles.statItem}><strong>Year Built:</strong> {ship.year_built || 'Unknown'}</div>
            <div className={styles.statItem}><strong>Weight:</strong> {ship.weight_kg ? `${ship.weight_kg.toLocaleString()} kg` : 'N/A'}</div>
          </div>
          <div className={styles.launchesSection}>
            <h3>Participated in Missions</h3>
            <div className={styles.launchTags}>
              {launches.map((launch) => (
                <Link key={launch.id} to={`/launch/${launch.id}`} className={styles.launchTag}>
                  {launch.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ShipDetailsWithHOC = withLoading(ShipDetailsBase);

export const ShipDetails = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  return <ShipDetailsWithHOC isLoading={isLoading} />;
};