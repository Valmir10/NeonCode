import { useState } from 'react';
import styles from './ChallengeSelect.module.css';

export type ChallengeLanguage =
  | 'JavaScript'
  | 'Python'
  | 'Java'
  | 'C'
  | 'TypeScript';

export type ChallengeDifficulty = 'easy' | 'medium' | 'hard';

export interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: ChallengeDifficulty;
  xp: number;
  language: ChallengeLanguage;
  status: 'new' | 'in-progress' | 'completed';
}

export interface ActiveQuest {
  challenge: Challenge;
  code: string;
}

const LANGUAGES: ChallengeLanguage[] = [
  'JavaScript',
  'Python',
  'Java',
  'C',
  'TypeScript',
];

const DIFFICULTIES: { id: ChallengeDifficulty; label: string; desc: string }[] =
  [
    {
      id: 'easy',
      label: 'Easy',
      desc: 'Fundamentals — variables, loops, conditions. Real-world basics.',
    },
    {
      id: 'medium',
      label: 'Medium',
      desc: 'Intermediate — algorithms, data structures, data manipulation.',
    },
    {
      id: 'hard',
      label: 'Hard',
      desc: 'Advanced — complex problems, optimization, design patterns.',
    },
  ];

const LANG_ICONS: Record<ChallengeLanguage, string> = {
  JavaScript: '⚡',
  Python: '🐍',
  Java: '☕',
  C: '⚙️',
  TypeScript: '🔷',
};

const DIFF_STYLE: Record<ChallengeDifficulty, string> = {
  easy: styles.diffEasy,
  medium: styles.diffMedium,
  hard: styles.diffHard,
};

function calculateXp(
  difficulty: ChallengeDifficulty,
  playerLevel: number,
): number {
  const base: Record<ChallengeDifficulty, number> = {
    easy: 100,
    medium: 350,
    hard: 750,
  };
  const difficultyIndex = { easy: 1, medium: 2, hard: 3 };
  const bonus =
    playerLevel <= difficultyIndex[difficulty]
      ? 1
      : Math.max(0.5, 1 - (playerLevel - difficultyIndex[difficulty]) * 0.15);
  const overLevelBonus =
    playerLevel < difficultyIndex[difficulty]
      ? 1 + (difficultyIndex[difficulty] - playerLevel) * 0.3
      : 1;
  return Math.round(base[difficulty] * bonus * overLevelBonus);
}

interface ChallengeSelectProps {
  activeQuests: ActiveQuest[];
  playerLevel: number;
  onStartNewChallenge: (
    language: ChallengeLanguage,
    difficulty: ChallengeDifficulty,
  ) => void;
  onResumeQuest: (quest: ActiveQuest) => void;
}

export function ChallengeSelect({
  activeQuests,
  playerLevel,
  onStartNewChallenge,
  onResumeQuest,
}: ChallengeSelectProps) {
  const [selectedLang, setSelectedLang] =
    useState<ChallengeLanguage>('JavaScript');
  const [selectedDiff, setSelectedDiff] = useState<ChallengeDifficulty>('easy');

  const filteredQuests = activeQuests.filter(
    (q) =>
      q.challenge.language === selectedLang &&
      q.challenge.difficulty === selectedDiff,
  );

  const xpReward = calculateXp(selectedDiff, playerLevel);

  return (
    <div className={styles.view}>
      <div className={styles.header}>
        <p className={styles.label}>Code Arena</p>
        <h2 className={styles.title}>Select Your Challenge</h2>
        <p className={styles.subtitle}>
          Choose a language and difficulty to generate a new challenge.
        </p>
      </div>

      {/* Language Selection */}
      <div>
        <h3 className={styles.sectionTitle}>Language</h3>
        <div className={styles.langGrid}>
          {LANGUAGES.map((lang) => (
            <button
              key={lang}
              className={`${styles.langCard} ${selectedLang === lang ? styles.langCardActive : ''}`}
              onClick={() => setSelectedLang(lang)}
            >
              <span className={styles.langIcon}>{LANG_ICONS[lang]}</span>
              <span className={styles.langName}>{lang}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Difficulty Selection */}
      <div>
        <h3 className={styles.sectionTitle}>Difficulty</h3>
        <div className={styles.diffGrid}>
          {DIFFICULTIES.map((diff) => (
            <button
              key={diff.id}
              className={`${styles.diffCard} ${DIFF_STYLE[diff.id]} ${selectedDiff === diff.id ? styles.diffCardActive : ''}`}
              onClick={() => setSelectedDiff(diff.id)}
            >
              <span className={styles.diffLabel}>{diff.label}</span>
              <span className={styles.diffDesc}>{diff.desc}</span>
              <span className={styles.diffXp}>
                +{calculateXp(diff.id, playerLevel)} XP
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Active Quests */}
      {filteredQuests.length > 0 && (
        <div>
          <h3 className={styles.sectionTitle}>Active Quests</h3>
          <div className={styles.grid}>
            {filteredQuests.map((quest) => (
              <div
                key={quest.challenge.id}
                className={styles.questCard}
                onClick={() => onResumeQuest(quest)}
              >
                <div className={styles.questHeader}>
                  <span className={styles.questStatus}>In Progress</span>
                  <span className={styles.questLang}>
                    {quest.challenge.language}
                  </span>
                </div>
                <span className={styles.cardTitle}>
                  {quest.challenge.title}
                </span>
                <p className={styles.cardDesc}>{quest.challenge.description}</p>
                <div className={styles.cardFooter}>
                  <span className={styles.cardXp}>
                    +{quest.challenge.xp} XP
                  </span>
                  <span className={styles.resumeTag}>Resume →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Start New Mission */}
      <div className={styles.featured}>
        <div
          className={styles.featuredCard}
          onClick={() => onStartNewChallenge(selectedLang, selectedDiff)}
        >
          <div className={styles.featuredInfo}>
            <p className={styles.featuredLabel}>
              <span className={styles.pulse} />
              New Mission
            </p>
            <h3 className={styles.featuredTitle}>
              Generate {selectedDiff} {selectedLang} Challenge
            </h3>
            <p className={styles.featuredDesc}>
              A unique challenge will be generated based on your
              selection.
              {playerLevel === 1 && selectedDiff !== 'easy' && (
                <span className={styles.bonusText}>
                  {' '}
                  Bonus XP for attempting above your level!
                </span>
              )}
            </p>
            <div className={styles.featuredMeta}>
              <span className={`${styles.metaTag} ${styles.metaTagDifficulty}`}>
                {selectedDiff}
              </span>
              <span className={`${styles.metaTag} ${styles.metaTagXp}`}>
                +{xpReward} XP
              </span>
              <span className={`${styles.metaTag} ${styles.metaTagLang}`}>
                {selectedLang}
              </span>
            </div>
          </div>
          <div className={styles.featuredAction}>
            <button className={styles.startBtn}>Start</button>
          </div>
        </div>
      </div>
    </div>
  );
}
