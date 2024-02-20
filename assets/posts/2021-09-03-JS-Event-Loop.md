---
layout: post
title: "Async Functions and JavaScript's Event Loop"
date: 2021-09-03 21:15:33 -0400
tags: JavaScript
summary: How JS handles normal vs. async
---

While normal events are called as JS's compiler goes line by line down your code, async events take a detour first before the event loop picks it up again. Try putting this in your code:

```ts
setTimeout(() => console.log('...hey'), 500);
console.log('hey');
```

As you'd expect, first the **'hey'** appears, then after 500ms the **'...hey'** does. However what happens when we tell it to not have any delay?

```ts
setTimeout(() => console.log('...hey'), 0);
console.log('hey');
```

Even though **'...hey'** has 0 delay and it's before **'hey'**, it still appears *after* it because it's an **async function**. Here's a helpful chart:

| type | Call Stack (1st round) | Web API | Queue | Event Loop | Call Stack (2nd round) |
| --- | --- | --- | --- | --- | --- |
| Async | setTimeout(() => console.log('...hey'), 0); | () => console.log('...hey'); **(keeps here for 0ms)** | () => console.log('...hey'); | places queue event in stack | () => console.log('...hey'); |
| Normal | console.log('hey'); | - | - | - | - |

\
Try it out yourself and make things more complex/nested to see what happens!

[Also here's a helpful visualization and animation of how it all works](https://dev.to/lydiahallie/javascript-visualized-event-loop-3dif)

Code on.

Mike Merin
