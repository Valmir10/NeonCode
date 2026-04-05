import { useState, useCallback } from 'react';
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

// Placeholder AI challenge generator — will be replaced with Gemini API
function generateChallenge(
  language: ChallengeLanguage,
  difficulty: ChallengeDifficulty,
): Challenge {
  const easyQuestions: Record<string, { title: string; desc: string }[]> = {
    JavaScript: [
      {
        title: 'Age Checker',
        desc: 'Write a function that takes an age as input and returns whether the person is old enough to drive (18+). Return "Can drive" or "Too young".',
      },
      {
        title: 'Sum Calculator',
        desc: 'Write a function that takes an array of numbers and returns their sum. Handle empty arrays by returning 0.',
      },
      {
        title: 'Even or Odd',
        desc: 'Write a function that takes a number and returns "even" if the number is even, and "odd" if it is odd.',
      },
    ],
    Python: [
      {
        title: 'List Sorter',
        desc: 'Write a function that takes a list of numbers and returns them sorted from smallest to largest without using the built-in sort method.',
      },
      {
        title: 'Word Counter',
        desc: 'Write a function that takes a string and returns the number of words in it.',
      },
      {
        title: 'Temperature Converter',
        desc: 'Write a function that converts Celsius to Fahrenheit. The formula is: F = C * 9/5 + 32.',
      },
    ],
    TypeScript: [
      {
        title: 'Type Guard',
        desc: 'Write a function that takes a value of type string | number and returns true if it is a string, false otherwise. Use proper TypeScript type narrowing.',
      },
      {
        title: 'Interface Builder',
        desc: 'Create an interface for a User with name (string), age (number), and email (string). Then write a function that takes a User and returns a greeting string.',
      },
      {
        title: 'Array Typer',
        desc: 'Write a generic function that takes an array of any type and returns the first element, or undefined if the array is empty.',
      },
    ],
    Java: [
      {
        title: 'Hello Method',
        desc: 'Write a method that takes a name as a String parameter and returns "Hello, [name]!" as a greeting.',
      },
      {
        title: 'Max Finder',
        desc: 'Write a method that takes an array of integers and returns the largest value.',
      },
      {
        title: 'Palindrome Check',
        desc: 'Write a method that takes a String and returns true if it reads the same forwards and backwards.',
      },
    ],
    C: [
      {
        title: 'Swap Values',
        desc: 'Write a function that takes two integer pointers and swaps their values.',
      },
      {
        title: 'String Length',
        desc: 'Write a function that calculates the length of a string without using strlen().',
      },
      {
        title: 'Factorial',
        desc: 'Write a function that calculates the factorial of a non-negative integer.',
      },
    ],
  };

  const mediumQuestions: Record<string, { title: string; desc: string }[]> = {
    JavaScript: [
      {
        title: 'Data Heist',
        desc: 'Write a function that takes an array of objects with {name, value} and returns the object with the highest value. If two objects tie, return the first one found.',
      },
      {
        title: 'Cipher Decoder',
        desc: 'Write a function that decodes a Caesar cipher. Take a string and a shift number, and return the decoded message by shifting each letter back.',
      },
    ],
    Python: [
      {
        title: 'Matrix Scanner',
        desc: 'Write a function that takes a 2D list (matrix) and returns the sum of all elements on the main diagonal.',
      },
      {
        title: 'Frequency Analyzer',
        desc: 'Write a function that takes a string and returns a dictionary with the frequency count of each character (ignore spaces).',
      },
    ],
    TypeScript: [
      {
        title: 'Generic Cache',
        desc: 'Implement a simple Cache<T> class with get(key), set(key, value), and has(key) methods. Use a Map internally.',
      },
      {
        title: 'Type Transformer',
        desc: 'Write a function that takes an array of {id: number, name: string} objects and returns a Record<number, string> mapping id to name.',
      },
    ],
    Java: [
      {
        title: 'Stack Overflow',
        desc: 'Implement a Stack class using an array with push, pop, and peek methods. Throw an exception when popping from an empty stack.',
      },
      {
        title: 'Binary Search',
        desc: 'Write a method that performs binary search on a sorted array and returns the index of the target, or -1 if not found.',
      },
    ],
    C: [
      {
        title: 'Linked List',
        desc: 'Implement a function that reverses a singly linked list and returns the new head pointer.',
      },
      {
        title: 'Memory Block',
        desc: 'Write a function that dynamically allocates an array of n integers, fills it with values 1 to n, and returns the pointer.',
      },
    ],
  };

  const hardQuestions: Record<string, { title: string; desc: string }[]> = {
    JavaScript: [
      {
        title: 'Neural Pathfinder',
        desc: "Write a function that finds the shortest path in a weighted graph using Dijkstra's algorithm. Input: adjacency list and start/end nodes. Return the path as an array.",
      },
    ],
    Python: [
      {
        title: 'Quantum Decoder',
        desc: 'Implement a function that solves the knapsack problem. Given items with weights and values, and a capacity limit, return the maximum value that can be carried.',
      },
    ],
    TypeScript: [
      {
        title: 'Cyber Compiler',
        desc: 'Write a recursive descent parser that evaluates simple math expressions with +, -, *, / and parentheses. Return the computed number.',
      },
    ],
    Java: [
      {
        title: 'Thread Weaver',
        desc: 'Implement a thread-safe bounded buffer (producer-consumer pattern) using synchronized methods. Support put() and take() operations.',
      },
    ],
    C: [
      {
        title: 'Memory Allocator',
        desc: 'Implement a simple memory allocator with my_malloc() and my_free() functions that manage a fixed-size memory pool.',
      },
    ],
  };

  const questionPool =
    difficulty === 'easy'
      ? easyQuestions
      : difficulty === 'medium'
        ? mediumQuestions
        : hardQuestions;

  const langQuestions = questionPool[language] ?? questionPool['JavaScript'];
  const q = langQuestions[Math.floor(Math.random() * langQuestions.length)];

  const xpBase = { easy: 100, medium: 350, hard: 750 };

  return {
    id: `gen-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    title: q.title,
    description: q.desc,
    difficulty,
    xp: xpBase[difficulty],
    language,
    status: 'new',
  };
}

export function MainPage({ username, onLogout }: MainPageProps) {
  const [activeView, setActiveView] = useState<DashboardView>('play');
  const [showIntro, setShowIntro] = useState(true);
  const [activeChallenge, setActiveChallenge] = useState<Challenge | null>(
    null,
  );
  const [activeQuests, setActiveQuests] = useState<ActiveQuest[]>([]);
  const [currentCode, setCurrentCode] = useState('');
  const [playerStats] = useState({ xp: 0, credits: 100, level: 1 });

  const handleViewChange = (view: DashboardView) => {
    // Save current code if leaving editor
    if (activeChallenge && currentCode) {
      setActiveQuests((prev) => {
        const existing = prev.find(
          (q) => q.challenge.id === activeChallenge.id,
        );
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
    }
    setActiveChallenge(null);
    setCurrentCode('');
    setActiveView(view);
  };

  const handleStartNewChallenge = useCallback(
    (language: ChallengeLanguage, difficulty: ChallengeDifficulty) => {
      const challenge = generateChallenge(language, difficulty);
      setActiveChallenge(challenge);
      setCurrentCode('');
    },
    [],
  );

  const handleResumeQuest = useCallback((quest: ActiveQuest) => {
    setActiveChallenge(quest.challenge);
    setCurrentCode(quest.code);
  }, []);

  const handleSkip = () => {
    // Remove from active quests if exists
    if (activeChallenge) {
      setActiveQuests((prev) =>
        prev.filter((q) => q.challenge.id !== activeChallenge.id),
      );
    }
    setActiveChallenge(null);
    setCurrentCode('');
  };

  const handleBackFromEditor = () => {
    // Save progress
    if (activeChallenge && currentCode) {
      setActiveQuests((prev) => {
        const existing = prev.find(
          (q) => q.challenge.id === activeChallenge.id,
        );
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
    }
    setActiveChallenge(null);
    setCurrentCode('');
  };

  const renderContent = () => {
    if (activeView === 'play') {
      if (activeChallenge) {
        return (
          <CodeEditorView
            challenge={activeChallenge}
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
