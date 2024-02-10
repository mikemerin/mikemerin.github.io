---
layout: post
title:  "Bash/CMD Mass Delete"
subtitle: "bye bye similar files"
date:   2021-04-28 15:04:01 -0400
tags: Bash
summary: One line trick to quickly remove nested directories
---
I copied a directory over but wanted to remove all of its `spec` test files. In the command prompt I navigated over to the copied directory and entered the following:

```bash
del /s *.spec.*
```

This (starting at the current directory) went through all folders/subfolders and deleted all specs in a few seconds! Note that if you just want to view all these files and not delete them, you can type in:

```bash
dir /s /b *.spec.*
```

Code on.

-Mike Merin
