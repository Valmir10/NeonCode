import { useState } from 'react';
import styles from './InteractiveDemo.module.css';

const FIXER_RESPONSES = [
  "Not bad, choom. But you're gonna need more than that to survive in Night City.",
  "Preem code, netrunner. Keep this up and you'll be jacking into Arasaka in no time.",
  "That's some delta-grade work right there. The streets could use someone like you.",
  'Flatline that bug and try again, choombatta. Even the best runners fail before they fly.',
  'Nova. You got the neural wiring for this gig. Welcome to the net.',
  'Your code compiles but your style needs chrome. Let me upgrade your interface.',
];

function getRandomResponse(): string {
  return FIXER_RESPONSES[Math.floor(Math.random() * FIXER_RESPONSES.length)];
}

function getLineCount(text: string): number {
  return Math.max(1, text.split('\n').length);
}

export function InteractiveDemo() {
  const [code, setCode] = useState('');
  const [response, setResponse] = useState<string | null>(null);

  const handleRun = () => {
    if (code.trim().length === 0) return;
    setResponse(getRandomResponse());
  };

  const lineCount = getLineCount(code);

  return (
    <section className={styles.demo}>
      <p className={styles.heading}>// Try it - write some code</p>

      <div className={styles.editor}>
        <div className={styles.editorHeader}>
          <span className={`${styles.dot} ${styles.dotRed}`} />
          <span className={`${styles.dot} ${styles.dotYellow}`} />
          <span className={`${styles.dot} ${styles.dotGreen}`} />
          <span className={styles.fileName}>hack.js</span>
        </div>

        <div className={styles.inputArea}>
          <div className={styles.lineNumbers}>
            {Array.from({ length: lineCount }, (_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>
          <textarea
            className={styles.textarea}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="console.log('Hello, Night City');"
            rows={4}
            spellCheck={false}
          />
        </div>

        <div className={styles.submitRow}>
          <button className={styles.runBtn} onClick={handleRun}>
            Execute
          </button>
        </div>
      </div>

      {response && (
        <div className={styles.response}>
          <div className={styles.responseLabel}>// AI Fixer</div>
          {response}
        </div>
      )}
    </section>
  );
}
