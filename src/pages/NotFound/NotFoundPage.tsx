import { useNavigate } from 'react-router-dom';
import styles from './NotFound.module.css';

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.errorCode}>404</h1>
        <h2 className={styles.title}>Lost in Space</h2>
        <p className={styles.message}>
          The page you are looking for has drifted out into deep orbit. 
          It might have been moved or deleted.
        </p>
        <button 
          className={styles.homeBtn} 
          onClick={() => navigate('/')}
        >
          Return to Mission Control
        </button>
      </div>
    </div>
  );
};