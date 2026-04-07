import { useState, useCallback } from 'react';
import * as api from '../../services/api';
import { HackerIntro } from '../../components/landing/HackerIntro';
import {
  Sidebar,
  type DashboardView,
} from '../../components/dashboard/Sidebar';
import { Topbar } from '../../components/dashboard/Topbar';
import { PlaceholderView } from '../../components/dashboard/views/PlaceholderView';
import {
  ChallengeSelect,
  type Challenge,
  type ChallengeLanguage,
  type ChallengeDifficulty,
  type ActiveQuest,
} from '../../components/dashboard/views/ChallengeSelect';
import { CodeEditorView } from '../../components/dashboard/views/CodeEditorView';
import styles from './MainPage.module.css';

interface MainPageProps {
  username: string;
  onLogout: () => void;
}

const PLACEHOLDER_CONFIG: Partial<
  Record<DashboardView, { icon: string; title: string; subtitle: string }>
> = {
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

const XP_BASE: Record<ChallengeDifficulty, number> = {
  easy: 100,
  medium: 350,
  hard: 750,
};

export interface ChallengeData {
  expectedOutput: string;
  sampleSolution: string;
}

export function MainPage({ username, onLogout }: MainPageProps) {
  const [activeView, setActiveView] = useState<DashboardView>('play');
  const [showIntro, setShowIntro] = useState(true);
  const [activeChallenge, setActiveChallenge] = useState<Challenge | null>(
    null,
  );
  const [challengeData, setChallengeData] = useState<ChallengeData | null>(
    null,
  );
  const [activeQuests, setActiveQuests] = useState<ActiveQuest[]>([]);
  const [currentCode, setCurrentCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [playerStats] = useState({ xp: 0, credits: 100, level: 1 });

  const saveCurrentQuest = useCallback(() => {
    if (!activeChallenge || !currentCode) return;
    setActiveQuests((prev) => {
      const existing = prev.find((q) => q.challenge.id === activeChallenge.id);
      if (existing) {
        return prev.map((q) =>
          q.challenge.id === activeChallenge.id
            ? { ...q, code: currentCode }
            : q,
        );
      }
      return [
        ...prev,
        {
          challenge: { ...activeChallenge, status: 'in-progress' },
          code: currentCode,
        },
      ];
    });
  }, [activeChallenge, currentCode]);

  const handleViewChange = (view: DashboardView) => {
    saveCurrentQuest();
    setActiveChallenge(null);
    setChallengeData(null);
    setCurrentCode('');
    setActiveView(view);
  };

  const handleStartNewChallenge = useCallback(
    async (language: ChallengeLanguage, difficulty: ChallengeDifficulty) => {
      setLoading(true);
      try {
        const generated = await api.generateChallenge(language, difficulty);
        const challenge: Challenge = {
          id: `gen-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          title: generated.title,
          description: generated.description,
          difficulty,
          xp: XP_BASE[difficulty],
          language,
          status: 'new',
        };
        setChallengeData({
          expectedOutput: generated.expectedOutput,
          sampleSolution: generated.sampleSolution,
        });
        setActiveChallenge(challenge);
        setCurrentCode('');
      } catch (error) {
        console.error('Failed to generate challenge:', error);
        const msg = error instanceof Error ? error.message : 'Unknown error';
        alert(`Failed to generate challenge: ${msg}`);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const handleResumeQuest = useCallback((quest: ActiveQuest) => {
    setActiveChallenge(quest.challenge);
    setCurrentCode(quest.code);
    setChallengeData(null);
  }, []);

  const handleSkip = () => {
    if (activeChallenge) {
      setActiveQuests((prev) =>
        prev.filter((q) => q.challenge.id !== activeChallenge.id),
      );
    }
    setActiveChallenge(null);
    setChallengeData(null);
    setCurrentCode('');
  };

  const handleBackFromEditor = () => {
    saveCurrentQuest();
    setActiveChallenge(null);
    setChallengeData(null);
    setCurrentCode('');
  };

  const renderContent = () => {
    if (activeView === 'play') {
      if (loading) {
        return (
          <div className={styles.loadingContainer}>
            <div className={styles.loadingText}>
              &gt; GENERATING CHALLENGE...
            </div>
            <div className={styles.loadingSubtext}>
              AI Fixer is crafting your mission
            </div>
          </div>
        );
      }
      if (activeChallenge) {
        return (
          <CodeEditorView
            challenge={activeChallenge}
            challengeData={challengeData}
            initialCode={currentCode}
            onBack={handleBackFromEditor}
            onSkip={handleSkip}
            onCodeChange={setCurrentCode}
          />
        );
      }
      return (
        <ChallengeSelect
          activeQuests={activeQuests}
          playerLevel={playerStats.level}
          onStartNewChallenge={handleStartNewChallenge}
          onResumeQuest={handleResumeQuest}
        />
      );
    }

    const config = PLACEHOLDER_CONFIG[activeView];
    if (!config) return null;

    return (
      <PlaceholderView
        icon={config.icon}
        title={config.title}
        subtitle={config.subtitle}
      />
    );
  };

  return (
    <>
      {showIntro && <HackerIntro onComplete={() => setShowIntro(false)} />}
      <div className={styles.layout}>
        <Sidebar
          activeView={activeView}
          onViewChange={handleViewChange}
          username={username}
          onLogout={onLogout}
        />
        <div className={styles.main}>
          <Topbar
            activeView={activeView}
            xp={playerStats.xp}
            credits={playerStats.credits}
            level={playerStats.level}
          />
          <div
            className={
              activeView === 'play' && activeChallenge
                ? styles.contentFull
                : styles.content
            }
          >
            {renderContent()}
          </div>
        </div>
      </div>
    </>
  );
}
