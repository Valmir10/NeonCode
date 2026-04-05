import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ChallengeSelect } from '../components/dashboard/views/ChallengeSelect';
import { CodeEditorView } from '../components/dashboard/views/CodeEditorView';
import { tokenize } from '../utils/syntaxHighlighter';

beforeEach(() => {
  vi.restoreAllMocks();
});

const mockChallenge = {
  id: 'test-1',
  title: 'Test Challenge',
  description: 'A test challenge description.',
  difficulty: 'easy' as const,
  xp: 100,
  language: 'JavaScript' as const,
  status: 'new' as const,
};

describe('ChallengeSelect', () => {
  it('renders language selection', () => {
    render(
      <ChallengeSelect
        activeQuests={[]}
        playerLevel={1}
        onStartNewChallenge={() => {}}
        onResumeQuest={() => {}}
      />,
    );
    expect(screen.getByText('// Choose Language')).toBeInTheDocument();
    const langButtons = screen.getAllByText('JavaScript');
    expect(langButtons.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Python')).toBeInTheDocument();
    expect(screen.getByText('Java')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
  });

  it('renders difficulty selection', () => {
    render(
      <ChallengeSelect
        activeQuests={[]}
        playerLevel={1}
        onStartNewChallenge={() => {}}
        onResumeQuest={() => {}}
      />,
    );
    expect(screen.getByText('Easy')).toBeInTheDocument();
    expect(screen.getByText('Medium')).toBeInTheDocument();
    expect(screen.getByText('Hard')).toBeInTheDocument();
  });

  it('renders new mission card with Engage button', () => {
    render(
      <ChallengeSelect
        activeQuests={[]}
        playerLevel={1}
        onStartNewChallenge={() => {}}
        onResumeQuest={() => {}}
      />,
    );
    expect(screen.getByText('Engage')).toBeInTheDocument();
    expect(screen.getByText('New Mission')).toBeInTheDocument();
  });

  it('shows active quests when present', () => {
    const quests = [{ challenge: mockChallenge, code: 'const x = 1;' }];
    render(
      <ChallengeSelect
        activeQuests={quests}
        playerLevel={1}
        onStartNewChallenge={() => {}}
        onResumeQuest={() => {}}
      />,
    );
    expect(screen.getByText('Test Challenge')).toBeInTheDocument();
    expect(screen.getByText('In Progress')).toBeInTheDocument();
    expect(screen.getByText('Resume →')).toBeInTheDocument();
  });

  it('calls onStartNewChallenge when Engage is clicked', () => {
    const mockStart = vi.fn();
    render(
      <ChallengeSelect
        activeQuests={[]}
        playerLevel={1}
        onStartNewChallenge={mockStart}
        onResumeQuest={() => {}}
      />,
    );
    fireEvent.click(screen.getByText('Engage'));
    expect(mockStart).toHaveBeenCalledWith('JavaScript', 'easy');
  });
});

describe('CodeEditorView', () => {
  it('renders challenge info bar with language tag', () => {
    render(
      <CodeEditorView
        challenge={mockChallenge}
        onBack={() => {}}
        onSkip={() => {}}
      />,
    );
    expect(screen.getByText('Test Challenge')).toBeInTheDocument();
    expect(screen.getByText('+100 XP')).toBeInTheDocument();
    const jsTexts = screen.getAllByText('JavaScript');
    expect(jsTexts.length).toBeGreaterThanOrEqual(1);
  });

  it('renders skip button', () => {
    render(
      <CodeEditorView
        challenge={mockChallenge}
        onBack={() => {}}
        onSkip={() => {}}
      />,
    );
    expect(screen.getByText('Skip')).toBeInTheDocument();
  });

  it('renders reveal answer button and calls API', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({ solution: 'function solve() { return 42; }' }),
    } as Response);

    render(
      <CodeEditorView
        challenge={mockChallenge}
        onBack={() => {}}
        onSkip={() => {}}
      />,
    );
    fireEvent.click(screen.getByText('🔓 Reveal Answer'));
    await waitFor(() => {
      expect(
        screen.getByText('// No XP awarded for revealed answers'),
      ).toBeInTheDocument();
    });
  });

  it('renders hint button and shows AI hint', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({ hint: 'Try using a loop, choom.' }),
    } as Response);

    render(
      <CodeEditorView
        challenge={mockChallenge}
        onBack={() => {}}
        onSkip={() => {}}
      />,
    );
    fireEvent.click(screen.getByText('💡 Request Hint'));
    await waitFor(() => {
      expect(screen.getByText('Try using a loop, choom.')).toBeInTheDocument();
    });
  });

  it('shows result on submit with code via API', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        pass: true,
        feedback: 'Preem work, netrunner!',
        xpAwarded: true,
      }),
    } as Response);

    render(
      <CodeEditorView
        challenge={mockChallenge}
        onBack={() => {}}
        onSkip={() => {}}
      />,
    );
    const textarea = document.querySelector('textarea')!;
    fireEvent.change(textarea, {
      target: { value: 'const x = 42;\nconsole.log(x);' },
    });
    fireEvent.click(screen.getByText('Submit'));
    await waitFor(() => {
      expect(screen.getByText('✓ MISSION COMPLETE')).toBeInTheDocument();
      expect(screen.getByText('Preem work, netrunner!')).toBeInTheDocument();
    });
  });

  it('calls onSkip when skip button is clicked', () => {
    const mockSkip = vi.fn();
    render(
      <CodeEditorView
        challenge={mockChallenge}
        onBack={() => {}}
        onSkip={mockSkip}
      />,
    );
    fireEvent.click(screen.getByText('Skip'));
    expect(mockSkip).toHaveBeenCalled();
  });

  it('calls onBack when back button is clicked', () => {
    const mockBack = vi.fn();
    render(
      <CodeEditorView
        challenge={mockChallenge}
        onBack={mockBack}
        onSkip={() => {}}
      />,
    );
    fireEvent.click(screen.getByText('<-- Missions'));
    expect(mockBack).toHaveBeenCalled();
  });
});

describe('Syntax Highlighter', () => {
  it('tokenizes JavaScript keywords', () => {
    const tokens = tokenize('const x = 1;', 'JavaScript');
    expect(tokens[0]).toEqual({ type: 'keyword', value: 'const' });
  });

  it('tokenizes strings', () => {
    const tokens = tokenize('"hello"', 'JavaScript');
    expect(tokens[0]).toEqual({ type: 'string', value: '"hello"' });
  });

  it('tokenizes comments', () => {
    const tokens = tokenize('// comment', 'JavaScript');
    expect(tokens[0]).toEqual({ type: 'comment', value: '// comment' });
  });

  it('tokenizes Python keywords', () => {
    const tokens = tokenize('def foo():', 'Python');
    expect(tokens[0]).toEqual({ type: 'keyword', value: 'def' });
  });

  it('tokenizes TypeScript interface', () => {
    const tokens = tokenize('interface Props', 'TypeScript');
    expect(tokens[0]).toEqual({ type: 'keyword', value: 'interface' });
    expect(tokens[2]).toEqual({ type: 'type', value: 'Props' });
  });

  it('tokenizes numbers', () => {
    const tokens = tokenize('42', 'JavaScript');
    expect(tokens[0]).toEqual({ type: 'number', value: '42' });
  });

  it('tokenizes function calls', () => {
    const tokens = tokenize('console.log()', 'JavaScript');
    const logToken = tokens.find((t) => t.value === 'log');
    expect(logToken?.type).toBe('function');
  });
});
