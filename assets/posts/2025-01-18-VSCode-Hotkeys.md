---
layout: post
title: "VS Code Hotkeys: Clearing Console and Cursor Control"
date: 2025-01-18 11:45:00 -0400
tags: VS Code
summary: Essential keyboard shortcuts to boost your development speed
---

Keyboard shortcuts are the difference between a good developer experience and a great one. Let me share some essential VS Code hotkeys that will dramatically improve your workflow, with both Windows/Linux and Mac versions.

## Clearing the Console

One of the most repetitive tasks in debugging is clearing the console output. There's no built-in VS Code shortcut for this (it's handled by your terminal), but here's the fastest way:

### Windows/Linux

```
Ctrl + L
```

This clears the terminal/console instantly. It's a bash/PowerShell standard that works everywhere.

### Mac

```
⌘ + K
```

Same effect as `Ctrl + L` on Windows.

### Alternative Method (All Platforms)

```bash
# If the keyboard shortcut doesn't work, use the command
clear
```

Or in PowerShell:

```powershell
cls
```

## Cursor Control Shortcuts

### Jump to Line

Navigate directly to any line number:

**Windows/Linux/Mac:**
```
Ctrl + G  (Windows/Linux)
⌘ + G    (Mac)
```

Perfect when debugging and you need to check a specific line:

```
Ctrl + G → 42 → Enter
# Takes you directly to line 42
```

### Move Line Up/Down

Quickly rearrange code without cut/paste:

**Windows/Linux:**
```
Alt + Up Arrow      (move line up)
Alt + Down Arrow    (move line down)
```

**Mac:**
```
⌥ + ↑     (move line up)
⌥ + ↓     (move line down)
```

### Delete Line

Remove a line instantly:

**Windows/Linux/Mac:**
```
Ctrl + Shift + K   (Windows/Linux)
⌘ + Shift + K      (Mac)
```

### Duplicate Line

Copy the entire line below the current position:

**Windows/Linux/Mac:**
```
Ctrl + Shift + D   (Windows/Linux)
⌘ + Shift + D      (Mac)
```

Great for quick copy-paste when you need similar code:

```typescript
// Cursor on this line
const apiUrl = process.env.API_URL;

// Press Ctrl + Shift + D
const apiUrl = process.env.API_URL;
const apiUrl = process.env.API_URL;  // Now modify the second one
```

## Selection Shortcuts

### Select to End/Start of Line

**Windows/Linux/Mac:**
```
Shift + End         (to end of line)
Shift + Home        (to start of line)
Shift + Ctrl + End  (to end of file)
Shift + Ctrl + Home (to start of file)
```

On Mac, use `⌘` instead of `Ctrl`.

### Select Word

**Windows/Linux/Mac:**
```
Ctrl + D           (select word)
Ctrl + D again     (select next occurrence)
```

Perfect for renaming or changing multiple instances:

```typescript
// Cursor on 'user'
const user = getUser();
console.log(user.name);  // Ctrl + D on 'user' selects it
// Ctrl + D again selects the next 'user'
```

## Cursor Movement

### Jump to Matching Bracket

Find the closing bracket instantly:

**Windows/Linux/Mac:**
```
Ctrl + Shift + \   (Windows/Linux)
⌘ + Shift + \      (Mac)
```

### Multiple Cursors

One of VS Code's most powerful features:

**Windows/Linux:**
```
Ctrl + Click        (add cursor at position)
Ctrl + Alt + Up/Down (add cursor above/below)
Ctrl + Shift + L    (select all occurrences)
```

**Mac:**
```
⌘ + Click
⌘ + ⌥ + ↑/↓
⌘ + Shift + L
```

Example usage:

```typescript
// With multiple cursors, edit all at once
const name = 'Mike';
const role = 'Developer';
const team = 'Platform';

// Position cursor before each variable name
// Ctrl + Alt + Down to add cursors
// Type 'const ' on all lines simultaneously
```

## Quick Navigation

### Go to File

**Windows/Linux/Mac:**
```
Ctrl + P           (Windows/Linux)
⌘ + P              (Mac)
```

Start typing the filename - it's faster than using the file tree!

### Search in Files

**Windows/Linux/Mac:**
```
Ctrl + Shift + F   (Windows/Linux)
⌘ + Shift + F      (Mac)
```

Find any text across your entire project instantly.

### Toggle Terminal

**Windows/Linux/Mac:**
```
Ctrl + `           (Windows/Linux)
⌘ + `              (Mac)
```

Quick access to your terminal without leaving the editor.

## Custom Hotkey Setup

If you prefer different shortcuts, customize them:

1. Open Command Palette: `Ctrl + Shift + P` (or `⌘ + Shift + P` on Mac)
2. Search "Keyboard Shortcuts"
3. Find the command you want to customize
4. Click the pencil icon and set your preferred key combination

### Edit `keybindings.json` Directly

Open Command Palette → "Preferences: Open Keyboard Shortcuts (JSON)":

```json
[
  {
    "key": "ctrl+shift+c",
    "command": "workbench.action.terminal.clear"
  },
  {
    "key": "cmd+shift+c",
    "command": "workbench.action.terminal.clear",
    "when": "isMac"
  }
]
```

## Perfect Workflow Example

Here's how these shortcuts work together:

```
Ctrl + P              // Open file
type: User.tsx        // Search and select
Ctrl + G              // Go to line 45
Ctrl + D              // Select 'userId'
Ctrl + D              // Select next 'userId'
Type: 'userId'        // Edit all at once
Alt + Down            // Move line down
Ctrl + Shift + /      // Comment out (alternative to above)
Ctrl + `              // Toggle to terminal
clear (or Ctrl + L)   // Clear console
Ctrl + `              // Back to editor
```

## Summary

**Essential Shortcuts:**
- **Clear Console:** `Ctrl + L` (Windows/Linux) or `⌘ + K` (Mac)
- **Move Lines:** `Alt + ↑/↓` (Windows/Linux) or `⌥ + ↑/↓` (Mac)
- **Duplicate Line:** `Ctrl + Shift + D` (Windows/Linux) or `⌘ + Shift + D` (Mac)
- **Go to Line:** `Ctrl + G` (Windows/Linux) or `⌘ + G` (Mac)
- **Multiple Cursors:** `Ctrl + Click` or `Ctrl + Alt + ↑/↓`
- **Quick Open:** `Ctrl + P` (Windows/Linux) or `⌘ + P` (Mac)

Learning these shortcuts might seem tedious, but the time savings compound quickly. After a week, these become muscle memory, and you'll wonder how you ever coded without them.

Code on.

-Mike Merin
