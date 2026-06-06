#!/bin/bash

# setup.sh - Initial setup script for TeleHealings MVP Monorepo

set -e

echo "🚀 Setting up TeleHealings MVP Monorepo..."
echo ""

# Check Node.js version
NODE_VERSION=$(node -v | grep -oP '(?<=v)\d+' | head -1)
if [ "$NODE_VERSION" -lt 20 ]; then
  echo "⚠️  Warning: Node.js v20+ recommended (found v$NODE_VERSION)"
fi

# Check npm version
echo "📦 Node version: $(node -v)"
echo "📦 npm version: $(npm -v)"
echo ""

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install
echo "✅ Root dependencies installed"
echo ""

# Install workspace dependencies
echo "📦 Installing workspace dependencies (this may take a while)..."
npm install
echo "✅ All dependencies installed"
echo ""

# Show next steps
echo "✨ Setup complete!"
echo ""
echo "📝 Next steps:"
echo "  1. Copy .env.example to .env"
echo "  2. Set up Supabase account and database"
echo "  3. Run backend migrations: npm run migrate --workspace=packages/backend"
echo "  4. Start all services: npm run dev"
echo ""
echo "📚 For more info, see README.md or docs/"
