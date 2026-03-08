import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import type { Launch } from '../../types/spacex';
import styles from './LaunchCard.module.css';

interface Props {
  launch: Launch;
  index: number;
}

export const LaunchCard = ({ launch, index }: Props) => {
  return (
    <motion.div
      className={styles.card}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ 
        y: -10,
        transition: { duration: 0.2 }
      }}
      transition={{ 
        duration: 0.5, 
        delay: (index % 8) * 0.1 
      }}
    >
      <Link to={`/launch/${launch.id}`} className={styles.link}>
        <div className={styles.patchWrapper}>
          <img 
            src={launch.links.patch.small || 'https://images2.imgbox.com/3c/0d/86M8qbHs_o.png'} 
            alt={launch.name} 
            className={styles.patch}
          />
        </div>
        <div className={styles.content}>
          <span className={styles.flightNumber}>#{launch.flight_number}</span>
          <h3>{launch.name}</h3>
          <p>{new Date(launch.date_utc).toLocaleDateString('hr-HR')}</p>
          <div className={`${styles.status} ${launch.success ? styles.success : styles.fail}`}>
            {launch.success ? 'Success' : 'Failed'}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};