---
layout: post
title: "Understanding keyof and typeof"
date: 2025-01-15 10:30:00 -0400
tags: TypeScript
series: Mastering Types
summary: Deep dive into two powerful TypeScript operators
---

After learning about [Generics](/blog?post=2021-10-10-TS-Generics) and exploring [complex type patterns](/blog?post=2021-10-10-TS-Generics), it's time to master `keyof` and `typeof`. These operators are fundamental to writing flexible, type-safe TypeScript code.

## The `typeof` Operator

`typeof` in TypeScript allows you to extract the type of a value. This is particularly useful when you want to reuse the shape of an existing variable or object as a type:

```ts
const divisionObject = {
  ENGINEERING: 'Engineering',
  GSAM: 'GSAM',
  MARQUEE: 'Marquee',
};

type DivisionsFromValue = typeof divisionObject; 
// type DivisionsFromValue = {
//   ENGINEERING: string;
//   GSAM: string;
//   MARQUEE: string;
// }
```

This is particularly powerful when combined with other type utilities. For example, extracting the type of specific values:

```ts
const apiResponse = {
  status: 200,
  data: { name: 'Mike', role: 'Developer' },
  timestamp: new Date(),
};

type ApiResponse = typeof apiResponse;
// Now ApiResponse has the exact shape of our response object
```

## The `keyof` Operator

`keyof` extracts all the keys of a type as a union type. This is your gateway to safer object access:

```ts
type DivisionsKeys = keyof typeof divisionObject; 
// type DivisionsKeys = "ENGINEERING" | "GSAM" | "MARQUEE"

const division: DivisionsKeys = 'ENGINEERING'; // ✓ Valid
const invalidDivision: DivisionsKeys = 'INVALID'; // ✗ TypeScript Error
```

## Combining `keyof` and `typeof`

The real power emerges when you combine these operators. Consider building a type-safe configuration system:

```ts
const serverConfig = {
  API_URL: 'https://api.example.com',
  TIMEOUT: 5000,
  RETRY_COUNT: 3,
  DEBUG_MODE: false,
};

type ConfigKey = keyof typeof serverConfig;
type ConfigValue = typeof serverConfig[ConfigKey];

const getValue = (key: ConfigKey) => serverConfig[key];

getValue('TIMEOUT'); // ✓ Valid
getValue('INVALID_KEY'); // ✗ TypeScript Error
```

## A Practical Example: Type-Safe Object Iteration

Let's build a function that safely iterates over an object's entries:

```ts
const tags = {
  REACT: 'typescript',
  VUE: 'javascript',
  ANGULAR: 'typescript',
};

type TagFramework = keyof typeof tags;

const getTagType = (framework: TagFramework): string => {
  return tags[framework];
};

// This works great with arrays too
const frameworks: TagFramework[] = ['REACT', 'ANGULAR'];

frameworks.forEach(fw => {
  console.log(`${fw} uses ${getTagType(fw)}`);
});
```

## Advanced: Generic Constraints with `keyof`

`keyof` becomes even more valuable when building generic functions:

```ts
// Function to safely get nested properties
function getValue<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = { name: 'Mike', age: 30, role: 'Developer' };

getValue(user, 'name'); // ✓ Valid, returns string
getValue(user, 'age'); // ✓ Valid, returns number
getValue(user, 'invalid'); // ✗ TypeScript Error
```

This pattern is invaluable for creating type-safe selectors, getters, and utilities. You can't pass the wrong key without TypeScript catching it immediately.

## The `readonly` Bonus

When working with `keyof`, you might encounter `readonly` properties. TypeScript handles this elegantly:

```ts
type ReadonlyConfig = {
  readonly API_URL: string;
  readonly VERSION: string;
};

type ConfigKeys = keyof ReadonlyConfig; 
// Still gives you "API_URL" | "VERSION"
// The readonly modifier doesn't affect the keys themselves
```

## Summary

- **`typeof`** extracts the type from a value
- **`keyof`** extracts all keys from a type as a union
- Together, they form the foundation of advanced TypeScript patterns
- Use them in generic constraints for maximum type safety
- This prevents runtime errors at compile time

These operators might seem like advanced features, but they're essential for writing maintainable, type-safe TypeScript. Start using them in your everyday code, and you'll write fewer bugs.

Code on.

-Mike Merin
