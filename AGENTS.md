# AGENTS.md - Tarsforge

## Project Overview

Tarsforge is a React 19 + Vite + Tailwind CSS v4 application for AI agent orchestration. It generates landing pages by orchestrating multiple AI agents (via Ollama Cloud) that design, write, and build in real-time. Uses an atomic design architecture with Context API for state management.

## Deployment

**Live:** `https://tarsforge.sebastianmorales.sbs`

Deployed via Coolify from GitHub repo `https://github.com/SebastianMoralesDuque/Tarsforge`. Every push to `main` triggers an automatic rebuild.

**Contenedor:** `irc7frm8ahy75yh9wftn1hvd-XXXXXXXX` (imagen: `localhost:5000/tarsforge:COMMIT_HASH`)

## Commands

```bash
npm run dev       # Start dev server (localhost:5173)
npm run build     # Production build to dist/
npm run lint      # Run ESLint on all source files
npm run preview   # Preview production build locally
npm run server    # Start Express production server (port 3000)
node tests/jsonParserTest.cjs  # Run JSON parser tests
```

**Note:** No test framework configured. To add tests: `npm i -D vitest` and add `"test": "vitest"` to scripts.

## Ollama Cloud Model

**Single model:** `minimax-m2.7:cloud`

### Configuration

| File | Variable | Default |
|------|----------|---------|
| `.env` | `VITE_MODAL_MODEL` | `minimax-m2.7:cloud` |
| `docker-compose.yml` | `VITE_MODAL_MODEL` | `minimax-m2.7:cloud` |
| `server.ts` | fallback | `minimax-m2.7:cloud` |

**Required env vars:**
- `OLLAMA_API_KEY` — Ollama Cloud API key (from https://ollama.com/api)
- `VITE_MODAL_MODEL` — Model name (defaults to `minimax-m2.7:cloud`)

### How it works

1. Frontend calls `/api/ollama/chat/completions` (OpenAI-compatible endpoint)
2. Express `server.ts` proxies requests to `https://ollama.com/api/chat`
3. Ollama Cloud API key (`OLLAMA_API_KEY`) authenticates the request
4. Response is converted from Ollama format → OpenAI-compatible format

**Local dev proxy:** Vite proxies `/proxy-modal` → `http://localhost:11434` (for local Ollama).

## Architecture

```
src/
  atoms/        # Smallest UI primitives (Button, Badge, Spinner, etc.)
  molecules/    # Composed components (AgentCard, ApiKeyInput, etc.)
  organisms/    # Complex sections (AgentGraph, Navbar, CodeView, etc.)
  pages/        # Full page views (SetupPage, ConfigPage, RunPage, ComparePage)
  context/      # React Context + Provider (AppContext, AppProvider)
  hooks/        # Custom hooks (useGeminiAPI, useOrchestrator)
  constants/    # Static data and config (agents.js, skills.js)
  api/          # API utilities (openaiClient.js, geminiClient.js, apiHelpers.js)
  utils/        # Helpers (prompts, htmlExtractor, flowExecutor, etc.)
  data/         # Static data (skills-library.js)
```

**API flow:** `useGeminiAPI.js` → `openaiClient.js` (when `activeApi === 'modal'`) → Express proxy → Ollama Cloud

## Code Style

### Imports
- Use ES modules (`import`/`export`) — project is `"type": "module"`
- Group imports: React/external libs first, then local imports with relative paths
- Default exports for components; named exports for utilities, contexts, hooks

### Formatting
- **Indentation:** 4 spaces (JSX), 2 spaces (JS config files)
- **Quotes:** Single quotes for strings
- **Semicolons:** Required at statement ends
- **JSX:** Self-closing tags for elements without children (`<Component />`)
- **Trailing commas:** Not enforced but be consistent within a file

### Naming Conventions
- **Components:** PascalCase (`Button`, `AgentCard`, `SetupPage`)
- **Hooks:** camelCase with `use` prefix (`useApp`, `useOrchestrator`)
- **Context:** PascalCase with suffix (`AppContext`, `AppProvider`)
- **Constants:** UPPER_SNAKE_CASE (`INITIAL_STATE`, `VARIANTS`, `SKILLS`)
- **Variables/functions:** camelCase (`setPage`, `toggleSkill`, `runIndex`)
- **CSS classes:** kebab-case or Tailwind utilities; CSS custom properties use `--kebab-case`

### Components
- Use functional components with `export default function ComponentName() { ... }`
- Destructure props in the function signature with defaults: `function Button({ variant = 'primary', size = 'md', ... })`
- Use `useCallback` for stable function references passed to children or used in dependency arrays
- State updates via `setState` with functional updaters when depending on previous state

### State Management
- Global state lives in `AppProvider.jsx` using `useState` + `useCallback`
- Access via custom hook `useApp()` from `context/AppContext.js`
- State shape defined in `context/AppConstants.js`
- Persist API key to `localStorage` under `tarsforge_api_key`

### Styling
- **Tailwind CSS v4** via `@tailwindcss/vite` plugin
- Use CSS custom properties from `index.css` for theming (`var(--neon-green)`, `var(--bg-base)`, etc.)
- Prefer Tailwind utility classes; use `@apply` sparingly
- Arbitrary values with brackets: `bg-[var(--neon-green)]`
- Glass/neon utility classes defined in `index.css` (`.glass`, `.glass-strong`, `.glow-*`, etc.)

### Error Handling
- Context hooks throw if used outside provider: `if (!ctx) throw new Error('useApp must be used within AppProvider')`
- API errors should be caught and surfaced to UI state (not silently swallowed)
- Use loading/error states in components that fetch data

### Linting (ESLint)
- Config: `eslint.config.js` (flat config)
- Rules: `@eslint/js` recommended, `react-hooks` recommended, `react-refresh` for Vite
- Unused vars: vars starting with `[A-Z_]` are ignored (for destructured unused props)
- Run: `npm run lint`

## Key Conventions
- Dark theme only; all colors use CSS custom properties
- Atomic design hierarchy: atoms → molecules → organisms → pages
- No TypeScript; plain JavaScript with `.jsx` extension for React files
- Proxy configured in `vite.config.js` for `/proxy-modal` → `http://localhost:11434`
- API key stored in `localStorage` under `tarsforge_api_key`

## Key Files

| File | Purpose |
|------|---------|
| `server.ts` | Express proxy — converts Ollama Cloud → OpenAI-compatible API |
| `src/api/openaiClient.js` | OpenAI-compatible client (call + streaming) for Ollama |
| `src/hooks/useGeminiAPI.js` | Unified API hook — dispatches to openaiClient or geminiClient |
| `src/hooks/useOrchestrator.js` | Orchestration engine — runs agents, manages runs |
| `src/utils/prompts/` | Prompt templates for agents |
| `src/data/skills-library.js` | Skill definitions for agents |

## Dead Code (known)

- `src/api/geminiClient.js` — Gemini API client, never called (activeApi defaults to 'modal')
- `GEMINI_MODEL` constant in `src/constants/agents.js` — unused fallback
- `src/pages/ConfigPage.jsx` — references "Gemini" in UI text (cosmetic only)
