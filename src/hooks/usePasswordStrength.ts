import { useMemo } from 'react';

export type PasswordStrength = 'none' | 'weak' | 'medium' | 'strong';

export function usePasswordStrength(password: string): {
  strength: PasswordStrength;
  score: number;
} {
  return useMemo(() => {
    if (password.length === 0) return { strength: 'none', score: 0 };

    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 10) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 2) return { strength: 'weak', score };
    if (score <= 3) return { strength: 'medium', score };
    return { strength: 'strong', score };
  }, [password]);
}
