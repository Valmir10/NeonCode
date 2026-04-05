import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, '../../.env') });
import express from 'express';
import cors from 'cors';
import {
  generateChallenge,
  generateHint,
  evaluateCode,
  revealSolution,
  type Difficulty,
  type Language,
} from './ai.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'online', message: 'NeonCode API — System operational' });
});

// Generate a new challenge
app.post('/api/challenge/generate', async (req, res) => {
  try {
    const { language, difficulty } = req.body as {
      language: Language;
      difficulty: Difficulty;
    };

    if (!language || !difficulty) {
      res.status(400).json({ error: 'language and difficulty are required' });
      return;
    }

    const challenge = await generateChallenge(language, difficulty);
    res.json(challenge);
  } catch (error) {
    console.error('Generate error:', error instanceof Error ? error.message : error);
    res.status(500).json({ error: 'Failed to generate challenge', details: error instanceof Error ? error.message : 'Unknown error' });
  }
});

// Get a hint for current challenge
app.post('/api/challenge/hint', async (req, res) => {
  try {
    const { description, code, language } = req.body as {
      description: string;
      code: string;
      language: Language;
    };

    if (!description || !language) {
      res.status(400).json({ error: 'description and language are required' });
      return;
    }

    const hint = await generateHint(description, code || '', language);
    res.json({ hint });
  } catch (error) {
    console.error('Hint error:', error);
    res.status(500).json({ error: 'Failed to generate hint' });
  }
});

// Submit code for evaluation
app.post('/api/challenge/submit', async (req, res) => {
  try {
    const { description, expectedOutput, code, language } = req.body as {
      description: string;
      expectedOutput: string;
      code: string;
      language: Language;
    };

    if (!description || !code || !language) {
      res
        .status(400)
        .json({ error: 'description, code, and language are required' });
      return;
    }

    const result = await evaluateCode(
      description,
      expectedOutput || '',
      code,
      language,
    );
    res.json(result);
  } catch (error) {
    console.error('Submit error:', error);
    res.status(500).json({ error: 'Failed to evaluate code' });
  }
});

// Reveal the solution
app.post('/api/challenge/reveal', async (req, res) => {
  try {
    const { description, language } = req.body as {
      description: string;
      language: Language;
    };

    if (!description || !language) {
      res.status(400).json({ error: 'description and language are required' });
      return;
    }

    const solution = await revealSolution(description, language);
    res.json({ solution });
  } catch (error) {
    console.error('Reveal error:', error);
    res.status(500).json({ error: 'Failed to reveal solution' });
  }
});

app.listen(PORT, () => {
  console.log(`[NeonCode API] Running on port ${PORT}`);
  console.log(`[NeonCode API] Groq key: ${process.env.GROQ_API_KEY ? 'loaded' : 'MISSING'}`);
});
