import { type ReactNode, useState } from 'react';
import styles from './LanguageShowcase.module.css';

interface Language {
  name: string;
  icon: string;
  level: string;
  styleClass: string;
  code: ReactNode;
}

const LANGUAGES: Language[] = [
  {
    name: 'HTML',
    icon: '🌐',
    level: 'Beginner',
    styleClass: styles.html,
    code: (
      <>
        <span className={styles.comment}>{'<!-- Build the web -->'}</span>
        {'\n'}
        <span className={styles.keyword}>{'<div'}</span>{' '}
        <span className={styles.variable}>class</span>=
        <span className={styles.string}>&quot;neon-grid&quot;</span>
        <span className={styles.keyword}>{'>'}</span>
        {'\n  '}
        <span className={styles.keyword}>{'<h1>'}</span>
        Hello, Night City
        <span className={styles.keyword}>{'</h1>'}</span>
        {'\n'}
        <span className={styles.keyword}>{'</div>'}</span>
      </>
    ),
  },
  {
    name: 'CSS',
    icon: '🎨',
    level: 'Beginner',
    styleClass: styles.css,
    code: (
      <>
        <span className={styles.comment}>{'/* Style the matrix */'}</span>
        {'\n'}
        <span className={styles.keyword}>.neon-grid</span> {'{'}
        {'\n  '}
        <span className={styles.variable}>background</span>:{' '}
        <span className={styles.string}>#0d0d0d</span>;{'\n  '}
        <span className={styles.variable}>color</span>:{' '}
        <span className={styles.function}>cyan</span>;{'\n  '}
        <span className={styles.variable}>box-shadow</span>:{' '}
        <span className={styles.string}>0 0 20px cyan</span>;{'\n'}
        {'}'}
      </>
    ),
  },
  {
    name: 'JavaScript',
    icon: '⚡',
    level: 'Intermediate',
    styleClass: styles.javascript,
    code: (
      <>
        <span className={styles.comment}>{'// Hack the system'}</span>
        {'\n'}
        <span className={styles.keyword}>const</span>{' '}
        <span className={styles.function}>breach</span> ={' '}
        <span className={styles.keyword}>async</span> (
        <span className={styles.variable}>target</span>) =&gt; {'{'}
        {'\n  '}
        <span className={styles.keyword}>const</span>{' '}
        <span className={styles.variable}>access</span> ={' '}
        <span className={styles.keyword}>await</span>{' '}
        <span className={styles.function}>decrypt</span>(
        <span className={styles.variable}>target</span>);{'\n  '}
        <span className={styles.keyword}>return</span>{' '}
        <span className={styles.variable}>access</span>.
        <span className={styles.function}>granted</span>;{'\n'}
        {'};'}
      </>
    ),
  },
  {
    name: 'TypeScript',
    icon: '🔷',
    level: 'Intermediate',
    styleClass: styles.typescript,
    code: (
      <>
        <span className={styles.comment}>{'// Type-safe netrunning'}</span>
        {'\n'}
        <span className={styles.keyword}>interface</span>{' '}
        <span className={styles.function}>Runner</span> {'{'}
        {'\n  '}
        <span className={styles.variable}>name</span>:{' '}
        <span className={styles.keyword}>string</span>;{'\n  '}
        <span className={styles.variable}>level</span>:{' '}
        <span className={styles.keyword}>number</span>;{'\n  '}
        <span className={styles.variable}>skills</span>:{' '}
        <span className={styles.keyword}>string</span>[];{'\n'}
        {'}'}
      </>
    ),
  },
  {
    name: 'Python',
    icon: '🐍',
    level: 'Advanced',
    styleClass: styles.python,
    code: (
      <>
        <span className={styles.comment}>{'# Neural network init'}</span>
        {'\n'}
        <span className={styles.keyword}>class</span>{' '}
        <span className={styles.function}>NetRunner</span>:{'\n  '}
        <span className={styles.keyword}>def</span>{' '}
        <span className={styles.function}>__init__</span>(
        <span className={styles.variable}>self</span>,{' '}
        <span className={styles.variable}>alias</span>):{'\n    '}
        <span className={styles.variable}>self</span>.alias ={' '}
        <span className={styles.variable}>alias</span>
        {'\n    '}
        <span className={styles.variable}>self</span>.xp ={' '}
        <span className={styles.string}>0</span>
      </>
    ),
  },
];

export function LanguageShowcase() {
  const [activeLang, setActiveLang] = useState(0);

  return (
    <section className={styles.section}>
      <p className={styles.sectionLabel}>// Choose your weapon</p>
      <h2 className={styles.sectionTitle}>Languages of the Net</h2>

      <div className={styles.languages}>
        {LANGUAGES.map((lang, i) => (
          <div
            key={lang.name}
            className={`${styles.langCard} ${lang.styleClass}`}
            onMouseEnter={() => setActiveLang(i)}
          >
            <span className={styles.langIcon}>{lang.icon}</span>
            <span className={styles.langName}>{lang.name}</span>
            <p className={styles.langLevel}>{lang.level}</p>
          </div>
        ))}
      </div>

      <div className={styles.codePreview}>
        <pre
          className={styles.codeBlock}
          data-lang={LANGUAGES[activeLang].name}
        >
          <code>{LANGUAGES[activeLang].code}</code>
        </pre>
      </div>
    </section>
  );
}
