import type { DashboardView } from './Sidebar';
import styles from './Topbar.module.css';

const VIEW_TITLES: Record<DashboardView, string> = {
  play: 'Code Arena',
  daily: 'Daily Challenge',
  feed: 'Activity Feed',
  leaderboard: 'Leaderboard',
  achievements: 'Achievements',
  'black-market': 'Black Market',
  friends: 'Friends',
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
      <h1 className={styles.viewTitle}>{VIEW_TITLES[activeView]}</h1>
      <div className={styles.stats}>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>LVL</span>
          <span className={styles.statValue}>{level}</span>
        </div>
        <div className={styles.divider} />
        <div className={styles.statItem}>
          <span className={styles.statLabel}>XP</span>
          <span className={`${styles.statValue} ${styles.xpValue}`}>
            {xp.toLocaleString()}
          </span>
        </div>
        <div className={styles.divider} />
        <div className={styles.statItem}>
          <span className={styles.statLabel}>CR</span>
          <span className={`${styles.statValue} ${styles.creditValue}`}>
            {credits.toLocaleString()}
          </span>
        </div>
      </div>
    </header>
  );
}
