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

let _isOffline: boolean | null = null;

async function checkBackend(): Promise<boolean> {
  if (_isOffline !== null) return !_isOffline;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);
    const res = await fetch(`${API_BASE}/health`, {
      signal: controller.signal,
    });
    clearTimeout(timeout);
    _isOffline = !res.ok;
  } catch {
    _isOffline = true;
  }
  return !_isOffline;
}

// Reset check periodically so reconnection is detected
setInterval(() => {
  _isOffline = null;
}, 30000);

async function post<T>(endpoint: string, body: object): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(
      err.details || err.error || `API error: ${response.status}`,
    );
  }

  return response.json();
}

export async function generateChallenge(
  language: string,
  difficulty: string,
): Promise<GeneratedChallenge> {
  const online = await checkBackend();
  if (!online) {
    // Small delay to simulate generation feel
    await new Promise((r) => setTimeout(r, 500));
    return getOfflineChallenge(language, difficulty);
  }
  return post('/challenge/generate', { language, difficulty });
}

export async function getHint(
  description: string,
  code: string,
  language: string,
): Promise<string> {
  const online = await checkBackend();
  if (!online) {
    return getOfflineHint(description, code);
  }
  const data = await post<{ hint: string }>('/challenge/hint', {
    description,
    code,
    language,
  });
  return data.hint;
}

export async function submitCode(
  description: string,
  expectedOutput: string,
  code: string,
  language: string,
): Promise<EvalResult> {
  const online = await checkBackend();
  if (!online) {
    return getOfflineEvaluation(code);
  }
  return post('/challenge/submit', {
    description,
    expectedOutput,
    code,
    language,
  });
}

export async function revealSolution(
  description: string,
  language: string,
): Promise<string> {
  const online = await checkBackend();
  if (!online) {
    const challenge = getOfflineChallenge(language, 'easy');
    return challenge.sampleSolution;
  }
  const data = await post<{ solution: string }>('/challenge/reveal', {
    description,
    language,
  });
  return data.solution;
}

export function isOfflineMode(): boolean {
  return _isOffline === true;
}
