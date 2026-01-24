# Local CI Setup Guide

This project is configured to run all CI checks locally before committing and pushing code. This ensures high code quality and prevents broken code from being pushed to the repository.

## How It Works

### Git Hooks

Git hooks automatically run checks at different stages:

1. **Pre-commit Hook** (`git commit`)
   - Runs formatting check and linting on staged files
   - Uses `lint-staged` to check only modified files
   - If checks fail, the commit is blocked

2. **Pre-push Hook** (`git push`)
   - Runs the **full CI suite** before allowing push
   - Checks: formatting, linting, type checking, unit tests, E2E tests, and build
   - If any check fails, the push is blocked

### Configuration Files

- `.husky/pre-commit` - Pre-commit hook script
- `.husky/pre-push` - Pre-push hook script
- `src/frontend/package.json` - Contains `lint-staged` config and CI scripts
- `.gitignore` - Updated to exclude test artifacts

## Running CI Locally

### Option 1: Automatic (Via Git Hooks)

Just commit and push as normal:

```bash
git add .
git commit -m "your message"  # Runs pre-commit hook
git push                      # Runs pre-push hook
```

### Option 2: Manual (Using ci.sh Script)

Run checks manually at any time:

```bash
# Check formatting and linting (pre-commit checks)
./ci.sh pre-commit

# Run full CI suite (pre-push checks)
./ci.sh pre-push

# Or run all checks with shorthand
./ci.sh all
```

### Option 3: Individual Checks

Run specific checks:

```bash
# Code formatting
./ci.sh format              # Format with Prettier
./ci.sh format:check        # Check formatting without modifying

# Linting
./ci.sh lint                # Run ESLint
./ci.sh lint:fix            # Run ESLint and auto-fix

# Type checking
./ci.sh typecheck           # Run TypeScript compiler

# Testing
./ci.sh test                # Run unit tests
./ci.sh test:watch          # Run unit tests in watch mode
./ci.sh test:e2e            # Run Playwright E2E tests

# Build
./ci.sh build               # Production build
```

## CI Suite Details

### Pre-Commit Checks

Run on every `git commit`:

1. **Prettier** - Code formatting check
2. **ESLint** - Code quality and style

**Affected files:** Only staged/modified files (via `lint-staged`)

### Pre-Push Checks (Full CI Suite)

Run on every `git push`:

1. **Prettier** - Code formatting check (all files)
2. **ESLint** - Code quality and style (all files)
3. **TypeScript** - Type checking (no emit)
4. **Vitest** - Unit tests (149 tests)
5. **Playwright** - E2E tests (46 tests)
6. **Vite** - Production build

**Total time:** ~30-40 seconds

## Bypassing Hooks (Not Recommended)

If you absolutely must bypass git hooks for some reason:

```bash
# Bypass pre-commit hook
git commit --no-verify -m "your message"

# Bypass pre-push hook
git push --no-verify
```

⚠️ **Note:** This is not recommended as it defeats the purpose of the CI checks.

## Troubleshooting

### Hooks Not Running

Check that git is configured to use `.husky` hooks:

```bash
git config core.hooksPath
# Should output: .husky
```

If not configured, run:

```bash
git config core.hooksPath .husky
```

### Formatting Conflicts

If linting or formatting fails:

1. Run `./ci.sh lint:fix` to auto-fix issues
2. Review the changes
3. Stage and commit the fixes

### Test Failures

If tests fail before push:

1. Run `./ci.sh test` to debug
2. Fix the failing tests
3. Run `./ci.sh test:watch` for TDD workflow
4. Try pushing again

### Build Failures

If build fails:

1. Run `./ci.sh build` to see detailed error
2. Fix the issue (usually TypeScript or import errors)
3. Try pushing again

## CI Script Commands

```bash
./ci.sh                     # Show help
./ci.sh pre-commit          # Pre-commit checks
./ci.sh pre-push            # Full CI suite
./ci.sh lint                # Linting only
./ci.sh lint:fix            # Lint with auto-fix
./ci.sh typecheck           # Type checking only
./ci.sh test                # Unit tests only
./ci.sh test:watch          # Unit tests (watch mode)
./ci.sh test:e2e            # E2E tests only
./ci.sh build               # Build only
./ci.sh format              # Format code
./ci.sh format:check        # Check formatting
./ci.sh all                 # Same as pre-push
```

## NPM Scripts (Frontend)

Direct npm commands in `src/frontend/`:

```bash
npm run dev                 # Start dev server
npm run build               # Production build
npm run lint                # ESLint
npm run lint:fix            # ESLint + fix
npm run format              # Prettier format
npm run format:check        # Check formatting
npm run typecheck           # TypeScript check
npm run test                # Unit tests
npm run test:watch          # Unit tests (watch)
npm run test:e2e            # Playwright E2E tests
npm run ci                  # Full CI suite
```

## Best Practices

1. **Commit frequently** - Smaller commits are easier to review and debug
2. **Fix issues immediately** - Don't ignore pre-commit failures
3. **Use watch mode** - For TDD: `./ci.sh test:watch`
4. **Run pre-push locally** - Before pushing: `./ci.sh pre-push`
5. **Fix formatting early** - Run `./ci.sh lint:fix` before committing

## CI Pipeline

This local CI setup mirrors the GitHub Actions CI pipeline:

- **Pre-commit:** Basic checks (formatting + linting)
- **Pre-push:** Full suite (format + lint + typecheck + test + e2e + build)
- **GitHub Actions:** Same full suite on every PR

This ensures no broken code reaches GitHub.

---

**Setup Version:** 1.0
**Created:** January 24, 2026
**Last Updated:** January 24, 2026
