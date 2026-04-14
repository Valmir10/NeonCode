import { useState, useCallback } from 'react';
import * as api from '../../services/api';
import { usePlayerStore } from '../../stores/usePlayerStore';
import { HackerIntro } from '../../components/landing/HackerIntro';
import {
  Sidebar,
  type DashboardView,
} from '../../components/dashboard/Sidebar';
import { Topbar } from '../../components/dashboard/Topbar';
import {
  ChallengeSelect,
  type Challenge,
  type ChallengeLanguage,
  type ChallengeDifficulty,
  type ActiveQuest,
} from '../../components/dashboard/views/ChallengeSelect';
import { CodeEditorView } from '../../components/dashboard/views/CodeEditorView';
import { LeaderboardView } from '../../components/dashboard/views/LeaderboardView';
import { AchievementsView } from '../../components/dashboard/views/AchievementsView';
import { ProfileView } from '../../components/dashboard/views/ProfileView';
import { BlackMarketView } from '../../components/dashboard/views/BlackMarketView';
import { FeedView } from '../../components/dashboard/views/FeedView';
import { DailyChallengeView } from '../../components/dashboard/views/DailyChallengeView';
import { FriendsView } from '../../components/dashboard/views/FriendsView';
import { useFriendsStore } from '../../stores/useFriendsStore';
import styles from './MainPage.module.css';

interface MainPageProps {
  username: string;
  onLogout: () => void;
}

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
  const player = usePlayerStore(username);
  const friendsStore = useFriendsStore();

  const [activeView, setActiveView] = useState<DashboardView>('play');
  const [showIntro, setShowIntro] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeChallenge, setActiveChallenge] = useState<Challenge | null>(
    null,
  );
  const [challengeData, setChallengeData] = useState<ChallengeData | null>(
    null,
  );
  const [activeQuests, setActiveQuests] = useState<ActiveQuest[]>([]);
  const [currentCode, setCurrentCode] = useState('');
  const [loading, setLoading] = useState(false);

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

  const handleChallengeComplete = useCallback(
    (challenge: Challenge) => {
      player.awardXp(challenge.xp, {
        id: challenge.id,
        title: challenge.title,
        language: challenge.language,
        difficulty: challenge.difficulty,
      });
      setActiveQuests((prev) =>
        prev.filter((q) => q.challenge.id !== challenge.id),
      );
    },
    [player],
  );

  const renderContent = () => {
    if (activeView === 'play') {
      if (loading) {
        return (
          <div className={styles.loadingContainer}>
            <div className={styles.loadingSpinner} />
            <div className={styles.loadingText}>Generating challenge...</div>
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
            onChallengeComplete={handleChallengeComplete}
          />
        );
      }
      return (
        <ChallengeSelect
          activeQuests={activeQuests}
          playerLevel={player.level}
          onStartNewChallenge={handleStartNewChallenge}
          onResumeQuest={handleResumeQuest}
        />
      );
    }

    switch (activeView) {
      case 'daily':
        return (
          <DailyChallengeView
            playerLevel={player.level}
            onStartChallenge={(lang, diff) => {
              handleViewChange('play');
              handleStartNewChallenge(lang, diff);
            }}
            completedChallenges={player.completedChallenges}
          />
        );
      case 'feed':
        return (
          <FeedView
            username={player.username}
            completedChallenges={player.completedChallenges}
            achievements={player.achievements}
            xp={player.xp}
            rank={player.rank}
          />
        );
      case 'leaderboard':
        return (
          <LeaderboardView
            playerUsername={player.username}
            playerXp={player.xp}
          />
        );
      case 'achievements':
        return <AchievementsView achievements={player.achievements} />;
      case 'profile':
        return (
          <ProfileView
            username={player.username}
            xp={player.xp}
            credits={player.credits}
            level={player.level}
            rank={player.rank}
            nextRank={player.nextRank}
            completedChallenges={player.completedChallenges}
            achievements={player.achievements}
          />
        );
      case 'black-market':
        return (
          <BlackMarketView
            credits={player.credits}
            onPurchase={player.spendCredits}
          />
        );
      case 'friends':
        return (
          <FriendsView
            friends={friendsStore.friends}
            onlineFriends={friendsStore.onlineFriends}
            offlineFriends={friendsStore.offlineFriends}
            onAddFriend={friendsStore.addFriend}
            onRemoveFriend={friendsStore.removeFriend}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      {showIntro && <HackerIntro onComplete={() => setShowIntro(false)} />}
      <div className={styles.layout}>
        <Sidebar
          activeView={activeView}
          onViewChange={handleViewChange}
          username={player.username}
          rank={player.rank}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          onLogout={onLogout}
        />
        <div className={styles.main}>
          <Topbar
            activeView={activeView}
            xp={player.xp}
            credits={player.credits}
            level={player.level}
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
