import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchLaunchById, fetchRocketById } from '../../api/spacex';
import type { Launch, Rocket } from '../../types/spacex';
import styles from './LaunchDetails.module.css';

export const LaunchDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [launch, setLaunch] = useState<Launch | null>(null);
  const [loading, setLoading] = useState(true);
  const [rocket,setRocket]=useState<Rocket|null>(null)

  useEffect(() => {
    if (id) {
      fetchLaunchById(id)
        .then(setLaunch)
        .finally(() => setLoading(false));
    }
  }, [id]);
  useEffect(()=>{
    if(launch?.rocket){
        fetchRocketById(launch.rocket)
            .then(setRocket)
    }
  },[launch])

  if (loading) return <div className={styles.loader}>Loading details...</div>;
  if (!launch) return <div>Launch not found.</div>;

  return (
    <div className={styles.container}>
      <button onClick={() => navigate(-1)} className={styles.backBtn}>← Back</button>
      
      <header className={styles.header}>
        <img src={launch.links.patch.small||""} alt={launch.name} className={styles.patch} />
        <h1>{launch.name}</h1>
        <h2>{rocket?.name}</h2>
      </header>

      <section className={styles.content}>
        <p className={styles.description}>
          {launch.details || "No details available."}
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