---
layout: post
title: "Testing Equality of Arrays and Objects"
date: 2021-09-14 23:01:20 -0400
tags: TypeScript
summary: Object storage requires a bit more work to test out
---
Have you tried testing equality of two different arrays/objects? No matter what you do JS/TS will never call them equal. Try it out:

```ts
const arr1 = [1, 2, 3, 4, 5];
const arr2 = [1, 2, 3, 4, 5];
arr1 === arr2 // => false
arr1 == arr2 // => false

const obj1 = { first: 'Mike', job: 'Developer' };
const obj2 = { first: 'Mike', job: 'Developer' };
obj1 === obj2 // => false
obj1 == obj2 // => false
```

Why? Every object is stored with a unique id, not its contents, which is why if you change arr2/obj2 above, arr1/obj1 are unaffected.

```ts
arr2[0] = 0;
obj2.job = 'Dev';

console.log(arr1) // => [1, 2, 3, 4, 5];
console.log(arr2) // => [0, 2, 3, 4, 5];
console.log(obj1) // => { first: 'Mike', job: 'Developer' };
console.log(obj2) // => { first: 'Mike', job: 'Dev' };
```

Therefore the following is the only way to directly test against two "different" arrays or object and have them return true, which unfortunately doesn't help us much:

```ts
const arr3 = arr1;
const obj3 = obj1;

arr1 === arr3; // => true
obj1 === obj3; // => true

arr3[0] = 100;
obj3.job = 'Teacher';

console.log(arr1) // => [100, 2, 3, 4, 5];
console.log(arr2) // => [0, 2, 3, 4, 5];
console.log(arr3) // => [100, 2, 3, 4, 5];

console.log(obj1) // => { first: 'Mike', job: 'Teacher' };
console.log(obj2) // => { first: 'Mike', job: 'Dev' };
console.log(obj3) // => { first: 'Mike', job: 'Teacher' };
```

As you can see, arr1/obj1 and arr3/obj3 always change when the other does since they're actually the same object, but arr2/obj2 will remain different. That leaves us with testing the **contents** of each array/object, which you can do by iterating through each array's element or the object's key/value pars for equality, first checking that the same number of elements/keys exist:

```ts
const arr1 = [1, 2, 3, 4, 5];
const arr2 = [1, 2, 3, 4, 5];

const compareArrays = (a1, a2) =>
    a1.length === a2.length && a1.every((el, i) => el === a2[i]);


const obj1 = { first: 'Mike', job: 'Developer' };
const obj2 = { first: 'Mike', job: 'Developer' };

const compareObjects = (o1, o2) =>
    Object.keys(o1).length === Object.keys(o2).length &&
    Object.keys(o1).every(key => o1[key] === o2[key]);

compareArrays(arr1, arr2); // => true
compareObjects(obj1, obj2); // => true
```

If look at the compareObjects function and place `console.log`s in we can see how this is working:

```ts
const compareObjects = (o1, o2) => {
    console.log('Object.keys(o1).length', Object.keys(o1).length);
    console.log('Object.keys(o2).length', Object.keys(o2).length);

    return Object.keys(o1).length === Object.keys(o2).length &&
        Object.keys(o1).every(key => {
        console.log(key, 'o1[key]', o1[key]);
        console.log(key, 'o2[key]', o2[key]);
        return o1[key] === o2[key];
    });
};

compareObjects(obj1, obj2);

/* outputs
    Object.keys(o1).length 2
    Object.keys(o2).length 2
    first o1[key] Mike
    first o2[key] Mike
    job o1[key] Developer
    job o2[key] Developer
*/
```

Lastly, what if we tried with nested objects? It will fail because at the 'keys' step we're once again at the original issue of comparing objects. Given the following objects and using the same console.logging as above:

```ts
const nestedObj1 = { name: { first: 'Mike', last: 'Merin' }, job: 'Developer' };
const nestedObj2 = { name: { first: 'Mike', last: 'Merin' }, job: 'Developer' };

compareObjects(nestedObj1, nestedObj2); // => false

/* outputs
    Object.keys(o1).length 2
    Object.keys(o2).length 2
    name o1[key] {first: 'Mike', last: 'Merin'}
    name o2[key] {first: 'Mike', last: 'Merin'}
*/
```

To solve for this we'll check for the value's type and recursively call the function again if it's an object (this is one of the basic ways that Lodash's 'isEqual' works). Modifying our function from before (and leaving in the `console.log`s for clarity) we'll get:

```ts
const compareDeepObjects = (o1, o2) => {
    console.log('Object.keys(o1).length', Object.keys(o1).length);
    console.log('Object.keys(o2).length', Object.keys(o2).length);

    return Object.keys(o1).length === Object.keys(o2).length &&
        Object.keys(o1).every(key => {
        console.log(key, 'o1[key]', o1[key]);
        console.log(key, 'o2[key]', o2[key]);
        if (typeof o1[key] === 'object' && typeof o2[key] === 'object') {
            return compareDeepObjects(o1[key], o2[key]);
        }
        return o1[key] === o2[key];
    });
};

compareDeepObjects(nestedObj1, nestedObj2); // => true

/* outputs
    Object.keys(o1).length 2
    Object.keys(o1).length 2
    Object.keys(o2).length 2
    name o1[key] {first: 'Mike', last: 'Merin'}
    name o2[key] {first: 'Mike', last: 'Merin'}
    Object.keys(o1).length 2
    Object.keys(o2).length 2
    first o1[key] Mike
    first o2[key] Mike
    last o1[key] Merin
    last o2[key] Merin
    job o1[key] Developer
    job o2[key] Developer
*/
```

With this knowledge, see if you can write your own code to test out multidimensional arrays!

Code On.

-Mike Merin
