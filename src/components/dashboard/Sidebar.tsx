import styles from './Sidebar.module.css';

export type DashboardView =
  | 'play'
  | 'leaderboard'
  | 'achievements'
  | 'black-market'
  | 'profile'
  | 'feed'
  | 'daily'
  | 'friends';

interface NavItem {
  id: DashboardView;
  icon: string;
  label: string;
}

const MAIN_NAV: NavItem[] = [
  { id: 'play', icon: '▶', label: 'Play' },
  { id: 'daily', icon: '◆', label: 'Daily Challenge' },
  { id: 'feed', icon: '◈', label: 'Activity Feed' },
  { id: 'leaderboard', icon: '▲', label: 'Leaderboard' },
  { id: 'achievements', icon: '★', label: 'Achievements' },
  { id: 'black-market', icon: '◉', label: 'Black Market' },
  { id: 'friends', icon: '◎', label: 'Friends' },
];

const ACCOUNT_NAV: NavItem[] = [
  { id: 'profile', icon: '●', label: 'Profile' },
];

interface SidebarProps {
  activeView: DashboardView;
  onViewChange: (view: DashboardView) => void;
  username: string;
  rank: string;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onLogout: () => void;
}

export function Sidebar({
  activeView,
  onViewChange,
  username,
  rank,
  collapsed,
  onToggleCollapse,
  onLogout,
}: SidebarProps) {
  const initials = username.slice(0, 2).toUpperCase();

  return (
    <aside className={`${styles.sidebar} ${collapsed ? styles.sidebarCollapsed : ''}`}>
      <div className={styles.logoSection}>
        <div className={styles.logo}>{collapsed ? 'N' : 'NEONCODE'}</div>
        {!collapsed && <div className={styles.logoSub}>coding arena</div>}
        <button
          className={styles.collapseBtn}
          onClick={onToggleCollapse}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? '→' : '←'}
        </button>
      </div>

      <nav className={styles.nav}>
        {!collapsed && <span className={styles.sectionLabel}>Navigate</span>}
        {MAIN_NAV.map((item) => (
          <button
            key={item.id}
            className={`${styles.navItem} ${activeView === item.id ? styles.navItemActive : ''}`}
            onClick={() => onViewChange(item.id)}
            title={collapsed ? item.label : undefined}
          >
            <span className={styles.navIcon}>{item.icon}</span>
            {!collapsed && item.label}
          </button>
        ))}

        {!collapsed && <span className={styles.sectionLabel}>Account</span>}
        {ACCOUNT_NAV.map((item) => (
          <button
            key={item.id}
            className={`${styles.navItem} ${activeView === item.id ? styles.navItemActive : ''}`}
            onClick={() => onViewChange(item.id)}
            title={collapsed ? item.label : undefined}
          >
            <span className={styles.navIcon}>{item.icon}</span>
            {!collapsed && item.label}
          </button>
        ))}
      </nav>

      <div className={styles.bottomSection}>
        <div className={styles.userInfo}>
          <div className={styles.avatar}>{initials}</div>
          {!collapsed && (
            <div className={styles.userDetails}>
              <div className={styles.userName}>{username}</div>
              <div className={styles.userRank}>{rank}</div>
            </div>
          )}
        </div>
        <button
          className={styles.navItem}
          onClick={onLogout}
          title={collapsed ? 'Log out' : undefined}
        >
          <span className={styles.navIcon}>⏻</span>
          {!collapsed && 'Log out'}
        </button>
      </div>
    </aside>
  );
}
