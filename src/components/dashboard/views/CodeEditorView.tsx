import { useState, useMemo, useRef, useEffect } from 'react';
import type { Challenge } from './ChallengeSelect';
import { tokenize, type TokenType } from '../../../utils/syntaxHighlighter';
import styles from './CodeEditorView.module.css';

const TOKEN_CLASS: Record<TokenType, string> = {
  keyword: styles.tokKeyword,
  string: styles.tokString,
  number: styles.tokNumber,
  comment: styles.tokComment,
  type: styles.tokType,
  function: styles.tokFunction,
  operator: styles.tokOperator,
  punctuation: styles.tokPunctuation,
  variable: styles.tokVariable,
  tag: styles.tokTag,
  attribute: styles.tokAttribute,
  property: styles.tokProperty,
  plain: styles.tokPlain,
};

const FILE_EXTENSIONS: Record<string, string> = {
  JavaScript: 'solution.js',
  TypeScript: 'solution.ts',
  Python: 'solution.py',
  Java: 'Solution.java',
  C: 'solution.c',
};

const HINTS: string[] = [
  "Think about what data type you need here, choom. The answer's staring you in the face.",
  "Break it down step by step. Even the best netrunners don't breach a wall in one move.",
  'Check your syntax — one wrong character and the whole thing flatlines.',
  'Try using a different approach. Sometimes the back door is easier than the front gate.',
  "Remember the basics. Variables, loops, conditions — that's your toolkit, runner.",
];

const FIXER_PASS = [
  'Preem work, netrunner! That code is delta-grade. The system accepts your solution.',
  "Clean execution. You're climbing the ranks fast, choom. Keep this up.",
  'ACCESS GRANTED. Your code breached the wall. XP incoming.',
];

const FIXER_FAIL = [
  "Not quite, choom. Your logic's got holes. The firewall held this time.",
  "Close but no cigar, runner. Re-check your approach — something's off.",
  'The system rejected your input. Debug your logic and try again.',
];

const EXAMPLE_SOLUTIONS: Record<string, string> = {
  JavaScript:
    '// Example solution\nfunction solve(input) {\n  // Your code here\n  return result;\n}',
  TypeScript:
    '// Example solution\nfunction solve(input: string): number {\n  // Your code here\n  return 0;\n}',
  Python:
    '# Example solution\ndef solve(input):\n    # Your code here\n    return result',
  Java: '// Example solution\npublic static int solve(String input) {\n    // Your code here\n    return 0;\n}',
  C: '// Example solution\nint solve(char* input) {\n    // Your code here\n    return 0;\n}',
};

interface CodeEditorViewProps {
  challenge: Challenge;
  initialCode?: string;
  onBack: () => void;
  onSkip: () => void;
  onCodeChange?: (code: string) => void;
}

