import { useState } from 'react';
import { SignUpForm } from '../../components/auth/SignUpForm';
import { LoginForm } from '../../components/auth/LoginForm';
import styles from './RegistrationPage.module.css';

interface RegistrationPageProps {
  onBack: () => void;
  onLogin: (username?: string) => void;
}

export function RegistrationPage({ onBack, onLogin }: RegistrationPageProps) {
  const [activeTab, setActiveTab] = useState<'signup' | 'login'>('signup');

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <button className={styles.backLink} onClick={onBack}>
          &lt;-- Back to NeonCode
        </button>

        <div className={styles.card}>
          <h1 className={styles.logo}>NEONCODE</h1>
          <p className={styles.tagline}>// Enter the network</p>

          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${activeTab === 'signup' ? styles.tabActive : ''}`}
              onClick={() => setActiveTab('signup')}
            >
              Sign Up
            </button>
            <button
              className={`${styles.tab} ${activeTab === 'login' ? styles.tabActive : ''}`}
              onClick={() => setActiveTab('login')}
            >
              Login
            </button>
          </div>

          {activeTab === 'signup' ? (
            <SignUpForm
              onSwitchToLogin={() => setActiveTab('login')}
              onSignUp={onLogin}
            />
          ) : (
            <LoginForm
              onSwitchToSignUp={() => setActiveTab('signup')}
              onLogin={onLogin}
            />
          )}
        </div>
      </div>
    </div>
  );
}
