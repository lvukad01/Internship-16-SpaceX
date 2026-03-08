import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchLaunchById, fetchRocketById } from '../../api/spacex';
import type { Launch, Rocket } from '../../types/spacex';
import { withLoading } from '../../hoc/withLoading';
import styles from './LaunchDetails.module.css';

const LaunchDetailsBase = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [launch, setLaunch] = useState<Launch | null>(null);
  const [rocket, setRocket] = useState<Rocket | null>(null);

  useEffect(() => {
    if (id) {
      fetchLaunchById(id).then(launchData => {
        setLaunch(launchData);
        if (launchData.rocket) {
          fetchRocketById(launchData.rocket).then(setRocket);
        }
      });
    }
  }, [id]);

  if (!launch) return <div className={styles.error}>Launch not found.</div>;

  return (
    <div className={styles.container}>
      <button onClick={() => navigate(-1)} className={styles.backBtn}>← Back</button>
      <header className={styles.header}>
        {launch.links.patch.small && (
          <img src={launch.links.patch.small} alt={launch.name} className={styles.patch} />
        )}
        <div className={styles.headerText}>
          <h1>{launch.name}</h1>
          <h2>Rocket: {rocket?.name || "Loading..."}</h2>
        </div>
      </header>
      <section className={styles.content}>
        <div className={styles.descriptionCard}>
          <h3>Mission Details</h3>
          <p>{launch.details || "No details available for this mission."}</p>
        </div>
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

const LaunchWithHOC = withLoading(LaunchDetailsBase);

export const LaunchDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      fetchLaunchById(id).finally(() => setIsLoading(false));
    }
  }, [id]);

  return <LaunchWithHOC isLoading={isLoading} />;
};