import Groq from 'groq-sdk';

let client: Groq;

function getClient(): Groq {
  if (!client) {
    client = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
  return client;
}

const MODEL = 'llama-3.3-70b-versatile';

export type Difficulty = 'easy' | 'medium' | 'hard';
export type Language = 'JavaScript' | 'Python' | 'Java' | 'C' | 'TypeScript';

interface GeneratedChallenge {
  title: string;
  description: string;
  expectedOutput: string;
  sampleSolution: string;
}

async function chat(systemPrompt: string, userPrompt: string): Promise<string> {
  const response = await getClient().chat.completions.create({
    model: MODEL,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.7,
    max_tokens: 1024,
  });
  return response.choices[0]?.message?.content ?? '';
}

function getDifficultyGuidelines(difficulty: Difficulty): string {
  switch (difficulty) {
    case 'easy':
      return `The question should be about fundamentals: variables, loops, conditions, basic functions, string manipulation.
Keep it practical and real-world (e.g., "check if someone can vote", "calculate a tip", "count vowels in a string").
Keep it simple and educational.`;
    case 'medium':
      return `The question should be intermediate: arrays, objects/dicts, algorithms, data manipulation.
Use a creative scenario to frame the problem (e.g., "decode an intercepted message", "analyze sensor data"), but the core problem should be a real programming challenge.`;
    case 'hard':
      return `The question should be advanced: recursion, complex algorithms, optimization, design patterns.
Use an engaging scenario to frame the problem (e.g., "optimize a network routing algorithm", "implement a compression scheme").
The problem should genuinely challenge experienced programmers.`;
  }
}

export async function generateChallenge(
  language: Language,
  difficulty: Difficulty,
): Promise<GeneratedChallenge> {
  const system = `You are a coding challenge generator. Respond ONLY with valid JSON, no markdown, no code blocks, no extra text.`;

  const user = `Generate a ${difficulty} coding challenge in ${language}.

${getDifficultyGuidelines(difficulty)}

JSON format:
{"title": "Short title (2-4 words)", "description": "Clear description of what to code. Be specific about inputs, outputs. 2-4 sentences.", "expectedOutput": "Example of correct output. 1-2 test cases.", "sampleSolution": "Complete working solution in ${language}."}`;

  const text = await chat(system, user);
  const jsonStr = text.replace(/^```json?\n?/, '').replace(/\n?```$/, '').trim();
  return JSON.parse(jsonStr) as GeneratedChallenge;
}

export async function generateHint(
  challengeDescription: string,
  userCode: string,
  language: Language,
): Promise<string> {
  const system = `You are a helpful coding mentor. Give clear, specific hints. 1-3 sentences max. Never give the full solution. Be encouraging but concise.`;

  const user = `Challenge: "${challengeDescription}"
Language: ${language}
Student's code:
\`\`\`
${userCode || '(empty - they haven\'t started yet)'}
\`\`\`

Give a helpful hint. If they haven't started, suggest how to begin. If they have code, point out their specific issue.`;

  return await chat(system, user);
}

export async function evaluateCode(
  challengeDescription: string,
  expectedOutput: string,
  userCode: string,
  language: Language,
): Promise<{ pass: boolean; feedback: string; xpAwarded: boolean }> {
  const system = `You are an AI code evaluator. Respond ONLY with valid JSON, no markdown, no extra text. Be fair and constructive in your feedback.`;

  const user = `Challenge: "${challengeDescription}"
Expected: "${expectedOutput}"
Language: ${language}

Code:
\`\`\`
${userCode}
\`\`\`

Evaluate. JSON format:
{"pass": true/false, "feedback": "2-3 sentences. If pass: congratulate and mention what was done well. If fail: explain what's wrong and suggest a fix direction.", "xpAwarded": true/false}`;

  const text = await chat(system, user);
  const jsonStr = text.replace(/^```json?\n?/, '').replace(/\n?```$/, '').trim();
  return JSON.parse(jsonStr);
}

export async function revealSolution(
  challengeDescription: string,
  language: Language,
): Promise<string> {
  const system = `You are a coding tutor. Respond with ONLY code (with comments), no markdown code blocks, no extra text.`;
  const user = `Write a clean, well-commented solution in ${language} for: "${challengeDescription}"`;
  return await chat(system, user);
}
