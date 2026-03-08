import { useEffect, useState } from 'react';
import { fetchCompany, fetchNextLaunch } from '../../api/spacex';
import type { Launch } from '../../types/spacex';
import styles from './HomePage.module.css';

interface CompanyData {
  summary: string;
  founder: string;
  employees: number;
  valuation: number;
  headquarters: {
    address: string;
    city: string;
    state: string;
  };
}

export const HomePage = () => {
  const [company, setCompany] = useState<CompanyData | null>(null);
  const [nextLaunch, setNextLaunch] = useState<Launch | null>(null);
  
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [companyData, launchData] = await Promise.all([
          fetchCompany(),
          fetchNextLaunch()
        ]);
        setCompany(companyData);
        setNextLaunch(launchData);
      } catch (error) {
        console.error("Error loading home page data:", error);
      }
    };
    loadHomeData();
  }, []);

  useEffect(() => {
    if (!nextLaunch) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const launchTime = new Date(nextLaunch.date_utc).getTime();
      const diff = launchTime - now;

      if (diff <= 0) {
        clearInterval(interval);
      } else {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [nextLaunch]);

  return (
    <div className={styles.homeContainer}>
      <section className={styles.heroSection}>
        <video 
            autoPlay 
            muted 
            loop 
            playsInline 
            className={styles.backgroundVideo}
        >
            <source src="src\assets\video\4K Planet Earth Spinning in Space _ Free HD Videos - No Copyright.mp4" type="video/mp4" />
            Your browser does not support the video tag.
        </video>
        
        <div className={styles.heroContent}>

          <h1>SPACEX</h1>
          <div className={styles.countdownBox}>
            <h2>Upcoming Mission: {nextLaunch?.name}</h2>
            <div className={styles.timer}>
              <div className={styles.timerItem}>
                {timeLeft.days}<span>Days</span>
              </div>
              <div className={styles.timerItem}>
                {timeLeft.hours}<span>Hours</span>
              </div>
              <div className={styles.timerItem}>
                {timeLeft.minutes}<span>Mins</span>
              </div>
              <div className={styles.timerItem}>
                {timeLeft.seconds}<span>Secs</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {company && (
        <section className={styles.companySection}>
          <div className={styles.companyContent}>
            <h2>About the Company</h2>
            <p className={styles.summary}>{company.summary}</p>
            
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <h4>Founder</h4>
                <p>{company.founder}</p>
              </div>
              <div className={styles.statCard}>
                <h4>Employees</h4>
                <p>{company.employees.toLocaleString()}</p>
              </div>
              <div className={styles.statCard}>
                <h4>Valuation</h4>
                <p>${(company.valuation / 1000000000).toFixed(0)}B</p>
              </div>
              <div className={styles.statCard}>
                <h4>Headquarters</h4>
                <p>{company.headquarters.city}, {company.headquarters.state}</p>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};