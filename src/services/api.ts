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
  return post('/challenge/generate', { language, difficulty });
}

export async function getHint(
  description: string,
  code: string,
  language: string,
): Promise<string> {
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
  const data = await post<{ solution: string }>('/challenge/reveal', {
    description,
    language,
  });
  return data.solution;
}
