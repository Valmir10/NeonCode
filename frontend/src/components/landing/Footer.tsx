import styles from './Footer.module.css';

export function Footer() {
  return (
    <footer className={styles.footer}>
      &copy; {new Date().getFullYear()} NEONCODE — All systems operational
    </footer>
  );
}
