---
layout: post
title: "Advanced Descructuring in JS/TS"
date: 2021-06-27 20:35:12 -0400
tags: JavaScript
summary: Extract from objects and optionally rename them
---
Given this object:

```ts
const obj = {
    name: 'Lily',
    info: {
        animal: 'Dog',
        color: 'Brindle'
    }
};
```

You can destructure it to individual variables with:

```ts
const { name, info: { animal, color } }) = obj;
// or spread out to see easier
const {
    name,
    info: {
        animal,
        color
    }
}) = obj;

console.log(name, animal, color);
```

And if there are multiple parts of your app that have the same name, you can assign a new name by doing:

```ts
const { name: animalName, info: { animal: animalType, color: animalColor } }) = obj;
// or spread out to see easier
const {
    name: animalName,
    info: {
        animal: animalType,
        color: animalColor
    }
}) = obj;

console.log(animalName, animalType, animalColor);
```

Code on.

-Mike Merin
