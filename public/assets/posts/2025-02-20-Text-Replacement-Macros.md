---
layout: post
title: "Text Replacement Macros for AI Prompts"
subtitle: "Speed up your AI interactions with system-wide text expansion"
date: 2025-02-20 14:22:00 -0400
tags: Productivity, AI, Workflow, Shortcuts
summary: Use text replacement macros to quickly expand common AI prompts and boilerplate across macOS and Windows
---

When you're constantly prompting AI systems, typing the same instructions over and over gets tedious. System-wide text replacement can be a game-changer, letting you type short abbreviations that expand into full prompts or boilerplate code. Let's explore how to set this up on both Mac and Windows.

# macOS: Built-in Text Replacements

Setting up text shortcuts on macOS is straightforward through System Settings.

## How to Set It Up

1. Open **System Settings**
2. Navigate to **Keyboard** → **Text Replacement**
3. Click the **+** button to add a new replacement
4. Enter your abbreviation (what you'll type) in the left field
5. Enter your full replacement (what you want to expand to) in the right field
6. Click **Done**

## Example Macros for AI Prompts

Here are some useful ones I use daily:

```
Abbreviation: ;;analyze
Replacement: Analyze this code for potential bugs, performance issues, and security concerns. Suggest improvements and explain your reasoning.

Abbreviation: ;;refactor
Replacement: Refactor this code to be more readable, maintainable, and performant. Use modern best practices and include explanatory comments.

Abbreviation: ;;test
Replacement: Write comprehensive unit tests for this code covering happy paths, edge cases, and error scenarios.

Abbreviation: ;;explain
Replacement: Explain this code line-by-line in simple terms that a junior developer would understand. Include what each part does and why.
```

## Advanced Usage

You can create multi-line replacements by pasting formatted text:

```
Abbreviation: ;;ctx
Replacement: 
## Context
- Current goal: 
- What I've tried:
- Current output:
- Expected output:
```

This creates a quick template for providing context to Claude.

# Windows: Text Replacement Options

Windows doesn't have a built-in system-wide text replacement feature like macOS, but there are solid alternatives.

## Option 1: AutoHotkey (Recommended)

AutoHotkey is a free, open-source tool that's been around for years and is incredibly flexible.

### Installation

1. Download from [autohotkey.com](https://www.autohotkey.com)
2. Install the latest version (v2 or v1 both work)
3. Create a new text file and name it something like `ai-shortcuts.ahk`
4. Add your replacements following this format:

```autohotkey
::;;analyze::Analyze this code for potential bugs, performance issues, and security concerns. Suggest improvements and explain your reasoning.

::;;refactor::Refactor this code to be more readable, maintainable, and performant. Use modern best practices and include explanatory comments.

::;;test::Write comprehensive unit tests for this code covering happy paths, edge cases, and error scenarios.

::;;explain::Explain this code line-by-line in simple terms that a junior developer would understand.
```

For multi-line text, use parentheses:

```autohotkey
::;;ctx::
(
## Context
- Current goal: 
- What I've tried:
- Current output:
- Expected output:
)
```

### Making It Auto-Start

5. Copy your `.ahk` file to your Startup folder:
   - Press `Win + R`
   - Type `shell:startup`
   - Paste your `.ahk` file there
6. Restart your computer or double-click the `.ahk` file to activate

## Option 2: PowerToys Text Expander (Modern Alternative)

Microsoft's PowerToys includes a Text Expander feature (if you're on Windows 11).

### Installation

1. Download [PowerToys](https://github.com/microsoft/PowerToys) from GitHub or Microsoft Store
2. Install and open PowerToys
3. Enable the **Text Expander** module
4. Click **Open Advanced** to access settings
5. Add your expansions in JSON format

### PowerToys Format

```json
{
  "expansions": [
    {
      "abbreviation": ";;analyze",
      "expansion": "Analyze this code for potential bugs, performance issues, and security concerns..."
    },
    {
      "abbreviation": ";;refactor",
      "expansion": "Refactor this code to be more readable, maintainable, and performant..."
    }
  ]
}
```

## Option 3: Windows Clipboard Manager

Use a clipboard manager like **ClipboardMaster** or **Ditto**:

1. Copy your prompt to clipboard
2. Assign it a keyboard shortcut or searchable tag
3. Later, retrieve it quickly from your history

Less elegant than text replacement, but works anywhere.

# Tips and Tricks

## 1. Use Consistent Prefixes

I use `;;` (double semicolon) as my prefix since it rarely appears in normal typing. You could also use:
- `;:` (semicolon colon)
- `::` (double colon) 
- `;ai` (semicolon + initials)

## 2. Create Templates for Different Tasks

```
;;review - Code review request
;;bug - Debug and identify the issue
;;doc - Write documentation
;;learn - Explain a concept to me
;;qa - Generate QA test cases
;;security - Security audit request
```

## 3. Chain with Formatting

Instead of expanding to just text, expand to text with formatting that AI systems love (like markdown):

```
Abbreviation: ;;table
Replacement: 
Please create a comparison table with the following columns:
- [Column 1]
- [Column 2]
- [Column 3]
```

## 4. Different Macros per Tool

Create different abbreviations for different AI tools:

```
;;gpt-analyze - For ChatGPT (more conversational)
;;claude-analyze - For Claude (more detailed)
;;copilot-analyze - For GitHub Copilot (code-focused)
```

# Best Practices

1. **Keep abbreviations short** - The whole point is faster typing
2. **Make them memorable** - Use mnemonics you'll remember
3. **Don't overdo it** - Too many macros becomes harder to remember
4. **Backup your config** - Save your hotkey files or JSON to cloud storage
5. **Test thoroughly** - Make sure expansions work in your target applications (browser, IDE, etc.)

These text replacements have saved me hours of typing and made my workflow with AI systems significantly faster. Start with 5-10 common prompts and expand from there.

-Mike Merin
