---
layout: post
title: "Using Hooks to Get Previous Values"
date: 2021-08-24 20:11:58 -0400
tags: React, Hooks
series: React Hooks
summary: Cleanup functions with useEffect are very powerful
---
With **useEffect** I previously covered how to call when **unmounting** occurs - this is generally called a **cleanup function**. But we can also utilize this when using useEffect with values and it will get called right before the effect resolves, meaning we'll have access to both the updated and previous values.

```ts
useEffect(() => {
  console.log(`new value: ${value}`);
  return () => {
    console.log(`old value: ${value}`);
  };;
}, [value]);
```

Code on.

Mike Merin
