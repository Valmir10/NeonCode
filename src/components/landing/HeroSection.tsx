import { useState, useEffect } from 'react';
import styles from './HeroSection.module.css';

const ROTATING_WORDS = [
  'Solve challenges',
  'Level up your skills',
  'Challenge friends',
  'Climb the leaderboard',
  'Earn achievements',
];

export function HeroSection() {
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % ROTATING_WORDS.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className={styles.hero}>
      <p className={styles.tagline}>// AI-Powered Coding Arena</p>
      <h1 className={styles.title}>NeonCode</h1>
      <p className={styles.subtitle}>
        Learn to code. Compete. Dominate the leaderboard.
      </p>
      <div className={styles.rotatingWrapper}>
        <span className={styles.rotatingPrefix}>&gt; </span>
        <span key={wordIndex} className={styles.rotatingWord}>
          {ROTATING_WORDS[wordIndex]}
        </span>
        <span className={styles.cursor}>_</span>
      </div>
      <p className={styles.arrows}>&gt;&gt;&gt;&gt;&gt;&gt;</p>
      <div className={styles.actions}>
        <button className={styles.btnPrimary}>Jack In</button>
        <button className={styles.btnSecondary}>Login</button>
      </div>
    </section>
  );
}
