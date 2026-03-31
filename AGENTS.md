# AGENTS.md - Tarsforge

## Project Overview
Tarsforge is a React 19 + Vite + Tailwind CSS v4 application for AI agent orchestration. Uses an atomic design architecture with Context API for state management.

## Commands

```bash
npm run dev       # Start dev server (localhost:5173)
npm run build     # Production build to dist/
npm run lint      # Run ESLint on all source files
npm run preview   # Preview production build locally
```

**Note:** No test framework is configured. The only test file is `tests/jsonParserTest.cjs` (run with `node tests/jsonParserTest.cjs`). To add tests, install Vitest (`npm i -D vitest`) and add `"test": "vitest"` to scripts.

## Architecture

```
src/
  atoms/        # Smallest UI primitives (Button, Badge, Spinner, etc.)
  molecules/    # Composed components (AgentCard, ApiKeyInput, etc.)
  organisms/    # Complex sections (AgentGraph, Navbar, CodeView, etc.)
  pages/        # Full page views (SetupPage, ConfigPage, RunPage, ComparePage)
  context/      # React Context + Provider (AppContext, AppProvider)
  hooks/        # Custom hooks (useGeminiAPI, useOrchestrator)
  constants/    # Static data and config
  api/          # API utility functions
  utils/        # Helper functions
  data/         # Static data files
```

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
- Persist API key to `localStorage`

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
