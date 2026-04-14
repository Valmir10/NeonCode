# NeonCode

AI-powered coding challenge platform with a cyberpunk-inspired design.

## Project Structure

```
NeonCode/
├── frontend/   # React + TypeScript (Vite)
├── backend/    # Express + Groq AI
└── .github/    # CI workflows
```

## Getting Started

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
npm install
npm run dev
```

The backend requires a `.env` file in the project root with your Groq API key:
```
GROQ_API_KEY=your_key_here
```

**Note:** The frontend works without the backend (offline mode with pre-built challenges). The backend enables AI-generated challenges, hints, and code evaluation.

## Scripts

### Frontend
| Command              | Description               |
| -------------------- | ------------------------- |
| `npm run dev`        | Start dev server          |
| `npm run build`      | Type-check and build      |
| `npm run lint`       | Run ESLint                |
| `npm test`           | Run tests                 |
| `npm run format`     | Format code with Prettier |

### Backend
| Command          | Description          |
| ---------------- | -------------------- |
| `npm run dev`    | Start dev server     |
| `npm run build`  | Compile TypeScript   |
| `npm start`      | Run compiled server  |
