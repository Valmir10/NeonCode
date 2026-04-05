import type { DashboardView } from './Sidebar';
import styles from './Topbar.module.css';

const VIEW_TITLES: Record<DashboardView, string> = {
  play: 'Code Arena',
  leaderboard: 'Leaderboard',
  achievements: 'Achievements',
  'black-market': 'Black Market',
  profile: 'Profile',
};

interface TopbarProps {
  activeView: DashboardView;
  xp: number;
  credits: number;
  level: number;
}

export function Topbar({ activeView, xp, credits, level }: TopbarProps) {
  return (
    <header className={styles.topbar}>
      <div className={styles.viewTitle}>
        <span className={styles.viewPrefix}>&gt;</span>
        {VIEW_TITLES[activeView]}
      </div>
      <div className={styles.stats}>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>LVL</span>
          <span className={styles.statValue}>{level}</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>XP</span>
          <span className={`${styles.statValue} ${styles.xpValue}`}>
            {xp.toLocaleString()}
          </span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Credits</span>
          <span className={`${styles.statValue} ${styles.creditValue}`}>
            {credits.toLocaleString()}
          </span>
        </div>
      </div>
    </header>
  );
}