export function CodeEditorView({
  challenge,
  initialCode,
  onBack,
  onSkip,
  onCodeChange,
}: CodeEditorViewProps) {
  const [code, setCode] = useState(initialCode ?? '');
  const [hint, setHint] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [result, setResult] = useState<{
    pass: boolean;
    message: string;
  } | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);

  const language = challenge.language;
  const lines = code.split('\n');
  const lineCount = Math.max(lines.length, 1);

  const tokens = useMemo(() => tokenize(code, language), [code, language]);

  const [activeLine, setActiveLine] = useState(1);

  const updateActiveLine = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const before = code.slice(0, textarea.selectionStart);
    setActiveLine(before.split('\n').length);
  };

  // Sync scroll between textarea and highlighted code
  useEffect(() => {
    const textarea = textareaRef.current;
    const highlight = highlightRef.current;
    if (!textarea || !highlight) return;

    const handleScroll = () => {
      highlight.scrollTop = textarea.scrollTop;
      highlight.scrollLeft = textarea.scrollLeft;
    };

    textarea.addEventListener('scroll', handleScroll);
    return () => textarea.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    onCodeChange?.(newCode);
  };

  const handleHint = () => {
    setHint(HINTS[Math.floor(Math.random() * HINTS.length)]);
  };

  const handleSubmit = () => {
    if (code.trim().length < 5) {
      setResult({
        pass: false,
        message:
          "You haven't written enough code yet, choom. Give it a real shot.",
      });
      return;
    }

    const pass = Math.random() > 0.4;
    const messages = pass ? FIXER_PASS : FIXER_FAIL;
    setResult({
      pass,
      message: messages[Math.floor(Math.random() * messages.length)],
    });
  };

  const handleRevealAnswer = () => {
    setShowAnswer(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (!textarea) return;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newCode = code.slice(0, start) + '  ' + code.slice(end);
      handleCodeChange(newCode);
      requestAnimationFrame(() => {
        textarea.selectionStart = start + 2;
        textarea.selectionEnd = start + 2;
      });
    }
  };

  return (
    <div className={styles.view}>
      {/* Challenge Info Bar */}
      <div className={styles.challengeBar}>
        <div className={styles.challengeInfo}>
          <button className={styles.backBtn} onClick={onBack}>
            &lt;-- Missions
          </button>
          <span className={styles.challengeTitle}>{challenge.title}</span>
          <div className={styles.challengeMeta}>
            <span className={`${styles.tag} ${styles.tagDifficulty}`}>
              {challenge.difficulty}
            </span>
            <span className={`${styles.tag} ${styles.tagXp}`}>
              +{challenge.xp} XP
            </span>
            <span className={`${styles.tag} ${styles.tagLang}`}>
              {challenge.language}
            </span>
          </div>
        </div>
        <div className={styles.challengeActions}>
          <button className={styles.skipBtn} onClick={onSkip}>
            Skip →
          </button>
        </div>
      </div>

      {/* Main editor area */}
      <div className={styles.editorArea}>
        {/* Left: Description Panel */}
        <div className={styles.descPanel}>
          <div>
            <p className={styles.descTitle}>// Mission Brief</p>
            <p className={styles.descText}>{challenge.description}</p>
          </div>

          <div>
            <button className={styles.hintBtn} onClick={handleHint}>
              💡 Request Hint
            </button>
            {hint && <p className={styles.hintText}>{hint}</p>}
          </div>

          <div>
            <button className={styles.revealBtn} onClick={handleRevealAnswer}>
              🔓 Reveal Answer
            </button>
            {showAnswer && (
              <div className={styles.answerBlock}>
                <p className={styles.answerWarning}>
                  // No XP awarded for revealed answers
                </p>
                <pre className={styles.descExample}>
                  {EXAMPLE_SOLUTIONS[language] ??
                    EXAMPLE_SOLUTIONS['JavaScript']}
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* Right: Code Editor */}
        <div className={styles.editorContainer}>
          {/* Tab bar */}
          <div className={styles.tabBar}>
            <div className={styles.fileTab}>
              <span className={styles.fileIcon}>📄</span>
              {FILE_EXTENSIONS[language] ?? 'solution.js'}
            </div>
          </div>

          {/* Code area with syntax highlighting */}
          <div className={styles.codeArea}>
            <div className={styles.lineNumbers}>
              {Array.from({ length: lineCount }, (_, i) => (
                <div
                  key={i}
                  className={i + 1 === activeLine ? styles.lineActive : ''}
                >
                  {i + 1}
                </div>
              ))}
            </div>

            <div className={styles.editorWrapper}>
              <div ref={highlightRef} className={styles.highlighted}>
                {tokens.map((token, i) => (
                  <span key={i} className={TOKEN_CLASS[token.type]}>
                    {token.value}
                  </span>
                ))}
              </div>
              <textarea
                ref={textareaRef}
                className={styles.textarea}
                value={code}
                onChange={(e) => handleCodeChange(e.target.value)}
                onKeyDown={handleKeyDown}
                onKeyUp={updateActiveLine}
                onClick={updateActiveLine}
                spellCheck={false}
                autoCapitalize="off"
                autoCorrect="off"
              />
            </div>
          </div>

          {/* Result overlay */}
          {result && (
            <div className={styles.resultOverlay}>
              <div className={styles.resultHeader}>
                <span
                  className={`${styles.resultTitle} ${result.pass ? styles.resultPass : styles.resultFail}`}
                >
                  {result.pass ? '✓ MISSION COMPLETE' : '✗ BREACH FAILED'}
                </span>
                <button
                  className={styles.resultClose}
                  onClick={() => setResult(null)}
                >
                  [close]
                </button>
              </div>
              <p className={styles.resultBody}>{result.message}</p>
              {result.pass && (
                <p className={styles.resultXp}>+{challenge.xp} XP earned</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bottom action bar */}
      <div className={styles.actionBar}>
        <div className={styles.statusInfo}>
          <span className={styles.statusItem}>
            Lines: <span className={styles.statusValue}>{lineCount}</span>
          </span>
          <span className={styles.statusItem}>
            Lang: <span className={styles.statusValue}>{language}</span>
          </span>
          <span className={styles.statusItem}>
            Chars: <span className={styles.statusValue}>{code.length}</span>
          </span>
        </div>
        <button className={styles.submitBtn} onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
}
