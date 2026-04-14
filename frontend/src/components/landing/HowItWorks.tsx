import styles from './HowItWorks.module.css';

const STEPS = [
  {
    number: '01',
    title: 'Create Your Runner Profile',
    description:
      'Sign up and choose your alias. Every netrunner needs an identity in the system.',
  },
  {
    number: '02',
    title: 'Pick a Language Track',
    description:
      'Start with HTML, CSS, or jump straight into JavaScript. Your skill tree, your path.',
  },
  {
    number: '03',
    title: 'Solve Challenges & Earn XP',
    description:
      'Tackle coding challenges judged by our AI. Each solve earns XP, credits, and unlocks new missions.',
  },
  {
    number: '04',
    title: 'Level Up & Compete',
    description:
      'Climb from Script Kiddie to Cyber Architect. Challenge friends, top the leaderboard, earn rare badges.',
  },
];

export function HowItWorks() {
  return (
    <section className={styles.section}>
      <p className={styles.sectionLabel}>// How it works</p>
      <h2 className={styles.sectionTitle}>Your Path to the Top</h2>

      <div className={styles.timeline}>
        {STEPS.map((step) => (
          <div key={step.number} className={styles.step}>
            <div className={styles.stepNumber}>{step.number}</div>
            <div className={styles.stepContent}>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepDescription}>{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
