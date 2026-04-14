import { useMemo } from 'react';
import type {
  CompletedChallenge,
  Achievement,
  Rank,
} from '../../../stores/usePlayerStore';
import styles from './FeedView.module.css';

interface FeedViewProps {
  username: string;
  completedChallenges: CompletedChallenge[];
  achievements: Achievement[];
  xp: number;
  rank: Rank;
}

interface FeedItem {
  id: string;
  type: 'challenge' | 'achievement' | 'rank' | 'system';
  title: string;
  description: string;
  timestamp: number;
  icon: string;
  accent: 'cyan' | 'lime' | 'magenta' | 'yellow';
}

const SYSTEM_POSTS: FeedItem[] = [
  {
    id: 'sys-welcome',
    type: 'system',
    title: 'Welcome to NeonCode',
    description:
      'Start completing challenges to see your activity here. Try the Daily Challenge for bonus XP!',
    timestamp: Date.now() - 3600000,
    icon: '◈',
    accent: 'cyan',
  },
  {
    id: 'sys-tip-1',
    type: 'system',
    title: 'Tip: Use hints wisely',
    description:
      'Stuck on a challenge? Use the hint button for guidance without losing XP. Revealing the answer gives no XP.',
    timestamp: Date.now() - 7200000,
    icon: '◇',
    accent: 'yellow',
  },
  {
    id: 'sys-tip-2',
    type: 'system',
    title: 'Tip: Try different languages',
    description:
      'Complete challenges in 3 different languages to unlock the Polyglot achievement.',
    timestamp: Date.now() - 10800000,
    icon: '◇',
    accent: 'yellow',
  },
];

function timeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function FeedView({
  username,
  completedChallenges,
  achievements,
  xp,
  rank,
}: FeedViewProps) {
  const feedItems = useMemo(() => {
    const items: FeedItem[] = [];

    for (const c of completedChallenges) {
      items.push({
        id: `challenge-${c.id}`,
        type: 'challenge',
        title: `Completed: ${c.title}`,
        description: `${username} solved a ${c.difficulty} ${c.language} challenge and earned ${c.xpEarned} XP.`,
        timestamp: c.completedAt,
        icon: '▶',
        accent:
          c.difficulty === 'hard'
            ? 'magenta'
            : c.difficulty === 'medium'
              ? 'yellow'
              : 'cyan',
      });
    }

    for (const a of achievements) {
      if (a.unlockedAt) {
        items.push({
          id: `achievement-${a.id}`,
          type: 'achievement',
          title: `Achievement Unlocked: ${a.name}`,
          description: a.description,
          timestamp: a.unlockedAt,
          icon: '★',
          accent: 'lime',
        });
      }
    }

    items.push(...SYSTEM_POSTS);

    items.sort((a, b) => b.timestamp - a.timestamp);

    return items;
  }, [completedChallenges, achievements, username]);

  return (
    <div className={styles.feed}>
      <div className={styles.header}>
        <h2 className={styles.title}>Activity Feed</h2>
        <p className={styles.subtitle}>Your recent activity and updates</p>
      </div>

      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <span className={styles.statNumber}>
            {completedChallenges.length}
          </span>
          <span className={styles.statLabel}>Challenges</span>
        </div>
        <div className={styles.statCard}>
          <span className={`${styles.statNumber} ${styles.xpColor}`}>
            {xp.toLocaleString()}
          </span>
          <span className={styles.statLabel}>Total XP</span>
        </div>
        <div className={styles.statCard}>
          <span className={`${styles.statNumber} ${styles.rankColor}`}>
            {rank}
          </span>
          <span className={styles.statLabel}>Current Rank</span>
        </div>
        <div className={styles.statCard}>
          <span className={`${styles.statNumber} ${styles.achieveColor}`}>
            {achievements.filter((a) => a.unlockedAt).length}/
            {achievements.length}
          </span>
          <span className={styles.statLabel}>Achievements</span>
        </div>
      </div>

      <div className={styles.feedList}>
        {feedItems.map((item) => (
          <div
            key={item.id}
            className={`${styles.feedItem} ${styles[`accent_${item.accent}`]}`}
          >
            <div className={styles.feedIcon}>{item.icon}</div>
            <div className={styles.feedContent}>
              <div className={styles.feedTitle}>{item.title}</div>
              <div className={styles.feedDesc}>{item.description}</div>
              <div className={styles.feedTime}>{timeAgo(item.timestamp)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
