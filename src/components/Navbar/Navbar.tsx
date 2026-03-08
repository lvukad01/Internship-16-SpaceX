import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import styles from './Navbar.module.css';

export const Navbar = () => {
  const location = useLocation();
  const { isDark, toggleTheme } = useTheme();

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        <Link to="/" className={styles.logo}>
          SPACEX <span>EXPLORER</span>
        </Link>
        
        <div className={styles.navLinks}>
          <Link 
            to="/" 
            className={`${styles.link} ${location.pathname === '/' ? styles.active : ''}`}
          >
            Home
          </Link>
          <Link 
            to="/launches" 
            className={`${styles.link} ${location.pathname.startsWith('/launches') ? styles.active : ''}`}
          >
            Launches
          </Link>
          <Link 
            to="/ships" 
            className={`${styles.link} ${location.pathname.startsWith('/ships') ? styles.active : ''}`}
          >
            Ships
          </Link>
          
          <button 
            className={styles.themeToggle} 
            onClick={toggleTheme}
            title="Toggle Dark/Light Mode"
          >
            {isDark ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
    </nav>
  );
};