---
layout: post
title: "TS Type Setting When Destructuring"
date: 2024-02-02 21:01:37 -0400
tags: TypeScript
summary: Resolve TS errors even when breaking down objects
---
Usually we have TypeScript types available in our code, but if we're manipulating data from outside sources (like fetched data or generating it) we can't always do that. Fortunately TS makes it easy to set types on the fly even when destructuring.

Arrays and objects can both do this, but they each require something slightly different. Let's try doing this using date and time.

### Arrays

Say we create a brand new date object and split it up into its parts.

```ts
const dateTime = (new Date()).toString().split(' ');
/*
  => ['Fri', 'Feb', '02', '2024', '21:01:37', 'GMT-0500',
  '(Eastern', 'Standard', 'Time)']
*/
const [dayOfWeek, month, day, year, hhmmss] = dateTime;
```

If we hover over dateTime we see that the type is **string[]**, so each of the variables we extracted will be **string**. However, what if the array we're extracting from has a mix of types? Even if we know each element is in a specific order, TypeScript will assume each element is "one or the other" type which makes it harder to use the data accurately. If we're given the following arrays that are always in this format:

```ts
const dateTime = ['Fri', 'Feb', 2, 2024];
const dateTime2 = ['Sat', 'Feb', 3, 2024];
const [dayOfWeek, month, day, year] = dateTime;
```

In this case, if we hover over dateType we see it as **(string | number)[]**, therefore each of those elements are **string | number**, however we know that the first two elements will always be strings with the remainder numbers. In order to ensure TypeScript also knows this, we can do this a few ways:

```ts
// ideal: set it at the start
const dateTime: [string, string, number, number] = ['Fri', 'Feb', 2, 2024];

// otherwise, if it's something we're fetching or retrieving we can simply set it
const dateTime = ['Fri', 'Feb', 2, 2024] as [string, string, number, number];

/*
    or the most likely scenario: if we don't have the luxury of
    setting it in the moment, we can do so when destructuring
*/
const dateTime = ['Fri', 'Feb', 2, 2024];
const [dayOfWeek, month, day, year] = dateTime as [string, string, number, number];
```

### Objects

Say we get a "time" object back with hours/minutes/seconds:

```ts
const dateTime = {
    hour: 21
    minute: 01,
    second: 37,
};
```

If we hover over dateTime we see that the type is **{ minute: number; second: number; hour: number; }**. Now unlike with arrays, objects usually are far stricter with their types as each key/value is more strongly controlled. But if we're retrieving that data, or if it's a mix of data, TypeScript won't always know the correct type you're looking for. In that case we can always directly set the type when destructuring, the same way we do with normal constants:

```ts
const dateTime = {
    minute: 60,
    second: 60,
    hour: 24
};

const { minute }: { minute: number } = dateTime;

// or if there's a common type, ideally either set it at the start

type HMS = {
  minute: number;
  second: number;
  hour: number;
}

const dateTime: HMS = {
    minute: 60,
    second: 60,
    hour: 24
};

const { minute } = dateTime;

/*
    or the most likely scenario: if we don't have the luxury of
    setting it in the moment, we can do so when destructuring
*/

const dateTime = {
    minute: 60,
    second: 60,
    hour: 24
};

const { minute }: HMS = dateTime;
```

Code on.

-Mike Merin
