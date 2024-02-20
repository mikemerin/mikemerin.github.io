---
layout: post
title: "Git Branch Deletion"
subtitle: "a quick little prune"
date: 2021-03-24 08:43:29 -0400
tags: Git
summary: One line trick to quickly clean up your Git branches
---
Have too many local branches that need to be pruned? Don't want to `git branch -D` for **EVERY. SINGLE. ONE.** while making sure you have the branch name exactly right each time?

Type in the following and you'll be one and done, leaving just the `master` branch!

```bash
git branch | grep -v "master" | xargs git branch -D
```

It will take less time than it took to make this blog post.

Code on.

-Mike Merin
