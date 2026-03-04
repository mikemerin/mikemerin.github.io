---
layout: post
title: "Optional Chaining With Brackets & Functions"
date: 2024-02-08 14:31:44 -0400
tags: TypeScript
summary: Handling possible undefined in all situations
---
When it comes to objects that may be null/undefined/uncallable and preventing the error *"cannot call method ___ of undefined"*, TypeScript's "optional chaining" aka "**?.**" can greatly clean up your code:

```ts
const object = { a: {}, b: {} };

const before = object && object.a && object.a.output;
const after  = object?.method?.output;
```

It's also possible to chain right before calling brackets or calling functions:

```ts
const object = {
    fn: () => 'output',
    another: {}
};

object?.['fn']?.();
```

Code on.

-Mike Merin
