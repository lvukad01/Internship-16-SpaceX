import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchLaunchById } from '../../api/spacex';
import type { Launch } from '../../types/spacex';
import styles from './LaunchDetails.module.css';

export const LaunchDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [launch, setLaunch] = useState<Launch | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchLaunchById(id)
        .then(setLaunch)
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) return <div className={styles.loader}>Učitavam detalje...</div>;
  if (!launch) return <div>Lansiranje nije pronađeno.</div>;

  return (
    <div className={styles.container}>
      <button onClick={() => navigate(-1)} className={styles.backBtn}>← Povratak</button>
      
      <header className={styles.header}>
        <img src={launch.links.patch.small||""} alt={launch.name} className={styles.patch} />
        <h1>{launch.name}</h1>
      </header>

      <section className={styles.content}>
        <p className={styles.description}>
          {launch.details || "Nema dostupnog opisa za ovu misiju."}
        </p>

        {launch.links.youtube_id && (
          <div className={styles.videoWrapper}>
            <iframe
              title="YouTube video player"
              src={`https://www.youtube.com/embed/${launch.links.youtube_id}`}
              frameBorder="0"
              allowFullScreen
            ></iframe>
          </div>
        )}
      </section>
    </div>
  );
};