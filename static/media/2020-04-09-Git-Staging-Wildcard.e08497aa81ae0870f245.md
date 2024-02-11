---
layout: post
title: "Git Wildcard for Better File Control"
date: 2020-04-09 11:01:25 -0400
tags: Git
summary: Choose which specific files get used with Git commands
---
Usually when using Git commands you do the same thing over and over again:

```bash
git add .
git add -A
git commit -m "Commit Name"
git push
git reset --soft develop
```

However you can use \* wildcards to make sure only those matching the naming scheme work. For reference this format is the same as what you would use in your **.gitignore** file:

```bash
git add *.filename.* // stage files that match

```

git reset *.filename.* // same with unstaging
// example: app-container.tsx, app-container.spec. tsx, common.ts, dummy-component.tsx,
// stage only the non-spec .tsx files.
git add **/*.tsx
git reset *.spec.*


Code on.

-Mike Merin
