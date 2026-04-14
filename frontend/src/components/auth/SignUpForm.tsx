import { type FormEvent, useState } from 'react';
import { register } from '../../services/auth';
import {
  usePasswordStrength,
  type PasswordStrength,
} from '../../hooks/usePasswordStrength';
import styles from '../../pages/Registration/RegistrationPage.module.css';

interface SignUpFormProps {
  onSwitchToLogin: () => void;
  onSignUp: (username?: string) => void;
}

const STRENGTH_SEGMENTS = 4;

function getSegmentClass(
  index: number,
  strength: PasswordStrength,
  score: number,
): string {
  const filled = index < score && strength !== 'none';
  if (!filled) return styles.strengthSegment;

  const map: Record<string, string> = {
    weak: styles.strengthWeak,
    medium: styles.strengthMedium,
    strong: styles.strengthStrong,
  };
  return `${styles.strengthSegment} ${map[strength] ?? ''}`;
}

function getStrengthLabel(strength: PasswordStrength): string {
  const labels: Record<string, string> = {
    weak: 'Weak',
    medium: 'Medium',
    strong: 'Strong',
  };
  return labels[strength] ?? '';
}

function getStrengthLabelClass(strength: PasswordStrength): string {
  const map: Record<string, string> = {
    weak: styles.strengthLabelWeak,
    medium: styles.strengthLabelMedium,
    strong: styles.strengthLabelStrong,
  };
  return `${styles.strengthLabel} ${map[strength] ?? ''}`;
}

export function SignUpForm({ onSwitchToLogin, onSignUp }: SignUpFormProps) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { strength, score } = usePasswordStrength(password);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !email.trim() || !password) {
      setError('All fields are required.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    const result = await register(username.trim(), email.trim(), password);
    setLoading(false);

    if (!result.success) {
      setError(result.error ?? 'Registration failed.');
      return;
    }

    onSignUp(username.trim());
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className={styles.field}>
        <label htmlFor="signup-username" className={styles.label}>
          Username
        </label>
        <input
          id="signup-username"
          type="text"
          className={styles.input}
          placeholder="Your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="signup-email" className={styles.label}>
          Email
        </label>
        <input
          id="signup-email"
          type="email"
          className={styles.input}
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="signup-password" className={styles.label}>
          Password
        </label>
        <input
          id="signup-password"
          type="password"
          className={styles.input}
          placeholder="At least 6 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
        />
        {password.length > 0 && (
          <>
            <div className={styles.strengthBar}>
              {Array.from({ length: STRENGTH_SEGMENTS }, (_, i) => (
                <div key={i} className={getSegmentClass(i, strength, score)} />
              ))}
            </div>
            <p className={getStrengthLabelClass(strength)}>
              {getStrengthLabel(strength)}
            </p>
          </>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="signup-confirm" className={styles.label}>
          Confirm Password
        </label>
        <input
          id="signup-confirm"
          type="password"
          className={styles.input}
          placeholder="Repeat your password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          autoComplete="new-password"
        />
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <button type="submit" className={styles.submitBtn} disabled={loading}>
        {loading ? 'Creating account...' : 'Create Account'}
      </button>

      <div className={styles.divider}>
        <span className={styles.dividerLine} />
        <span className={styles.dividerText}>or</span>
        <span className={styles.dividerLine} />
      </div>

      <p className={styles.switchText}>
        Already have an account?{' '}
        <button
          type="button"
          className={styles.switchLink}
          onClick={onSwitchToLogin}
        >
          Log In
        </button>
      </p>
    </form>
  );
}
