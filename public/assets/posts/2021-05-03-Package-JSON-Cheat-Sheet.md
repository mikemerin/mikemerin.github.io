---
layout: post
title:  "Package.json Dependency Cheat Sheet"
subtitle: "find the version"
date: 2021-05-03 18:25:12 -0400
tags: NPM
series: Cheat Sheets
summary: Understand package.json's symbols and numbering system
---
The `package.json` file handles which Node packages you app will install. The convention is typically `Major.Minor.Patch` with an optional `symbol` in front (more on that below) and usually means the following:

| Location | Reason | Usually Used For |
|---|---|---|
| Major.#.# | No backwards compatibility | Big new features, reworks |
| #.Minor.# | Has backward compatibility | Smaller features or improvements, fixing impactful bugs |
| #.#.Patch | Small bug fixes | Typo/mistake/etc. fixing |

So the following dependency means we're looking for the exact version `10.4.2`.
```json
"dependencies": { "mike-merin-npm-package": "10.4.2" }
```

 As far as the other symbols that may be present, here's what they mean:

| Symbol | Reason | Example | Equivalent To |
|---|---|---|---|
| ^ | Works with the latest **minor** version | `^10.4.2` | `10.x.x` |
| ~ | Works with the latest **patch** version | `~10.4.2` | `10.4.x` |

The `x` are wildcards to find the latest version on the `npm` repository that matches. Both the `^`/`~` symbols or the `x` wildcards can be used in your `package.json` file. Here are a few others you may see that aren't typically used, but it's still good to know if you see them!

| Symbol | Reason | Example |
|---|---|---|
| = | **Equal** to the version (implied if absent) | `=10.4.2` |
| - | A **range** of acceptable versions | `10.2.1 - 10.4.6` |
| >= | **Greater than** or **equal** to the version | `>=10.2.1` |
| <= | **Less than** or **equal** to the version | `<=10.4.6` |
| \|\| | This **or** that version | `10.4.1` \|\| `10.4.2` |
| * | Matches **any** version | `*` |
| latest | Matches the **latest** version | `latest` |

You can also use URLs as dependencies, either local or git. I'll cover more about normal vs. dev vs. peer vs. optional dependencies in my next post.

Code on.

-Mike Merin
