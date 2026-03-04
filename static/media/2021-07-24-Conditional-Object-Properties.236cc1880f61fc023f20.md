---
layout: post
title: "Conditional Object/Array Properties"
date: 2021-07-24 21:01:48 -0400
tags: TypeScript
summary: Stop undefined values at the source
---
If you want to omit an object's value rather than have it be `undefined`,\
use the spread operator trick of **`...(name && {name}}`** for objects, and ... for arrays

```ts
const first = 'Mike';
const last = 'Merin';
const job = 'Software Developer';
const title = undefined;

// normal
obj = {
    first,
    last,
    job,
    title
};
output = {
    first: 'Mike',
    last: 'Merin',
    job: 'Software Developer,
    title: undefined
};

// using the spread operator to omit job or title if it's undefined
obj = {
    first,
    last,
    ...(job && { job } ),
    ...(title && { title } ),
};
output = {
    first: 'Mike',
    last: 'Merin',
    job: 'Software Developer,
};
```

And for arrays:

```ts
arr = [first, last, job, title];
output = ['Mike', 'Merin', 'Software Developer', undefined];

arr = [
    first,
    last,
    ...job ? [job] : [],
    ...title ? [title] : []
];
output = ['Mike', 'Merin', 'Software Developer'];
```

You can also do **`output.filter(x => x)`** to remove falsy values,\
or more specifically **`output.filter(x => x !== undefined)`** the undefined values,\
but this tackles it at the source without having to iterate over the array again.

Finally since all of these are just tests, try using it for other conditions that make sense for your code!

Code on.

-Mike Merin
