import styles from './StatsSection.module.css';

const STATS = [
  { value: '10K+', label: 'Netrunners' },
  { value: '500+', label: 'Challenges' },
  { value: '5', label: 'Languages' },
  { value: '1M+', label: 'Lines Hacked' },
];

export function StatsSection() {
  return (
    <section className={styles.section}>
      <div className={styles.grid}>
        {STATS.map((stat) => (
          <div key={stat.label} className={styles.stat}>
            <div className={styles.statValue}>{stat.value}</div>
            <div className={styles.statLabel}>{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
