import {
  getOfflineChallenge,
  getOfflineHint,
  getOfflineEvaluation,
} from './offlineChallenges';

const API_BASE = 'http://localhost:3001/api';

export interface GeneratedChallenge {
  title: string;
  description: string;
  expectedOutput: string;
  sampleSolution: string;
}

export interface EvalResult {
  pass: boolean;
  feedback: string;
  xpAwarded: boolean;
}

async function post<T>(endpoint: string, body: object): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(
        err.details || err.error || `API error: ${response.status}`,
      );
    }

    return response.json();
  } catch (error) {
    clearTimeout(timeout);
    throw error;
  }
}

export async function generateChallenge(
  language: string,
  difficulty: string,
): Promise<GeneratedChallenge> {
  try {
    return await post('/challenge/generate', { language, difficulty });
  } catch {
    // Backend unavailable or errored - use offline challenges
    await new Promise((r) => setTimeout(r, 400));
    return getOfflineChallenge(language, difficulty);
  }
}

export async function getHint(
  description: string,
  code: string,
  language: string,
): Promise<string> {
  try {
    const data = await post<{ hint: string }>('/challenge/hint', {
      description,
      code,
      language,
    });
    return data.hint;
  } catch {
    return getOfflineHint(description, code);
  }
}

export async function submitCode(
  description: string,
  expectedOutput: string,
  code: string,
  language: string,
): Promise<EvalResult> {
  try {
    return await post('/challenge/submit', {
      description,
      expectedOutput,
      code,
      language,
    });
  } catch {
    return getOfflineEvaluation(code);
  }
}

export async function revealSolution(
  description: string,
  language: string,
): Promise<string> {
  try {
    const data = await post<{ solution: string }>('/challenge/reveal', {
      description,
      language,
    });
    return data.solution;
  } catch {
    const challenge = getOfflineChallenge(language, 'easy');
    return challenge.sampleSolution;
  }
}
