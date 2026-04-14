import { useState, useCallback } from 'react';

export type Rank =
  | 'Script Kiddie'
  | 'Code Monkey'
  | 'Netrunner'
  | 'Cyber Ghost'
  | 'Cyber Architect';

export interface CompletedChallenge {
  id: string;
  title: string;
  language: string;
  difficulty: string;
  xpEarned: number;
  completedAt: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: number | null;
}

const RANK_THRESHOLDS: { rank: Rank; xp: number }[] = [
  { rank: 'Script Kiddie', xp: 0 },
  { rank: 'Code Monkey', xp: 500 },
  { rank: 'Netrunner', xp: 2000 },
  { rank: 'Cyber Ghost', xp: 5000 },
  { rank: 'Cyber Architect', xp: 10000 },
];

const ALL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-blood',
    name: 'First Blood',
    description: 'Complete your first challenge',
    icon: '🩸',
    unlockedAt: null,
  },
  {
    id: 'streak-3',
    name: 'Hat Trick',
    description: 'Complete 3 challenges',
    icon: '🎩',
    unlockedAt: null,
  },
  {
    id: 'streak-10',
    name: 'Unstoppable',
    description: 'Complete 10 challenges',
    icon: '🔥',
    unlockedAt: null,
  },
  {
    id: 'easy-master',
    name: 'Tutorial Complete',
    description: 'Complete 5 easy challenges',
    icon: '📗',
    unlockedAt: null,
  },
  {
    id: 'medium-master',
    name: 'Rising Threat',
    description: 'Complete 5 medium challenges',
    icon: '📙',
    unlockedAt: null,
  },
  {
    id: 'hard-master',
    name: 'Elite Hacker',
    description: 'Complete 3 hard challenges',
    icon: '📕',
    unlockedAt: null,
  },
  {
    id: 'polyglot',
    name: 'Polyglot',
    description: 'Complete challenges in 3 different languages',
    icon: '🌐',
    unlockedAt: null,
  },
  {
    id: 'xp-1000',
    name: 'Kilobyte',
    description: 'Earn 1,000 XP',
    icon: '💾',
    unlockedAt: null,
  },
  {
    id: 'xp-5000',
    name: 'Megabyte',
    description: 'Earn 5,000 XP',
    icon: '💿',
    unlockedAt: null,
  },
  {
    id: 'rank-netrunner',
    name: 'Jacked In',
    description: 'Reach Netrunner rank',
    icon: '🧠',
    unlockedAt: null,
  },
  {
    id: 'rank-architect',
    name: 'Architect',
    description: 'Reach Cyber Architect rank',
    icon: '👑',
    unlockedAt: null,
  },
  {
    id: 'big-spender',
    name: 'Big Spender',
    description: 'Spend 500 credits in the Black Market',
    icon: '💸',
    unlockedAt: null,
  },
];

function getRank(xp: number): Rank {
  let current: Rank = 'Script Kiddie';
  for (const t of RANK_THRESHOLDS) {
    if (xp >= t.xp) current = t.rank;
  }
  return current;
}

function getLevel(xp: number): number {
  return Math.floor(xp / 100) + 1;
}

function getXpToNextRank(xp: number): { next: Rank; remaining: number } | null {
  for (const t of RANK_THRESHOLDS) {
    if (xp < t.xp) return { next: t.rank, remaining: t.xp - xp };
  }
  return null;
}

function checkAchievements(
  achievements: Achievement[],
  completed: CompletedChallenge[],
  totalXp: number,
  creditsSpent: number,
): Achievement[] {
  const now = Date.now();
  const updated = achievements.map((a) => ({ ...a }));

  const unlock = (id: string) => {
    const a = updated.find((x) => x.id === id);
    if (a && !a.unlockedAt) a.unlockedAt = now;
  };

  if (completed.length >= 1) unlock('first-blood');
  if (completed.length >= 3) unlock('streak-3');
  if (completed.length >= 10) unlock('streak-10');

  const easy = completed.filter((c) => c.difficulty === 'easy').length;
  const medium = completed.filter((c) => c.difficulty === 'medium').length;
  const hard = completed.filter((c) => c.difficulty === 'hard').length;
  if (easy >= 5) unlock('easy-master');
  if (medium >= 5) unlock('medium-master');
  if (hard >= 3) unlock('hard-master');

  const langs = new Set(completed.map((c) => c.language));
  if (langs.size >= 3) unlock('polyglot');

  if (totalXp >= 1000) unlock('xp-1000');
  if (totalXp >= 5000) unlock('xp-5000');

  const rank = getRank(totalXp);
  if (
    rank === 'Netrunner' ||
    rank === 'Cyber Ghost' ||
    rank === 'Cyber Architect'
  )
    unlock('rank-netrunner');
  if (rank === 'Cyber Architect') unlock('rank-architect');

  if (creditsSpent >= 500) unlock('big-spender');

  return updated;
}

export function usePlayerStore(username: string) {
  const [xp, setXp] = useState(0);
  const [credits, setCredits] = useState(100);
  const [creditsSpent, setCreditsSpent] = useState(0);
  const [completedChallenges, setCompletedChallenges] = useState<
    CompletedChallenge[]
  >([]);
  const [achievements, setAchievements] =
    useState<Achievement[]>(ALL_ACHIEVEMENTS);

  const rank = getRank(xp);
  const level = getLevel(xp);
  const nextRank = getXpToNextRank(xp);

  const awardXp = useCallback(
    (
      amount: number,
      challenge: {
        id: string;
        title: string;
        language: string;
        difficulty: string;
      },
    ) => {
      setXp((prev) => {
        const newXp = prev + amount;
        return newXp;
      });
      setCredits((prev) => prev + Math.floor(amount / 2));

      const completed: CompletedChallenge = {
        ...challenge,
        xpEarned: amount,
        completedAt: Date.now(),
      };

      setCompletedChallenges((prev) => {
        const newList = [...prev, completed];
        setAchievements((achPrev) =>
          checkAchievements(achPrev, newList, xp + amount, creditsSpent),
        );
        return newList;
      });
    },
    [xp, creditsSpent],
  );

  const spendCredits = useCallback(
    (amount: number): boolean => {
      if (credits < amount) return false;
      setCredits((prev) => prev - amount);
      setCreditsSpent((prev) => {
        const newSpent = prev + amount;
        setAchievements((achPrev) =>
          checkAchievements(achPrev, completedChallenges, xp, newSpent),
        );
        return newSpent;
      });
      return true;
    },
    [credits, completedChallenges, xp],
  );

  return {
    username,
    xp,
    credits,
    level,
    rank,
    nextRank,
    completedChallenges,
    achievements,
    awardXp,
    spendCredits,
  };
}

export { RANK_THRESHOLDS, getRank, getLevel };
