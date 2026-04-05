import { useState, useEffect } from 'react';
import styles from './HackerIntro.module.css';

const BOOT_LINES = [
  '> INITIALIZING NEONCODE v1.0.0...',
  '> LOADING NEURAL INTERFACE...',
  '> DECRYPTING SECURE CHANNELS...',
  '> ESTABLISHING UPLINK...',
  '> ACCESS GRANTED',
];

const INTRO_DURATION_MS = 4000;

export function HackerIntro() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), INTRO_DURATION_MS);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.terminal}>
        {BOOT_LINES.map((line, i) => (
          <div key={i} className={styles.line}>
            <span className={styles.prefix}>$</span> {line}
            {i === BOOT_LINES.length - 1 && <span className={styles.cursor} />}
          </div>
        ))}
      </div>
    </div>
  );
}
