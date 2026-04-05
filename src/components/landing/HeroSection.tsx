import styles from './HeroSection.module.css';

export function HeroSection() {
  return (
    <section className={styles.hero}>
      <h1 className={styles.title}>NeonCode</h1>
      <p className={styles.subtitle}>
        Hack your way through a dystopian future
      </p>
      <p className={styles.arrows}>&gt;&gt;&gt;&gt;&gt;&gt;</p>
      <div className={styles.actions}>
        <button className={styles.btnPrimary}>Jack In</button>
        <button className={styles.btnSecondary}>Login</button>
      </div>
    </section>
  );
}
