#!/bin/bash

# Local CI script - Run all checks locally before committing/pushing
# Usage: ./ci.sh [pre-commit|pre-push|lint|typecheck|test|build|all]

set -e

COMMAND=${1:-all}

cd src/frontend

case $COMMAND in
  pre-commit)
    echo "🔍 Running pre-commit checks..."
    npm run format:check
    npm run lint
    ;;
  pre-push)
    echo "🚀 Running full CI suite (pre-push)..."
    npm run format:check
    npm run lint
    npm run typecheck
    npm run test
    npm run test:e2e
    npm run build
    ;;
  lint)
    echo "🎨 Running ESLint..."
    npm run lint
    ;;
  lint:fix)
    echo "🎨 Running ESLint with fixes..."
    npm run lint:fix
    npm run format
    ;;
  typecheck)
    echo "🔷 Running TypeScript type checking..."
    npm run typecheck
    ;;
  test)
    echo "🧪 Running unit tests..."
    npm run test
    ;;
  test:watch)
    echo "🧪 Running tests in watch mode..."
    npm run test:watch
    ;;
  test:e2e)
    echo "🧪 Running E2E tests..."
    npm run test:e2e
    ;;
  build)
    echo "🏗️  Building for production..."
    npm run build
    ;;
  format)
    echo "📝 Formatting code..."
    npm run format
    ;;
  format:check)
    echo "📝 Checking code formatting..."
    npm run format:check
    ;;
  all)
    echo "✅ Running all CI checks..."
    npm run format:check
    npm run lint
    npm run typecheck
    npm run test
    npm run test:e2e
    npm run build
    echo ""
    echo "✅ All CI checks passed!"
    ;;
  *)
    echo "Usage: ./ci.sh [pre-commit|pre-push|lint|typecheck|test|build|all|lint:fix|test:watch|test:e2e|format|format:check]"
    echo ""
    echo "Commands:"
    echo "  pre-commit    - Run checks for pre-commit hook (format + lint)"
    echo "  pre-push      - Run full CI suite (format + lint + typecheck + test + e2e + build)"
    echo "  lint          - Run ESLint"
    echo "  lint:fix      - Run ESLint with auto-fixes"
    echo "  typecheck     - Run TypeScript type checking"
    echo "  test          - Run unit tests"
    echo "  test:watch    - Run unit tests in watch mode"
    echo "  test:e2e      - Run Playwright E2E tests"
    echo "  build         - Build for production"
    echo "  format        - Format code with Prettier"
    echo "  format:check  - Check formatting without modifying"
    echo "  all           - Run all checks (same as pre-push)"
    exit 1
    ;;
esac
