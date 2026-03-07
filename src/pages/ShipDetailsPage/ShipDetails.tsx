// src/pages/ShipDetails/ShipDetailsPage.tsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchShipById } from '../../api/spacex';
import type { Ship } from '../../types/spacex';
import styles from './ShipDetails.module.css'; 

export const ShipDetails = () => {
  const { id } = useParams<{ id: string }>();
  
  const [ship, setShip] = useState<Ship | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getShipDetails = async () => {
      if (!id) return; 
      
      setLoading(true);
      try {
        const data = await fetchShipById(id);
        setShip(data);
      } catch (error) {
        console.error("Greška kod dohvata broda:", error);
      } finally {
        setLoading(false);
      }
    };

    getShipDetails();
  }, [id]);

  if (loading) {
    return <div className={styles.loader}>Učitavam detalje broda...</div>;
  }

  if (!ship) {
    return (
      <div className={styles.errorContainer}>
        <h2>Brod nije pronađen.</h2>
        <button onClick={() => navigate('/ships')}>Povratak na listu</button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <button onClick={() => navigate(-1)} className={styles.backBtn}>
        ← Natrag
      </button>

      <div className={styles.content}>
        <div className={styles.imageWrapper}>
          <img 
            src={ship.image || 'https://placehold.co/600x400?text=No+Image+Available'} 
            alt={ship.name} 
            className={styles.shipImage}
          />
          <span className={ship.active ? styles.statusActive : styles.statusInactive}>
            {ship.active ? "Aktivan" : "Neaktivan"}
          </span>
        </div>

        <div className={styles.details}>
          <h1 className={styles.shipName}>{ship.name}</h1>
          <p className={styles.type}>{ship.type}</p>
          
          <div className={styles.stats}>
            <div className={styles.statItem}>
              <strong>Matična luka:</strong> {ship.home_port}
            </div>
            <div className={styles.statItem}>
              <strong>Godina izgradnje:</strong> {ship.year_built || 'Nepoznato'}
            </div>
            <div className={styles.statItem}>
              <strong>Težina:</strong> {ship.weight_kg ? `${ship.weight_kg.toLocaleString()} kg` : 'N/A'}
            </div>
          </div>

          <div className={styles.launches}>
            <h3>Sudjelovao u misijama (ID-jevi lansiranja):</h3>
            {ship.launches && ship.launches.length > 0 ? (
              <ul>
                {ship.launches.map((launchId: string) => (
                  <li key={launchId} className={styles.launchId}>
                    {launchId}
                  </li>
                ))}
              </ul>
            ) : (
              <p>Ovaj brod još nije sudjelovao u zabilježenim misijama.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};