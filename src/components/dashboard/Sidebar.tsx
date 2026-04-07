import styles from './Sidebar.module.css';

export type DashboardView =
  | 'play'
  | 'leaderboard'
  | 'achievements'
  | 'black-market'
  | 'profile';

interface NavItem {
  id: DashboardView;
  icon: string;
  label: string;
}

const MAIN_NAV: NavItem[] = [
  { id: 'play', icon: '⚔️', label: 'Play' },
  { id: 'leaderboard', icon: '🏆', label: 'Leaderboard' },
  { id: 'achievements', icon: '🎖️', label: 'Achievements' },
  { id: 'black-market', icon: '🛒', label: 'Black Market' },
];

const ACCOUNT_NAV: NavItem[] = [
  { id: 'profile', icon: '👤', label: 'Profile' },
];

interface SidebarProps {
  activeView: DashboardView;
  onViewChange: (view: DashboardView) => void;
  username: string;
  rank: string;
  onLogout: () => void;
}

export function Sidebar({
  activeView,
  onViewChange,
  username,
  rank,
  onLogout,
}: SidebarProps) {
  const initials = username.slice(0, 2).toUpperCase();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logoSection}>
        <div className={styles.logo}>NEONCODE</div>
        <div className={styles.logoSub}>// The Cockpit</div>
      </div>

      <nav className={styles.nav}>
        <span className={styles.sectionLabel}>// Missions</span>
        {MAIN_NAV.map((item) => (
          <button
            key={item.id}
            className={`${styles.navItem} ${activeView === item.id ? styles.navItemActive : ''}`}
            onClick={() => onViewChange(item.id)}
          >
            <span className={styles.navIcon}>{item.icon}</span>
            {item.label}
          </button>
        ))}

        <span className={styles.sectionLabel}>// Account</span>
        {ACCOUNT_NAV.map((item) => (
          <button
            key={item.id}
            className={`${styles.navItem} ${activeView === item.id ? styles.navItemActive : ''}`}
            onClick={() => onViewChange(item.id)}
          >
            <span className={styles.navIcon}>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <div className={styles.bottomSection}>
        <div className={styles.userInfo}>
          <div className={styles.avatar}>{initials}</div>
          <div className={styles.userDetails}>
            <div className={styles.userName}>{username}</div>
            <div className={styles.userRank}>{rank}</div>
          </div>
        </div>
        <button className={styles.navItem} onClick={onLogout}>
          <span className={styles.navIcon}>🚪</span>
          Disconnect
        </button>
      </div>
    </aside>
  );
}
