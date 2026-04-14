import { useMemo } from 'react';
import type { CompletedChallenge } from '../../../stores/usePlayerStore';
import type { ChallengeLanguage, ChallengeDifficulty } from './ChallengeSelect';
import styles from './DailyChallengeView.module.css';

interface DailyChallengeViewProps {
  playerLevel: number;
  onStartChallenge: (language: ChallengeLanguage, difficulty: ChallengeDifficulty) => void;
  completedChallenges: CompletedChallenge[];
}

interface DailyTask {
  id: string;
  title: string;
  description: string;
  language: ChallengeLanguage;
  difficulty: ChallengeDifficulty;
  bonusXp: number;
}

function getDailyTasks(): DailyTask[] {
  // Rotate tasks based on day of year for variety
  const now = new Date();
  const dayOfYear = Math.floor(
    (now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000,
  );

  const languages: ChallengeLanguage[] = ['JavaScript', 'Python', 'TypeScript', 'Java', 'C'];
  const langIndex = dayOfYear % languages.length;

  return [
    {
      id: `daily-easy-${dayOfYear}`,
      title: 'Warm Up',
      description: `Solve an easy ${languages[langIndex]} challenge to start your day.`,
      language: languages[langIndex],
      difficulty: 'easy',
      bonusXp: 50,
    },
    {
      id: `daily-medium-${dayOfYear}`,
      title: 'Main Quest',
      description: `Take on a medium ${languages[(langIndex + 1) % languages.length]} challenge.`,
      language: languages[(langIndex + 1) % languages.length],
      difficulty: 'medium',
      bonusXp: 150,
    },
    {
      id: `daily-hard-${dayOfYear}`,
      title: 'Boss Fight',
      description: `Conquer a hard ${languages[(langIndex + 2) % languages.length]} challenge for massive rewards.`,
      language: languages[(langIndex + 2) % languages.length],
      difficulty: 'hard',
      bonusXp: 300,
    },
  ];
}

export function DailyChallengeView({
  playerLevel,
  onStartChallenge,
  completedChallenges,
}: DailyChallengeViewProps) {
  const tasks = useMemo(() => getDailyTasks(), []);
  const todayStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayCompletions = completedChallenges.filter(
    (c) => c.completedAt >= todayStart.getTime(),
  ).length;

  const streak = useMemo(() => {
    if (completedChallenges.length === 0) return 0;
    let count = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 30; i++) {
      const dayStart = new Date(today);
      dayStart.setDate(dayStart.getDate() - i);
      const dayEnd = new Date(dayStart);
      dayEnd.setDate(dayEnd.getDate() + 1);

      const hasCompletion = completedChallenges.some(
        (c) => c.completedAt >= dayStart.getTime() && c.completedAt < dayEnd.getTime(),
      );

      if (hasCompletion) {
        count++;
      } else if (i > 0) {
        break;
      }
    }
    return count;
  }, [completedChallenges]);

  return (
    <div className={styles.daily}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Daily Challenges</h2>
          <p className={styles.date}>{todayStr}</p>
        </div>
        <div className={styles.streakBadge}>
          <span className={styles.streakNumber}>{streak}</span>
          <span className={styles.streakLabel}>day streak</span>
        </div>
      </div>

      <div className={styles.progress}>
        <div className={styles.progressLabel}>
          Today&apos;s progress: {todayCompletions} challenge{todayCompletions !== 1 ? 's' : ''} completed
        </div>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${Math.min((todayCompletions / 3) * 100, 100)}%` }}
          />
        </div>
      </div>

      <div className={styles.taskGrid}>
        {tasks.map((task) => (
          <div key={task.id} className={`${styles.taskCard} ${styles[`difficulty_${task.difficulty}`]}`}>
            <div className={styles.taskHeader}>
              <span className={styles.taskTitle}>{task.title}</span>
              <span className={`${styles.taskDiff} ${styles[`diff_${task.difficulty}`]}`}>
                {task.difficulty}
              </span>
            </div>
            <p className={styles.taskDesc}>{task.description}</p>
            <div className={styles.taskFooter}>
              <span className={styles.taskBonus}>+{task.bonusXp} bonus XP</span>
              <button
                className={styles.startBtn}
                onClick={() => onStartChallenge(task.language, task.difficulty)}
              >
                Start
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.tipSection}>
        <p className={styles.tipTitle}>How it works</p>
        <ul className={styles.tipList}>
          <li>Daily challenges rotate each day with new languages and difficulties</li>
          <li>Complete all three for maximum XP and to maintain your streak</li>
          <li>Bonus XP is awarded on top of the regular challenge XP (Level {playerLevel} bonus applies)</li>
        </ul>
      </div>
    </div>
  );
}
