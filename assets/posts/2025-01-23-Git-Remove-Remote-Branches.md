---
layout: post
title: "Git: Remove Merged and Deleted Remote Branches"
date: 2025-01-23 09:30:00 -0400
tags: Git
summary: Clean up stale remote branch references from your repository
---

Over time, your Git repository accumulates references to remote branches that no longer exist. These "stale" branches clutter your workspace and can confuse team members. Let's clean them up.

## The Problem

After working with remote repositories for a while, you might notice:

```bash
git branch -r
# Output shows branches the remote no longer has:
# origin/feature-old-ui        (deleted from remote)
# origin/feature-auth          (deleted from remote)
# origin/feature-payment       (merged and deleted)
# origin/main                  (still exists)
# origin/develop               (still exists)
```

These stale references don't affect your actual work but create confusion.

## The Solution: Prune Remote Branches

### Method 1: Basic Pruning

```bash
git remote prune origin
```

This removes local references to branches that no longer exist on the remote. It's safe and doesn't delete anything from the remote.

### Method 2: Fetch with Prune (Recommended)

```bash
git fetch --prune
# or short form
git fetch -p
```

This fetches the latest from remote AND removes stale branch references in one command. This is my recommended approach.

### Method 3: Automatic Pruning on Every Fetch

Configure Git to automatically prune on all fetches:

```bash
git config --global fetch.prune true
```

Now every `git fetch` automatically cleans up stale branches:

```bash
git fetch
# Stale branches are automatically removed
```

To verify this setting:

```bash
git config --global fetch.prune
# Output: true
```

## Understanding What Gets Deleted

When you prune, only **local references** are deleted. The remote branches remain untouched:

```bash
# Before prune
git branch -r
# origin/feature-old-ui (local reference only)
# origin/develop (exists on remote)

# After: git fetch --prune
git branch -r
# origin/develop (exists on remote)
# ✓ feature-old-ui reference removed from your local copy
# ✗ Remote repository unchanged
```

## Complete Cleanup Workflow

Here's a comprehensive cleanup you can do periodically:

```bash
# Step 1: Fetch and prune
git fetch --prune

# Step 2: See what branches exist locally
git branch -vv
# Output shows tracking status:
# * main                    abc1234 [origin/main: ahead 2] Your local commits
#   feature/auth            def5678 [origin/feature/auth: gone] ← This one is gone!
#   feature/payment         ghi9012 [origin/feature/payment: gone]

# Step 3: Delete local branches that track deleted remotes
git branch -vv | grep gone | awk '{print $1}' | xargs git branch -d
# Deletes all branches with [gone] status
```

## Deleting Remote Branches Directly

Sometimes you need to delete a branch from the remote itself (requires push access):

```bash
# Delete a specific remote branch
git push origin --delete feature/old-ui
# or
git push origin :feature/old-ui  (older syntax)

# Delete multiple remote branches
git push origin --delete feature/old-ui feature/old-payment feature/experiment
```

## Safe Cleanup Script

Create a script to safely clean up:

```bash
#!/bin/bash
# cleanup.sh

echo "Fetching and pruning..."
git fetch --prune

echo "Local branches tracking deleted remotes:"
git branch -vv | grep gone

echo ""
read -p "Delete these branches? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    git branch -vv | grep gone | awk '{print $1}' | xargs git branch -d
    echo "Cleanup complete!"
else
    echo "Cleanup cancelled."
fi
```

Usage:

```bash
chmod +x cleanup.sh
./cleanup.sh
```

## Before and After Example

### Before Cleanup

```bash
git branch -a
# Output:
# * main
#   develop
#   feature/auth
#   feature/old-ui
#   feature/payment
#   remotes/origin/main
#   remotes/origin/develop
#   remotes/origin/project-alpha
#   remotes/origin/project-beta
```

### Run the Cleanup

```bash
git fetch --prune
git branch -vv | grep gone | awk '{print $1}' | xargs git branch -d
```

### After Cleanup

```bash
git branch -a
# Output:
# * main
#   develop
#   remotes/origin/main
#   remotes/origin/develop
```

Much cleaner!

## Team Workflow

When working with a team, regular pruning keeps everyone synchronized:

### For the whole team in `.gitconfig`:

```bash
git config --global fetch.prune true
git config --global fetch.pruneExpire now
```

### CI/CD Integration

```yaml
# GitHub Actions
- name: Clean up stale branches
  run: |
    git fetch --prune
    git branch -vv | grep gone | awk '{print $1}' | xargs git branch -d || true
```

## Advanced: Delete Old Remote Branches

Delete remote branches older than a certain date:

```bash
# Delete branches not updated in the last 30 days
git fetch --prune --prune-expire=30.days.ago
```

Or delete branches merged into main:

```bash
# Local branches merged into main (safe to delete)
git branch --merged main | grep -v "main" | xargs git branch -d

# Remote branches merged into origin/main
git branch -r --merged origin/main | grep -v "origin/main\|origin/develop" | xargs git branch -rD
```

## Common Mistakes

### Mistake 1: Force Deleting When You're Not Sure

```bash
# ❌ Dangerous if you delete something important
git branch -D feature/something

# ✓ Safer - only deletes if fully merged
git branch -d feature/something
```

### Mistake 2: Not Checking What You're Deleting

```bash
# ❌ Deles everything without review
git branch | xargs git branch -d

# ✓ Review first, then carefully delete
git branch -vv | grep gone
git branch -d <specific-branch>
```

### Mistake 3: Assuming Branches Are Gone

```bash
# ❌ Don't assume
git branch -d feature/something  # What if it's not merged?

# ✓ Check first
git log main..feature/something
# If empty, it's safe to delete
```

## Summary

- Use `git fetch --prune` to clean up stale remote branches
- Set `git config --global fetch.prune true` for automatic cleanup
- Prune removes **local references only**, not remote branches
- Use `git push origin --delete` to delete from remote
- Run cleanup periodically to keep your repository clean
- Safe to run multiple times - no harm if repeated
- Integrate into team workflows and CI/CD pipelines

Keeping your repository clean makes it easier for you and your team to understand what's actually being worked on. Make pruning part of your regular workflow, and you'll never be confused by stale branch references again.

Code on.

-Mike Merin
