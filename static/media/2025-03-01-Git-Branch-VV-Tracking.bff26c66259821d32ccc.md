---
layout: post
title: "Visualizing Git Branch Tracking with git branch -vv"
subtitle: "Know which remote branches your local branches are tracking"
date: 2025-03-01 11:45:00 -0400
tags: Git, Command Line, Version Control, Workflow
summary: Use git branch -vv to see which remote branches your local branches follow and stay on top of tracking status
---

Ever pushed to the wrong remote branch? Or forgotten which upstream branch your feature branch tracks? The `git branch -vv` command solves this by showing your local branches alongside their remote tracking branches. It's simple but incredibly useful.

# Basic Usage

```bash
git branch -vv
```

This outputs something like:

```
  main       a1b2c3d [origin/main] your commits are up to date
  feature    d4e5f6g [origin/feature] your commits are ahead by 2
  develop    h7i8j9k [origin/main: behind 3] your commits are behind
- staging    k1l2m3n [staging: gone] tracking branch is gone
```

Let me break down what each column tells you:

| Column | Meaning |
|--------|---------|
| `*` or `-` | `*` = current branch, `-` = not current |
| Branch name | Your local branch name |
| Commit hash | Latest commit on this branch |
| `[tracking]` | Which remote branch it's tracking |
| Status | Ahead/behind/up to date with remote |

# Understanding the Tracking Info

## Up to Date

```
main       a1b2c3d [origin/main]
```

Your local branch is synced with the remote. No commits to push or pull.

## You're Ahead

```
feature    d4e5f6g [origin/feature] ahead 2
```

You have 2 unpushed commits on this branch. You should run `git push` to sync.

## You're Behind

```
develop    h7i8j9k [origin/main] behind 3
```

The remote has 3 commits you don't have locally. You should run `git pull` or `git fetch` + `git rebase`.

## Diverged

```
bugfix     k1l2m3n [origin/bugfix] ahead 2, behind 1
```

You have changes the remote doesn't, AND the remote has changes you don't. Requires resolving before pushing. Usually means:
- You made commits locally
- Someone else pushed different commits to the remote
- You need to rebase or merge

## Tracking Branch is Gone

```
old-feature    p5q6r7s [origin/old-feature: gone]
```

The remote branch was deleted, but your local branch still exists. Clean it up with:

```bash
git branch -d old-feature  # Or -D if it's not fully merged
```

# Setting Up Tracking

By default, when you clone a repo, only `main` is set to track `origin/main`. Feature branches don't have tracking set.

## When Creating a New Branch

```bash
# Create a local branch that tracks origin/my-feature
git checkout --track origin/my-feature

# Or shorthand (if no local branch with that name exists)
git checkout my-feature  # Git auto-assumes origin/my-feature
```

## After Pushing a New Branch

```bash
# Create local branch and push it
git push -u origin my-feature

# The -u flag sets it to track origin/my-feature automatically
```

## Set Tracking on Existing Branch

```bash
# Set existing branch to track a remote
git branch --set-upstream-to=origin/my-feature my-feature

# Or shorthand
git branch -u origin/my-feature my-feature
```

# Practical Workflows

## Seeing Your Pull Request Status

Before opening a PR or checking if your work is ready:

```bash
git branch -vv
```

Quickly shows if you have unpushed commits:

```
feature/auth    a1b2c3d [origin/feature/auth]
feature/api     d4e5f6g [origin/feature/api] ahead 5
feature/ui      h7i8j9k [origin/feature/ui] ahead 1, behind 2
```

You'd know immediately:
- `feature/auth` is synced and ready for review
- `feature/api` needs to be pushed
- `feature/ui` has conflicts to resolve

## Cleanup Script

Find branches that are gone and delete them:

```bash
# Show branches with gone remotes
git branch -vv | grep ': gone]'

# Delete them programmatically
git branch -vv | grep ': gone]' | awk '{print $1}' | xargs git branch -d
```

## Visual Overview with Colors

For an even better overview, add this to your `.gitconfig`:

```bash
git config --global color.branch.local "blue"
git config --global color.branch.remote "red"
git config --global color.branch.current "green bold"
```

Now `git branch -vv` will show current branch in green, local in blue, remote in red.

## Combine with git for-each-ref

For ultra-detailed tracking info:

```bash
git for-each-ref --format='%(refname:short): %(upstream:short) [%(upstream:track)]' refs/heads
```

Output:
```
main: origin/main [ahead 0, behind 0]
feature: origin/feature [ahead 3, behind 0]
develop: origin/develop [ahead 5, behind 2]
```

# Common Scenarios

## You Pushed to Wrong Remote

```bash
git branch -vv
# Shows: bugfix    a1b2c3d [origin/staging] ahead 2
# Oops! You wanted origin/main
```

Fix it:

```bash
git push origin bugfix:main  # Push to different remote branch
# Then reset tracking
git branch -u origin/main bugfix
```

## PR Hasn't Updated

```bash
git branch -vv
# Shows: feature    a1b2c3d [origin/feature]
# But your PR still shows old commits
```

You likely forgot `-u` when pushing:

```bash
git push -u origin feature
```

## Abandoned Branches Everywhere

```bash
git branch -vv | wc -l  # Count how many branches you have

# Delete all gone branches at once
git branch -vv | grep ': gone]' | awk '{print $1}' | xargs -p git branch -d
```

The `-p` flag prompts before deletion, which is safer.

# Integration with Git Aliases

Add these to `.gitconfig` for convenience:

```ini
[alias]
    bvv = branch -vv
    bnew = checkout --track
    bclean = !git branch -vv | grep ': gone]' | awk '{print $1}' | xargs -p git branch -d
```

Now you can use:
- `git bvv` - Show all branches with tracking info
- `git bnew origin/feature` - Checkout and track a remote branch
- `git bclean` - Delete all branches with gone remotes

# Beyond git branch -vv

For even more detailed information:

```bash
# See commits not in origin
git log origin/main..HEAD

# See commits from origin not in your branch
git log HEAD..origin/main

# Visual tree of branches and their relationships
git log --graph --oneline --all
```

`git branch -vv` is the quick glance tool. Use it before pushing, before opening a PR, or when debugging branch sync issues. It removes guesswork from remote tracking.

-Mike Merin
