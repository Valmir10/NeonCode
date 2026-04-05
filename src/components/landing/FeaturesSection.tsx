import styles from './FeaturesSection.module.css';

const FEATURES = [
  {
    icon: '⚔️',
    title: 'Code Challenges',
    description:
      'Battle through hundreds of coding challenges across multiple difficulty levels. From Script Kiddie to Cyber Architect — prove your skills.',
    tag: 'Solo missions',
  },
  {
    icon: '🤖',
    title: 'AI-Powered Feedback',
    description:
      'Get real-time hints and feedback from our AI Fixer. It analyzes your code, judges your logic, and responds with attitude.',
    tag: 'Neural link',
  },
  {
    icon: '👥',
    title: 'Challenge Friends',
    description:
      'Go head-to-head with friends in real-time coding duels. Compete for XP, climb the leaderboard, and earn bragging rights.',
    tag: 'PvP mode',
  },
  {
    icon: '🌳',
    title: 'Skill Tree Progression',
    description:
      'Unlock new languages and harder challenges as you level up. Master HTML to unlock JavaScript, then Python, and beyond.',
    tag: 'RPG system',
  },
  {
    icon: '🏆',
    title: 'Achievements & Badges',
    description:
      'Earn unique badges and achievements for completing challenges, streaks, and special events. Show off your chrome.',
    tag: 'Collectibles',
  },
  {
    icon: '🛒',
    title: 'Black Market Store',
    description:
      'Spend earned credits on cosmetic upgrades — custom editor themes, profile badges, and exclusive neon color schemes.',
    tag: 'Customization',
  },
];

export function FeaturesSection() {
  return (
    <section className={styles.section}>
      <p className={styles.sectionLabel}>// What can you do</p>
      <h2 className={styles.sectionTitle}>
        More than code. It&apos;s a{' '}
        <span className={styles.highlight}>war</span>.
      </h2>
      <div className={styles.grid}>
        {FEATURES.map((feature) => (
          <div key={feature.title} className={styles.card}>
            <span className={styles.cardIcon}>{feature.icon}</span>
            <h3 className={styles.cardTitle}>{feature.title}</h3>
            <p className={styles.cardDescription}>{feature.description}</p>
            <span className={styles.cardTag}>{feature.tag}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
