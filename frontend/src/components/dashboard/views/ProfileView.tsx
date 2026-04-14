import type {
  CompletedChallenge,
  Achievement,
} from '../../../stores/usePlayerStore';
import { RANK_THRESHOLDS } from '../../../stores/usePlayerStore';
import styles from './ProfileView.module.css';

interface ProfileViewProps {
  username: string;
  xp: number;
  credits: number;
  level: number;
  rank: string;
  nextRank: { next: string; remaining: number } | null;
  completedChallenges: CompletedChallenge[];
  achievements: Achievement[];
}

function timeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return 'just now';
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function ProfileView({
  username,
  xp,
  credits,
  level,
  rank,
  nextRank,
  completedChallenges,
  achievements,
}: ProfileViewProps) {
  const initials = username.slice(0, 2).toUpperCase();
  const unlocked = achievements.filter((a) => a.unlockedAt !== null).length;
  const recentChallenges = [...completedChallenges]
    .sort((a, b) => b.completedAt - a.completedAt)
    .slice(0, 5);

  const currentRankThreshold = RANK_THRESHOLDS.filter((t) => xp >= t.xp).pop();
  const nextRankThreshold = RANK_THRESHOLDS.find(
    (t) => t.xp > (currentRankThreshold?.xp ?? 0),
  );
  const progressPercent = nextRankThreshold
    ? ((xp - (currentRankThreshold?.xp ?? 0)) /
        (nextRankThreshold.xp - (currentRankThreshold?.xp ?? 0))) *
      100
    : 100;

  return (
    <div className={styles.view}>
      <p className={styles.label}>Profile</p>

      {/* Runner Card */}
      <div className={styles.runnerCard}>
        <div className={styles.avatar}>{initials}</div>
        <div className={styles.runnerInfo}>
          <h2 className={styles.runnerName}>{username}</h2>
          <p className={styles.runnerRank}>{rank}</p>
          <p className={styles.runnerLevel}>Level {level}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={`${styles.statValue} ${styles.statXp}`}>
            {xp.toLocaleString()}
          </div>
          <div className={styles.statLabel}>Total XP</div>
        </div>
        <div className={styles.statCard}>
          <div className={`${styles.statValue} ${styles.statCredits}`}>
            {credits.toLocaleString()}
          </div>
          <div className={styles.statLabel}>Credits</div>
        </div>
        <div className={styles.statCard}>
          <div className={`${styles.statValue} ${styles.statChallenges}`}>
            {completedChallenges.length}
          </div>
          <div className={styles.statLabel}>Completed</div>
        </div>
        <div className={styles.statCard}>
          <div className={`${styles.statValue} ${styles.statRank}`}>
            {unlocked}/{achievements.length}
          </div>
          <div className={styles.statLabel}>Achievements</div>
        </div>
      </div>

      {/* XP Progress */}
      <div className={styles.progressSection}>
        <div className={styles.progressHeader}>
          <span className={styles.progressLabel}>{xp.toLocaleString()} XP</span>
          {nextRank ? (
            <span className={styles.progressTarget}>
              {nextRank.remaining.toLocaleString()} XP to {nextRank.next}
            </span>
          ) : (
            <span className={styles.progressTarget}>Max rank reached</span>
          )}
        </div>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${Math.min(progressPercent, 100)}%` }}
          />
        </div>
        {!nextRank && (
          <p className={styles.progressMax}>
            You&apos;ve reached the highest rank!
          </p>
        )}
      </div>

      {/* Recent Activity */}
      <div>
        <h3 className={styles.sectionTitle}>Recent Activity</h3>
        {recentChallenges.length === 0 ? (
          <p className={styles.emptyState}>
            No challenges completed yet. Head to the Code Arena to get started.
          </p>
        ) : (
          <div className={styles.activityList}>
            {recentChallenges.map((ch) => (
              <div key={ch.id} className={styles.activityItem}>
                <span className={styles.activityTitle}>{ch.title}</span>
                <div className={styles.activityMeta}>
                  <span className={styles.activityLang}>{ch.language}</span>
                  <span className={styles.activityXp}>+{ch.xpEarned} XP</span>
                  <span className={styles.activityTime}>
                    {timeAgo(ch.completedAt)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Achievements Preview */}
      <div>
        <h3 className={styles.sectionTitle}>
          Achievements ({unlocked}/{achievements.length})
        </h3>
        <div className={styles.achieveGrid}>
          {achievements.slice(0, 6).map((a) => (
            <div
              key={a.id}
              className={
                a.unlockedAt
                  ? styles.achieveCardUnlocked
                  : styles.achieveCardLocked
              }
            >
              <span className={styles.achieveIcon}>{a.icon}</span>
              <span className={styles.achieveName}>{a.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
