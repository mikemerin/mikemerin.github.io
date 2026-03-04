---
layout: post
title: "Git Log: Mastering Commit History Visualization"
date: 2025-01-25 16:00:00 -0400
tags: Git
summary: Use --oneline and other tricks to understand your project's history
---

`git log` shows your commit history, but without proper formatting, it becomes overwhelming. Let's master techniques to visualize and understand your project's history at a glance.

## The Problem: Reading Raw Git Log

By default, `git log` outputs verbose information:

```bash
git log
# Output:
# commit a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0
# Author: Mike Merin <mike@example.com>
# Date:   Wed Jan 25 16:00:00 2025 -0400
#
#     Implement feature/new-ui
#
#     - Added responsive design
#     - Updated button components
#     - Fixed styling issues
#
# commit b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1
# Author: Lily Anderson <lily@example.com>
# Date:   Wed Jan 25 15:30:00 2025 -0400
#
#     Fix authentication bug
#
# ... (very verbose)
```

This is useful for seeing details, but when you want a quick overview, it's too much.

## Solution: --oneline Flag

The `--oneline` flag shows one commit per line:

```bash
git log --oneline
# Output:
# a1b2c3d Implement feature/new-ui
# b2c3d4e Fix authentication bug
# c3d4e5f Add user profile page
# d4e5f6g Refactor styling system
# e5f6g7h Initial commit
```

This gives you a quick, scannable history. Much better!

## Limiting Output

See only the last N commits:

```bash
# Last 10 commits
git log --oneline -10

# Last 5 commits
git log --oneline -5

# Only the most recent
git log --oneline -1
```

Practical usage:

```bash
# What did I work on this session?
git log --oneline -5

# Quick look before pulling
git log --oneline origin/main -3
```

## Branch Visualization: --graph

Visualize your branch structure:

```bash
git log --oneline --graph
# Output:
# * a1b2c3d Merge pull request
# |\
# | * b2c3d4e feature/new-ui: final updates
# | * c3d4e5f feature/new-ui: implement design
# * d4e5f6g main: security patch
# |/
# * e5f6g7h Fix database connection
# * f6g7h8i Initial commit
```

The `*` and lines show how branches relate to each other - invaluable for understanding your workflow!

## Full Graph with All Branches

```bash
git log --oneline --graph --all
# Output:
# * a1b2c3d (HEAD -> main) Release v1.2.0
# * b2c3d4e Merge develop into main
# |\
# | * c3d4e5f (develop) New features
# | * d4e5f6g (feature/auth) Auth system
# | *   e5f6g7h Merge feature/database
# | |\
# | | * f6g7h8i (feature/database) Database schema
# | |/
# |/
# * g7h8i9j Main: stable version
```

This shows:
- Current branch (HEAD -> main)
- All branches
- Merge points and relationships
- What's merged and what's not

## Advanced Filtering

### Commits from Specific Author

```bash
git log --oneline --author="Mike"
# Shows only commits by Mike

git log --oneline --author="Mike\|Lily"
# Commits by Mike OR Lily
```

### Commits Within a Date Range

```bash
# Last week
git log --oneline --since="1 week ago"

# Specific date range
git log --oneline --since="2025-01-15" --until="2025-01-25"

# Last month
git log --oneline --since="1 month ago"
```

### Commits Touching Specific Files

```bash
# Changes to components
git log --oneline src/components/

# Changes to authentication
git log --oneline -- "*auth*"

# Recent changes to a specific file
git log --oneline -10 src/App.tsx
```

### Search by Message

```bash
# Commits with "fix" in the message
git log --oneline --grep="fix"

# Case insensitive
git log --oneline --grep="Fix" -i

# Find commits related to features
git log --oneline --grep="feature"
```

## Viewing Between Commits or Branches

```bash
# Commits on main but not on develop
git log --oneline main --not develop
# or
git log --oneline develop..main

# Commits on both branches (common ancestors)
git log --oneline main...develop
```

## My Favorite One-Liners

Save these as aliases in your `.gitconfig`:

```bash
# Add to your git config
git config --global alias.lg "log --graph --oneline --all"
git config --global alias.recent "log --oneline -10"
git config --global alias.today "log --oneline --since='1 day ago'"

# Now use them
git lg        # Full graph visualization
git recent    # Last 10 commits
git today     # Today's commits
```

## Real-World Usage Examples

### Before Starting Work

```bash
# What's on the main branch recently?
git log --oneline main -5

# What about develop?
git log --oneline develop -10

# Any new branches?
git log --graph --oneline --all -15
```

### During Code Review

```bash
# All changes in this branch
git log --oneline main..HEAD

# What did I modify in the last hour?
git log --oneline --since="1 hour ago"

# All my commits on this branch
git log --oneline --author="Mike" main..HEAD
```

### Debugging: When Did It Break?

```bash
# Find when a bug was introduced
git log --oneline -- src/components/Button.tsx

# See changes to a file
git log -p -- src/components/Button.tsx

# Find commits between versions
git log --oneline v1.0.0..v1.1.0
```

### Cleanup: What's Ready to Delete?

```bash
# What branches are old?
git log --oneline --since="6 months ago" -- .

# Find merged branches
git log --oneline --graph --all --simplify-by-decoration
```

## Combining Multiple Options

Create powerful queries:

```bash
# Recent changes by you in a specific directory
git log --oneline --author="Mike" --since="1 week ago" src/components/

# Graph view of feature branch since last tag
git log --graph --oneline v1.0.0..feature/new-ui

# All commits with "fix" in last month, excluding merges
git log --oneline --grep="fix" --since="1 month ago" --no-merges

# Commits that touch multiple files
git log --oneline --all -- src/redux/ src/components/ | head -20
```

## Practical Example: Release Notes

Generate release notes from commits:

```bash
# Commits between versions
git log --oneline v1.0.0..HEAD

# Format them nicely
git log --oneline v1.0.0..HEAD | sed 's/^[^ ]* /- /'
# Output:
# - Fix authentication bug
# - Add user dashboard
# - Improve performance

# Even better: filter by type
git log --oneline v1.0.0..HEAD --grep="^feat" --all
```

## Performance Tips

For large repositories with thousands of commits:

```bash
# Limit depth
git log -100 --oneline

# Use reflog for recent activity (faster)
git reflog

# Search specific locations
git log --oneline src/  # Only changes in src/

# Avoid global operations on huge repos
git log --oneline --author="you" --since="1 week ago"
```

## Summary

**Essential flags:**
- `--oneline` - One commit per line
- `--graph` - Branch visualization
- `--all` - All branches
- `-n` - Show last n commits
- `--author=` - Filter by author
- `--since=` - Commits since date
- `--until=` - Commits until date
- `--grep=` - Search commit messages

**Quick templates:**
- `git log --oneline -10` - Recent work
- `git log --graph --oneline --all` - Full history
- `git log --oneline --author="you"` - Your commits
- `git log --oneline main..HEAD` - Branch-specific commits
- `git log --oneline --since="1 week ago"` - This week's work

Understanding your project's history is crucial for debugging, code review, and team communication. Master `git log`, and you'll navigate your codebase's past with confidence. These commands become second nature quickly, and they'll save you countless hours when you need to understand how you got where you are.

Code on.

-Mike Merin
