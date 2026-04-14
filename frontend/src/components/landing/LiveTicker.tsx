import { useState, useEffect } from 'react';
import styles from './LiveTicker.module.css';

function formatUptime(): string {
  const hours = Math.floor(Math.random() * 999) + 1;
  const minutes = Math.floor(Math.random() * 60);
  return `${hours}h ${minutes}m`;
}

function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function LiveTicker() {
  const [runners, setRunners] = useState(randomBetween(50, 200));
  const [hacks, setHacks] = useState(randomBetween(10000, 50000));
  const [uptime] = useState(formatUptime);

  useEffect(() => {
    const interval = setInterval(() => {
      setRunners((prev) => prev + randomBetween(-2, 5));
      setHacks((prev) => prev + randomBetween(1, 10));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.ticker}>
      <div className={styles.stat}>
        <span className={styles.dot} />
        <span className={styles.label}>Active Runners:</span>
        <span className={styles.value}>{runners}</span>
      </div>
      <div className={styles.stat}>
        <span className={styles.label}>System Uptime:</span>
        <span className={styles.value}>{uptime}</span>
      </div>
      <div className={styles.stat}>
        <span className={styles.label}>Total Hacks:</span>
        <span className={styles.value}>{hacks.toLocaleString()}</span>
      </div>
    </div>
  );
}
