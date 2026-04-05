import styles from './PlaceholderView.module.css';

interface PlaceholderViewProps {
  icon: string;
  title: string;
  subtitle: string;
}

export function PlaceholderView({
  icon,
  title,
  subtitle,
}: PlaceholderViewProps) {
  return (
    <div className={styles.container}>
      <span className={styles.icon}>{icon}</span>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.subtitle}>{subtitle}</p>
      <span className={styles.tag}>Coming Soon</span>
    </div>
  );
}
