import type { Achievement } from '../../../stores/usePlayerStore';
import styles from './AchievementsView.module.css';

interface AchievementsViewProps {
  achievements: Achievement[];
}

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function AchievementsView({ achievements }: AchievementsViewProps) {
  const unlocked = achievements.filter((a) => a.unlockedAt !== null);

  return (
    <div className={styles.view}>
      <p className={styles.label}>// Your Collection</p>
      <h2 className={styles.title}>Achievements</h2>
      <p className={styles.progress}>
        {unlocked.length}{' '}
        <span className={styles.progressTotal}>
          / {achievements.length} Unlocked
        </span>
      </p>

      <div className={styles.grid}>
        {achievements.map((a) => {
          const isUnlocked = a.unlockedAt !== null;
          return (
            <div
              key={a.id}
              className={isUnlocked ? styles.cardUnlocked : styles.cardLocked}
            >
              {!isUnlocked && <span className={styles.lockOverlay}>🔒</span>}
              <span className={styles.icon}>{a.icon}</span>
              <h3 className={styles.name}>{a.name}</h3>
              <p className={styles.description}>{a.description}</p>
              {isUnlocked && (
                <span className={styles.unlockedDate}>
                  Unlocked {formatDate(a.unlockedAt!)}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
