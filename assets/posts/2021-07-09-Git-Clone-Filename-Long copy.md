---
layout: post
title: "Git Clone "Filename Too Long" fix"
date: 2021-07-09 18:13:52 -0400
tags: Git
summary: A common error with an easy solution
---
When adding a new repo to your machine with **git clone**, if you get the message:

**error: unable to create file <filename>: Filename too long**

try changing your command to this:

```bash
git clone -c core.longpaths=true <repo-url>
```

Code on.

-Mike Merin
