---
layout: post
title: "A Quick Introduction to Generics"
date: 2021-10-10 13:10:34 -0400
tags: TypeScript
summary: What they look like and how to use them
---

[Official docs can be found here](https://www.typescriptlang.org/docs/handbook/2/generics.html)

## The Basics

Generics are similar to how a function's parameters behave, and they're just as handy as limiting repetitive code and keeping things nice and tidy. Here's a basic example:

```ts
type MakeArray<SubType> = SubType[];
```

This turns any type into an array. A function's equivalent would be:

```ts
const makeArray = (param) => [param];
```

Here's how we can utilize this:

```ts
type Name = string;
type Amount = number;

type NameArray = MakeArray<Name>; // aka string[]
type AmountArray = MakeArray<Amount>; // aka number[]

const name: Name = 'Mike';
const name2: Name = 'Lily';
const amount: Amount = 200;
const amount2: Amount = 400;

const names: NameArray = [name, name2];
const amounts: AmountArray = [amount, amount2];
```

Even though this is basic, you can see already how much this can save on repeating code. Here's one of my favorite things to do:

```ts
type ObjectType<T> = { [key: string]: T };

const toes: ObjectType<number> = {
  dogs: 4,
  humans: 5,
  tapirs: 3
};

const peopleDevSkills: ObjectType<string[]> = {
  Mike: ['TypeScript', 'React', 'Redux'],
  Trevor: ['Java', 'Kotlin']
};
```

Because codebases end up having a large amount of objects, this piece of code ends up being everywhere so generics save a great deal of time and energy having to type it out each time.

## Other Tricks

You can also nest generics, take in multiple generics with `<T1, T2, ...>` or iterate dynamically over an object.

#### Nesting

Just like with functions we can add some recursion easily. In addition to an example with turning the arrays above multidimensional, we can utilize ObjectType since they're almost always nested. 

```ts
type AmountMatrix = MakeArray<MakeArray<Number>>;
const amountMatrix: AmountMatrix = [[1, 2], [3, 4]];

type TeamPeopleInfo = ObjectType<ObjectType<Person>>;
const teamPeopleInfo: TeamPeopleInfo = {
  NewYork: {
    TeamA: {
      name: 'Mike',
      job: 'Developer',
    },
    TeamB: {
      name: 'Lily',
      job: 'Support'
    }
  },
  California: {},
};
```
#### Multiple Generics

Also just like with functions, you can have multiple generics at once:

```ts
type MultiType<T1, T2> = {
  output1: T1,
  output2: T2,
};

const multiType1: MultiType<string, number> = {
  output1: 'one',
  output2: 2,
};

const multiType2: MultiType<number[], ObjectType<string>> = {
  output1: [1, 2, 3],
  output2: { key: 'value' },
};
```

#### Iterating

Iteration is highly useful as well for typecasting things only once while transforming it in many ways. Here's a useful example that technically returns the same input, but highlights iterating over every type's keys and outputting their values:

```ts
type ObjectDestructured<TypeObject> = {
  [field in keyof TypeObject]: TypeObject[field];
};

// this equates to:

const objectDestructured = (obj) =>
  Object.entries(obj).reduce((acc, [key, value]) => ({
  ...acc,
  [key]: value,
}), {});
```

Again this is a 1:1 input to output, but now that we have this code we can modify it appropriately:

```ts
const toes: ObjectType<number> = {
  dogs: 4,
  humans: 5,
  tapirs: 3
};

const moreToes: MakeValuesArrays<ObjectType<number>> =
  Object.entries(toes).reduce((acc, [key, value]) => ({
  ...acc,
  [key]: [value, value],
}), {});

output = {
  dogs: [4, 4],
  humans: [5, 5],
  tapirs: [3, 3],
}
```

Try them all out and use them in your own code as needed!

Code on.

Mike Merin
