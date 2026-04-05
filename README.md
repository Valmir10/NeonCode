# NeonCode - Cyberpunk AI Coding Platform

An AI-driven coding challenge platform with a Cyberpunk 2077 aesthetic and deep RPG elements.

## Tech Stack

- **Frontend:** React + TypeScript (Vite)
- **Testing:** Vitest + React Testing Library
- **CI/CD:** GitHub Actions (lint, test, build on every PR)

## Getting Started

```bash
npm install
npm run dev
```

## Scripts

| Command              | Description               |
| -------------------- | ------------------------- |
| `npm run dev`        | Start dev server          |
| `npm run build`      | Type-check and build      |
| `npm run lint`       | Run ESLint                |
| `npm test`           | Run tests                 |
| `npm run test:watch` | Run tests in watch mode   |
| `npm run format`     | Format code with Prettier |

## Branch Strategy

Each feature gets its own branch (`feat/landing-page`, `feat/code-editor`, etc.) and is merged to `main` via PR with CI checks passing.
