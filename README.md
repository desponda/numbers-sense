# NumberSense - K-3 Math Education App

A playful, modern, clean, joyful math app that builds number sense (not memorization) for kindergarten through 3rd grade students.

## Core Values

- **Safe** - COPPA compliant, protecting children's privacy
- **Delightful** - Joyful learning experiences
- **Calm** - Non-overstimulating design
- **Educational** - Grounded in learning science

## Games

### Build the Number

Use virtual base-10 blocks to construct target numbers. Students develop place value understanding by physically building numbers with hundreds, tens, and ones.

### Sort the Numbers

Arrange numbers by magnitude, progressing from visual representations to numeric. Builds number comparison and ordering skills.

## Tech Stack

- **Frontend:** React 18 + TypeScript 5.6
- **Build:** Vite 5.x
- **Styling:** Tailwind CSS
- **State:** Zustand
- **DnD:** @dnd-kit
- **Testing:** Vitest + React Testing Library (149 tests)
- **Deploy:** Docker + Kubernetes/Helm

## Getting Started

```bash
cd src/frontend
npm install
npm run dev
```

Open http://localhost:5173 to view the app.

### Running Tests

```bash
npm run test        # Run all tests
npm run test:watch  # Watch mode
npm run test:ui     # Vitest UI
```

## Development

| Command                 | Description                |
| ----------------------- | -------------------------- |
| `npm run dev`           | Start dev server           |
| `npm run build`         | Production build           |
| `npm run lint`          | Run ESLint                 |
| `npm run typecheck`     | TypeScript check           |
| `npm run test`          | Run test suite (149 tests) |
| `npm run test:watch`    | Run tests in watch mode    |
| `npm run test:coverage` | Run tests with coverage    |

## Project Structure

```
/docs           # Documentation (research, architecture, specs)
/src
  /frontend     # React application
  /backend      # Backend services
  /shared       # Shared utilities
/tests          # Test files
/scripts        # Build and utility scripts
```

## Documentation

See the `/docs` folder for detailed documentation:

- `/docs/research` - Educational research and references
- `/docs/architecture` - Technical architecture decisions
- `/docs/specs` - Feature specifications

## License

TBD / Proprietary
