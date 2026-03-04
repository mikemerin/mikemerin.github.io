---
layout: post
title: "Control Your Dependencies: Installing Only What You Need"
date: 2025-01-20 10:00:00 -0400
tags: npm, Bash
summary: Master production vs development dependencies and keep your bundle lean
---

One of the most common mistakes in JavaScript projects is installing unnecessary dependencies or installing development dependencies in production. This guide shows you exactly how to control your dependencies and why it matters.

## The Problem

```bash
# Default: installs everything
npm install

# Problem: your production build includes:
# - Testing frameworks (Jest, Mocha)
# - Linters and formatters (ESLint, Prettier)
# - Build tools (Webpack, Rollup)
# - Development utilities
# All of this increases your production bundle size!
```

## Installation: Production vs Development

### Production Dependencies

These packages are needed when your application runs:

```bash
npm install react react-dom axios lodash
# or short form
npm i react react-dom axios lodash

# These go in "dependencies" in package.json
```

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "axios": "^1.6.0",
    "lodash": "^4.17.21"
  }
}
```

### Development Dependencies

These are only needed during development and testing:

```bash
npm install --save-dev jest eslint prettier typescript
# or short form
npm i -D jest eslint prettier typescript

# These go in "devDependencies"
```

```json
{
  "devDependencies": {
    "jest": "^29.5.0",
    "eslint": "^8.40.0",
    "prettier": "^3.0.0",
    "typescript": "^5.0.0"
  }
}
```

## Real-World Example Output

Here's what package.json looks like after proper organization:

```json
{
  "name": "my-blog",
  "version": "1.0.0",
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-markdown": "^9.0.1",
    "react-redux": "^9.1.0",
    "react-router-dom": "^6.21.3",
    "redux": "^5.0.1",
    "semantic-ui-react": "^2.1.5"
  },
  "devDependencies": {
    "@testing-library/react": "^14.1.2",
    "@types/react": "^18.2.48",
    "@typescript-eslint/eslint-plugin": "^6.19.1",
    "typescript": "^5.3.3",
    "react-scripts": "^5.0.1"
  }
}
```

## Installing Specific Dependency Types

### Install Only Production Dependencies

```bash
npm ci --production
# or
npm install --production

# Useful for: Docker containers, production servers
# This installs only what's in "dependencies"
```

### Install Only Development Dependencies

```bash
npm ci --only=dev
# or older syntax
npm install --only=dev

# Useful for: CI/CD pipelines that need to lint and test
```

### Install Everything (Default)

```bash
npm ci
# or
npm install

# Installs both dependencies and devDependencies
```

## Checking What's Installed

### See Your Dependency Tree

```bash
npm ls
# Output:
# my-blog@1.0.0
# ├── react@18.2.0
# ├── react-dom@18.2.0
# ├── react-markdown@9.0.1
# ├── react-redux@9.1.0
# ├── react-router-dom@6.21.3
# ├── redux@5.0.1
# └── semantic-ui-react@2.1.5

# See just production dependencies
npm ls --production

# See just development dependencies
npm ls --dev
```

### Find Unused or Outdated Dependencies

```bash
# Check for outdated packages
npm outdated
# Output:
# Package                Current  Wanted  Latest
# react                  18.2.0   18.2.0  18.3.1
# typescript             5.3.3    5.4.2   5.4.2

# Find unused dependencies (requires npm-check-updates)
npx npm-check-updates --doctor
```

## Moving Packages Between Dependency Types

### Already installed it in the wrong place?

```bash
# Remove it first
npm uninstall package-name

# Install in the correct location
npm install --save-dev package-name  # For dev dependencies
npm install --save package-name       # For production (--save is default)
```

## Real-World Workflow

### Setting Up a New Project

```bash
# 1. Initialize project
npm init -y

# 2. Install production dependencies
npm install react react-dom react-router-dom axios

# 3. Install development dependencies
npm install --save-dev typescript eslint prettier @types/react @types/node

# 4. Verify
npm ls
```

### For Docker/Production Deployment

```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./

# Install only production dependencies
RUN npm ci --production

COPY . .

CMD ["npm", "start"]
```

### For CI/CD Pipeline

```yaml
# GitHub Actions example
- name: Install dependencies
  run: npm ci

- name: Run linter
  run: npm run lint

- name: Run tests
  run: npm run test

- name: Build
  run: npm run build
```

## Bundle Size Impact

Here's a real example of why this matters:

```bash
# With dev dependencies included (WRONG)
npm install
npm run build
# Output: bundle.js = 2.5 MB

# With only production dependencies (CORRECT)
npm install --production
npm run build
# Output: bundle.js = 1.2 MB

# That's a 50% reduction!
```

## Common Mistakes

### Mistake 1: Installing Everything When You Only Need Production

```bash
# ❌ Don't do this in production
npm install

# ✓ Do this instead
npm ci --production
```

### Mistake 2: Putting Production Code in devDependencies

```bash
# ❌ Wrong
npm install --save-dev axios  # axios is needed! in production

# ✓ Correct
npm install axios
```

### Mistake 3: Not Using Lock Files

```bash
# ❌ This can cause version mismatches
npm install

# ✓ Always use npm ci in production/CI
npm ci
```

## Useful npm Commands Reference

```bash
# Install specific version
npm install react@18.2.0

# Install latest version
npm install react@latest

# Save as exact version (not ^)
npm install --save-exact react@18.2.0

# List outdated packages
npm outdated

# Clean up unused dependencies
npm prune

# Clean cache if things break
npm cache clean --force
```

## Summary

- **Production dependencies:** Code you run in production
- **Dev dependencies:** Code only needed for development/testing
- Use `npm install package-name` for production dependencies
- Use `npm install --save-dev package-name` for development dependencies
- Use `npm ci --production` in production to reduce bundle size
- Check your `package.json` to ensure packages are in the right section
- Smaller bundles = faster load times = better user experience

Properly managing your dependencies might seem like a small detail, but it compounds over time. A slightly lighter bundle today means significant performance improvements at scale. Start organizing your dependencies correctly now, and you'll reap the benefits forever.

Code on.

-Mike Merin
