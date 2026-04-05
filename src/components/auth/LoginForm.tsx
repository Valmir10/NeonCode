import { type FormEvent, useState } from 'react';
import styles from '../../pages/Registration/RegistrationPage.module.css';

interface LoginFormProps {
  onSwitchToSignUp: () => void;
  onLogin: (username?: string) => void;
}

export function LoginForm({ onSwitchToSignUp, onLogin }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('All fields are required, choom.');
      return;
    }

    onLogin();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className={styles.field}>
        <label htmlFor="login-email" className={styles.label}>
          Email
        </label>
        <input
          id="login-email"
          type="email"
          className={styles.input}
          placeholder="runner@nightcity.net"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="login-password" className={styles.label}>
          Password
        </label>
        <input
          id="login-password"
          type="password"
          className={styles.input}
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <button type="submit" className={styles.submitBtn}>
        Jack In
      </button>

      <div className={styles.divider}>
        <span className={styles.dividerLine} />
        <span className={styles.dividerText}>or</span>
        <span className={styles.dividerLine} />
      </div>

      <p className={styles.switchText}>
        New to the net?{' '}
        <button
          type="button"
          className={styles.switchLink}
          onClick={onSwitchToSignUp}
        >
          Create Account
        </button>
      </p>
    </form>
  );
}
