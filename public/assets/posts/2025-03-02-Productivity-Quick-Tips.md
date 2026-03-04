---
layout: post
title: "Quick Productive Hacks for Faster Development"
subtitle: "Collection of small tricks that save hours every year"
date: 2025-03-02 16:30:00 -0400
tags: Productivity, Workflow, Tips, Development
series: Quick Tips
summary: Small habits and shortcuts that add up to huge productivity gains over time
---

Small improvements that take only a few minutes to set up. Here are tricks I use daily that seem minor individually but save enormous amounts of time when combined.

# 1. Terminal Aliases for Access Speed

Stop typing out long commands. Create aliases for your most-used tools:

```bash
# Add to ~/.zshrc or ~/.bashrc
alias c='cd ~'
alias ll='ls -la'
alias gs='git status'
alias gp='git push'
alias gl='git pull'
alias gca='git commit -a'
alias ..='cd ..'
alias ...='cd ../..'
alias co='code .'
```
# 2. Clipboard Managers for Copy-Paste History

"Wait, I copied something 5 minutes ago... Let me find it again."

**Options:**
- macOS: Built-in but use [Paste](https://pasteapp.me/) or [Yippy](https://yippy.app/)
- Windows: [CopyQ](https://hluk.github.io/CopyQ/) or PowerToys Clipboard
- Cross-platform: [Ditto](https://ditto-cp.sourceforge.io/) (Windows), [clibboard](https://github.com/nachoparker/clipman) (Linux)

Access your last 20+ copied items instantly.

# 3. Efficient Git Workflows

Skip typing full commands:

```bash
# Instead of git status
gs  # assumes alias gs='git status'

# Instead of git commit -m "message"
git commit -a -m "message"  # -a to stage files automatically

# Use git worktrees for parallel work
git worktree add ../feature-x origin/feature-x
```

# 4. Code Snippets in Your IDE

Create quick expansions for boilerplate:

In Cursor/VS Code, create a `.vscode/snippets.code-snippets` file:

```json
{
  "React Functional Component": {
    "prefix": "rfc",
    "body": [
      "export function ${1:ComponentName}() {",
      "  return (",
      "    <div>",
      "      $2",
      "    </div>",
      "  );",
      "}"
    ]
  }
}
```

Type `rfc` and hit Tab to expand a full component.

# 5. Environment Variable Lookup

Stop hunting for env vars:

```bash
# Add to ~/.bashrc or ~/.zshrc
function getenv() {
  grep "^$1=" .env | cut -d '=' -f 2
}

# Usage
getenv DATABASE_URL
```

Or keep them in a pinned terminal tab.

Code on!

-Mike Merin
