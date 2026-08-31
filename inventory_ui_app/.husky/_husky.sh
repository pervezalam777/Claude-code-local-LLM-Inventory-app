# husky hook
# Run pre-commit checks for inventory_ui_app
set -e

# Change to the project directory
cd "$(dirname "$0")/.." || exit 1

echo "Running pre-commit checks..."

# Run linting
echo "Checking linting..."
npm run lint || { echo "ESLint found issues. Please fix them before committing."; exit 1; }

# Run format check (not write - should fail if not formatted)
echo "Checking formatting..."
npm run format || { echo "Files are not properly formatted. Please run: npm run format:write"; exit 1; }

# Run tests
echo "Running tests..."
npm run test:run || { echo "Tests failed. Please fix failing tests before committing."; exit 1; }

echo "All checks passed!"
exit 0
