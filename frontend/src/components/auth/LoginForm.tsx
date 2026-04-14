import { type FormEvent, useState } from 'react';
import { login } from '../../services/auth';
import styles from '../../pages/Registration/RegistrationPage.module.css';

interface LoginFormProps {
  onSwitchToSignUp: () => void;
  onLogin: (username?: string) => void;
}

export function LoginForm({ onSwitchToSignUp, onLogin }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('All fields are required.');
      return;
    }

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (!result.success) {
      setError(result.error ?? 'Login failed.');
      return;
    }

    onLogin(result.username);
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
          placeholder="you@example.com"
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
          placeholder="Your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <button type="submit" className={styles.submitBtn} disabled={loading}>
        {loading ? 'Logging in...' : 'Log In'}
      </button>

      <div className={styles.divider}>
        <span className={styles.dividerLine} />
        <span className={styles.dividerText}>or</span>
        <span className={styles.dividerLine} />
      </div>

      <p className={styles.switchText}>
        Don&apos;t have an account?{' '}
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
