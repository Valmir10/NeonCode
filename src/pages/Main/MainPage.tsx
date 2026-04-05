import { useState } from 'react';
import { HackerIntro } from '../../components/landing/HackerIntro';
import {
  Sidebar,
  type DashboardView,
} from '../../components/dashboard/Sidebar';
import { Topbar } from '../../components/dashboard/Topbar';
import { PlaceholderView } from '../../components/dashboard/views/PlaceholderView';
import styles from './MainPage.module.css';

interface MainPageProps {
  username: string;
  onLogout: () => void;
}

const VIEW_CONFIG: Record<
  DashboardView,
  { icon: string; title: string; subtitle: string }
> = {
  play: {
    icon: '⚔️',
    title: 'Code Arena',
    subtitle:
      'Select a challenge and prove your skills. AI-judged, XP-rewarded.',
  },
  leaderboard: {
    icon: '🏆',
    title: 'Leaderboard',
    subtitle: 'See who rules the net. From Script Kiddie to Cyber Architect.',
  },
  achievements: {
    icon: '🎖️',
    title: 'Achievements',
    subtitle: 'Your collection of badges and milestones. Keep grinding.',
  },
  'black-market': {
    icon: '🛒',
    title: 'Black Market',
    subtitle: 'Spend your hard-earned credits on cosmetic upgrades and themes.',
  },
  profile: {
    icon: '👤',
    title: 'Runner Profile',
    subtitle: 'Your stats, your history, your identity in the net.',
  },
};

export function MainPage({ username, onLogout }: MainPageProps) {
  const [activeView, setActiveView] = useState<DashboardView>('play');
  const [showIntro, setShowIntro] = useState(true);

  const config = VIEW_CONFIG[activeView];

  return (
    <>
      {showIntro && <HackerIntro onComplete={() => setShowIntro(false)} />}
      <div className={styles.layout}>
        <Sidebar
          activeView={activeView}
          onViewChange={setActiveView}
          username={username}
          onLogout={onLogout}
        />
        <div className={styles.main}>
          <Topbar activeView={activeView} xp={0} credits={100} level={1} />
          <div className={styles.content}>
            <PlaceholderView
              icon={config.icon}
              title={config.title}
              subtitle={config.subtitle}
            />
          </div>
        </div>
      </div>
    </>
  );
}
