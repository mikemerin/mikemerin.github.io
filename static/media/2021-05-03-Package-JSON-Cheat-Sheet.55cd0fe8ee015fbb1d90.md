---
layout: post
title: "Package.json Dependency Cheat Sheet"
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

\
So the following dependency means we're looking for the exact version `10.4.2`.
```json
"dependencies": { "mike-merin-npm-package": "10.4.2" }
```

 As far as the other major/minor symbols that may be present, here's what they mean:

| Symbol | Reason | Example | Equivalent To |
|---|---|---|---|
| ^ | Works with the latest **minor** version | `^10.4.2` | `10.x.x` |
| ~ | Works with the latest **patch** version | `~10.4.2` | `10.4.x` |

\
The **x**'s are wildcards to find the latest npmjs version that matches. You can use those **x**'s but it's generally more acceptable to use the **^** or **~** symbols. Here are a few others you may see that aren't typically used, but it's still good to know if you see them!

| Symbol | Reason | Example |
|---|---|---|
| = | **Equal** to the version (implied if absent) | `=10.4.2` |
| - | A **range** of acceptable versions | `10.2.1 - 10.4.6` |
| >= | **Greater than** or **equal** to the version | `>=10.2.1` |
| <= | **Less than** or **equal** to the version | `<=10.4.6` |
| \|\| | This **or** that version | `10.4.1` \|\| `10.4.2` |
| * | Matches **any** version | `*` |
| latest | Matches the **latest** version | `latest` |

\
Note (I will update with more info about these) you can also use URLs as dependencies (either local or git) as well as utilize normal, dev, peer, or optional dependencies.

Code on.

-Mike Merin
