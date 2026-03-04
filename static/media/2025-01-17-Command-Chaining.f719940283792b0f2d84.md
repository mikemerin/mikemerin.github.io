---
layout: post
title: "Command Chaining: npm, bash, and Beyond"
date: 2025-01-17 09:15:00 -0400
tags: npm, Bash
summary: Master sequential and parallel command execution
---

Running multiple commands in sequence is a fundamental skill that can dramatically improve your workflow. Let's explore the different ways to chain commands in both npm and bash.

## Sequential Execution

The simplest approach is running commands one after another, waiting for each to complete:

### Using `&&` (AND operator)

```bash
# Commands only run if the previous one succeeds
npm run build && npm run test && npm run deploy

# Practical example: only push if build succeeds
npm run build && git add -A && git commit -m "Build updates" && git push

# Only run deployment if tests pass
npm run test && npm run build && npm run deploy
```

The `&&` operator **stops immediately if any command fails**, which is why it's safer:

```bash
npm run build && npm run test
# If npm run build fails, npm run test never runs
```

### Using `;` (Semicolon)

```bash
# Commands run regardless of success or failure
npm run lint ; npm run test ; npm run build

# All three commands will run, even if lint fails
# This is less safe but useful for cleanup operations
```

## Parallel Execution

Sometimes you want multiple commands running at the same time:

### Using `&` (Background)

```bash
# Start commands in the background
npm run dev & npm run server &

# The shell prompt returns immediately
# Commands run in the background

# Wait for all background jobs to complete
wait

# Kill all background jobs
killall node  # Or more specific: killall -g script.js
```

### In npm scripts

```json
{
  "scripts": {
    "start": "npm run server & npm run dev",
    "build": "npm run lint & npm run test & npm run bundle"
  }
}
```

## Practical npm Chaining Examples

### Build and Deploy Pipeline

```bash
# Install, build, test, then deploy all in sequence
npm ci && npm run lint && npm run build && npm run test && npm run deploy
```

If you want this in `package.json`:

```json
{
  "scripts": {
    "deploy": "npm run lint && npm run build && npm run test && npm run deploy:prod",
    "deploy:prod": "aws s3 sync dist/ s3://my-bucket"
  }
}
```

### Development Setup

```bash
# Clean, install, and start development server
npm run clean && npm ci && npm run dev
```

### Testing Suite

```bash
# Run different test types in sequence
npm run test:unit && npm run test:integration && npm run test:e2e
```

## Advanced Chaining

### Conditional Execution

```bash
# Only run deploy if both build and test succeed
npm run build && npm run test && npm run deploy || echo "Deployment failed"

# The || (OR) operator runs if the previous command fails
npm run test || npm run test:debug
```

### Combining Sequential and Parallel

```bash
# Run linting and formatting in parallel, then run tests
(npm run lint & npm run format) && npm run test

# Or in npm scripts by using concurrently
npm install --save-dev concurrently

# In package.json:
{
  "scripts": {
    "prepare": "concurrently \"npm run lint\" \"npm run format\" && npm run test"
  }
}
```

### Using Command Substitution

```bash
# Capture output and use it in another command
VERSION=$(npm run version --silent) && echo "Version: $VERSION"

# Real-world example: version-dependent deployment
VERSION=$(node -p "require('./package.json').version") && npm run deploy -- --version=$VERSION
```

## Time-Saving Examples

### Quick development setup

```bash
# One command to get everything running
npm ci && npm run build && npm run dev
```

### Pre-commit checks

```bash
npm run lint && npm run test && git add -A
```

### Release pipeline

```bash
npm run clean && npm run lint && npm run build && npm run test && npm version patch && npm publish
```

## When to Use What

| Operator | Use Case |
|----------|----------|
| `&&` | Commands depend on each other (build → test → deploy) |
| `;` | Independent commands, run everything regardless |
| `&` | Parallel execution, don't need to wait |
| ` \|\| ` | Fallback commands on failure |
| `()` | Grouping operations |

## Performance Considerations

```bash
# Slow: sequential
npm run lint && npm run type-check && npm run build && npm run test
# Total time: ~60 seconds (15+15+15+15)

# Faster: parallel first, then sequential
(npm run lint & npm run type-check & npm run build) && npm run test
# Total time: ~30 seconds (15 for 3 parallel, 15 for tests)
```

## Common Mistakes

```bash
# DON'T: Forgetting && causes all to run regardless of failure
npm run test ; npm run deploy
# If test fails, deploy still runs! ❌

# DO: Use && to ensure proper sequence
npm run test && npm run deploy
# Deploy only runs if test succeeds ✓

# DON'T: Using & when you need sequential
npm run build & npm run test
# Tests might run before build completes! ❌

# DO: Use && for dependencies
npm run build && npm run test
# Test always waits for build ✓
```

## Summary

- Use `&&` for sequential, dependent commands
- Use `;` for independent commands
- Use `&` for parallel execution
- Use `||` for fallback commands
- Combine operators for complex workflows
- Always test your chaining logic
- Save complex chains as npm scripts in `package.json`

Mastering command chaining will save you countless hours over your career. Start building these patterns into your workflow today.

Code on.

-Mike Merin
