import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchShipById, fetchLaunchesByIds } from '../../api/spacex';
import type { Ship, Launch } from '../../types/spacex';
import styles from './ShipDetails.module.css';

export const ShipDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [ship, setShip] = useState<Ship | null>(null);
  const [launches, setLaunches] = useState<Launch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getFullDetails = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const shipData = await fetchShipById(id);
        setShip(shipData);

        if (shipData.launches && shipData.launches.length > 0) {
          const launchesData = await fetchLaunchesByIds(shipData.launches);
          setLaunches(launchesData);
        }
      } catch (error) {
        console.error("Error fetching ship details:", error);
      } finally {
        setLoading(false);
      }
    };

    getFullDetails();
  }, [id]);

  if (loading) {
    return (
      <div className={styles.loaderContainer}>
        <div className={styles.spinner}></div>
        <p>Loading ship details...</p>
      </div>
    );
  }

  if (!ship) {
    return (
      <div className={styles.errorContainer}>
        <h2>Ship not found</h2>
        <button onClick={() => navigate('/ships')} className={styles.backBtn}>
          Back to Fleet
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <button onClick={() => navigate(-1)} className={styles.backBtn}>
        ← Back
      </button>

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
            <div className={styles.statItem}>
              <strong>Home Port:</strong> {ship.home_port}
            </div>
            <div className={styles.statItem}>
              <strong>Year Built:</strong> {ship.year_built || 'Unknown'}
            </div>
            <div className={styles.statItem}>
              <strong>Weight:</strong> {ship.weight_kg ? `${ship.weight_kg.toLocaleString()} kg` : 'N/A'}
            </div>
          </div>

          <div className={styles.launchesSection}>
            <h3>Participated in Missions</h3>
            {launches.length > 0 ? (
              <div className={styles.launchTags}>
                {launches.map((launch) => (
                  <Link 
                    key={launch.id} 
                    to={`/launch/${launch.id}`} 
                    className={styles.launchTag}
                  >
                    {launch.name}
                  </Link>
                ))}
              </div>
            ) : (
              <p className={styles.noData}>No mission history available for this vessel.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};