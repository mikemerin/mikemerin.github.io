---
layout: post
title: "Git Commits vs Stash: When to Use What"
date: 2025-01-16 14:20:00 -0400
tags: Git
summary: Why temporary commits beat stashing for work-in-progress code
---

One of the most common workflow questions I get is: "Should I stash or commit?" The answer might surprise you: **in most cases, you should commit**. Even temporary work deserves a commit over a stash.

## The Problem with Stash

While `git stash` seems convenient, it has several limitations:

```bash
# You've made changes you're not ready to commit
git stash

# Now your changes are in a mysterious, unnamed storage
# and later...
git stash pop # Did this stash contain my feature or my bug fix?
```

Stashes are anonymous by default, making them easy to lose:

```bash
# You have multiple stashes
git stash list
# stash@{0}: WIP on main: abc1234 Previous commit
# stash@{1}: WIP on main: abc1234 Previous commit
# stash@{2}: WIP on main: abc1234 Previous commit

# Which one had my important changes?
```

## Why Use a Temporary Commit Instead?

A commit tells a story. It's named, timestamped, and preserved in history:

```bash
# Instead of stashing, make a descriptive commit
git commit -m "temp: working on new feature implementation"

# Now it's in your history with context
git log --oneline
# abc5678 temp: working on new feature implementation
# abc1234 Previous commit
# abc0000 Before that
```

## The Workflow

Here's the recommended approach:

```bash
# You've made changes on your feature branch
git status
# Changes not staged for commit:
#   modified: src/components/Button.tsx
#   new file: src/hooks/useCustom.ts

# Instead of stashing, commit with "temp:" prefix
git add .
git commit -m "temp: implementing button state logic"

# Switch branches without losing work
git checkout main
git pull

# Come back to your work
git checkout feature/button
# Your changes are safe and visible in history

# Later, when you're ready to finalize
git rebase -i main  # Or merge
# You can see your temp commits and decide what to do
```

## Combining Commits Before Merge

When you're ready to merge, you can clean up those temporary commits:

```bash
# You have:
# - temp: button styling
# - temp: click handler
# - feature: complete button component

# Before merging to main, clean them up
git rebase -i main

# In the interactive rebase editor, squash or reorder:
# pick abc0001 temp: button styling
# squash abc0002 temp: click handler  
# pick abc0003 feature: complete button component

# OR just ammend your most recent commit
git commit --amend -m "feature: complete button component"
```

## When Stash IS Useful

There are rare cases where stash shines:

```bash
# Quick experimentation you might not want to keep
git stash

# Pulling urgent changes while on a dirty working directory
git pull  # Might fail with uncommitted changes
git stash  # Get them out of the way temporarily

# Actually... you can use --no-commit to rebase instead
git rebase --no-commit origin/main
```

## The Command Reference

```bash
# Traditional stash workflow (not recommended)
git stash
git stash pop

# Better process: use commits
git commit -m "temp: <description>"

git checkout <other-branch>
# ... do work ...
git checkout -  # Back to previous branch

# Cleanup when ready
git rebase -i <base-branch>
git commit --amend  # Fix up the temp commit
```

## Pro Tips

1. **Use descriptive prefixes** for temporary commits:
   - `temp:` for work in progress
   - `wip:` for experimental code
   - `debug:` for troubleshooting

2. **Your commits are your backup**:
   ```bash
   git reflog  # See all commits, even after resets
   ```

3. **Tag important temporary states**:
   ```bash
   git tag backup/feature-prototype
   git checkout -b experimental-fix
   ```

## Summary

- Use commits instead of stash for named, traceable work
- Temporary commits stay in history where you can reference them
- Clean them up with rebase or amend before merging
- Stash is best reserved for quick context switches, not primary workflow

Your future self will thank you for leaving a clear trail of what you were working on. Commits tell that story; stashes hide it.

Code on.

-Mike Merin
