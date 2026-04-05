import styles from './CallToAction.module.css';

export function CallToAction() {
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>
        Ready to <span className={styles.highlight}>jack in</span>?
      </h2>
      <p className={styles.subtitle}>
        The net is waiting. Create your runner profile, pick your first
        challenge, and start climbing the ranks. No credit chip required.
      </p>
      <button className={styles.btn}>Start Hacking</button>
      <p className={styles.note}>// Free access — no strings attached</p>
    </section>
  );
}
