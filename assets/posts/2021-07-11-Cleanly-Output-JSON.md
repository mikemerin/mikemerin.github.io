---
layout: post
title: "The Versatility of JSON.stringify's Replacers"
date: 2021-07-11 16:43:20 -0400
tags: TypeScript, JSON
summary: Cleanly Output, Control, and Replace JSON/Objects
---
Most people use **JSON.stringify()** one way: just add in an object and that's it. The main use case of this is displaying large objects or HTML that usually show as **[object Object]**, or working around having to click to expand each key/value in your console. JSON.stringify shows it all as a string:

```ts
const obj = { a: 'one', b: 'two', c: { c1: 'nested one', c2: 'nested two' }, d: [] };

console.log(obj);
// => |> {a: 'one', b: 'two', c: {…}, d: Array(0)}
JSON.stringify(obj);
// => '{"a":"one","b":"two","c":{"c1":"nested one","c2":"nested two"},"d":[]}'
```

This is fine, but the method has two more parameters you can use. Try doing this instead and see how it looks:

```ts
JSON.stringify(obj, null, 2);
```

The second argument is a "replacer" which you can think of as a recursive key/value map or filter, so since we have **null** here it basically ignores filtering and essentially means "show everything". We can include an array which will be treated as a filter to keep what keys match, or we can include a function to dynamically replace the values of keys. I've included examples of both below.

The third argument is the amount of "spaces" on each new line - think of it as **.join('\n' + this)**. In this case we tell it to do 2 spaces which makes it look clean. You can also do **'\t'** for tabs, or anything else.

Here are some examples with the same object, starting with the easier to conceptualize third param:

```ts
const obj = { a: 'one', b: 'two', c: { c1: 'nested one', c2: 'nested two' }, d: [] };

JSON.stringify(obj);
'{"a":"one","b":"two","c":{"c1":"nested one","c2":"nested two"},"d":[]}'

JSON.stringify(obj, null, 2);
{
  "a": "one",
  "b": "two",
  "c": {
    "c1": "nested one",
    "c2": "nested two"
  },
  "d": []
}

JSON.stringify(obj, 'one', '\t');
{
	"a": "one",
	"b": "two",
	"c": {
		"c1": "nested one",
		"c2": "nested two"
	},
	"d": []
}
```

And here are a few examples of how replacers work with arrays:

```ts
// filter only things with the keys 'a' and 'c'. The value 'two' does not work
JSON.stringify(obj, ['a', 'c', 'two'], 2);
{
  "a": "one",
  "c": {}
}

// if we try to filter c1 it doesn't work as it's nested
JSON.stringify(obj, ['a', 'c1'], 2)
{
  "a": "one"
}

// it does though if we get the parent 'c'
JSON.stringify(obj, ['a', 'c', 'c1'], 2)
{
  "a": "one",
  "c": {
    "c1": "nested one"
  }
}
```

Finally before covering using functions, let's first console log what happens to see how it works:

```ts
const replacer = (key, value) => {
    console.log('key', key, 'value', value);
    return value;
}

const obj = { a: 'one', b: 'two', c: { c1: 'nested one', c2: 'nested two' }, d: [] };

JSON.stringify(obj, replacer);

/* console.log's output:
key  value {a: 1, b: 2, c: {…}, d: 5}
key a value 1
key b value 2
key c value {c1: 3, c2: 4}
key c1 value 3
key c2 value 4
key d value 5
*/
```

As you can see, first we start with the object itself which technically has no key, then the value is the entire object. The function then nests into the value and then recursively does the same thing until the entire object is complete. When we include code in the replacer we need to make sure we tests against the keys and/or values. Here's a few examples:

```ts
// without any tests, the replacer simply replaces the entire object
const replacer = (key, value) => 'why we need tests';
JSON.stringify(objNum, replacer, 2)
"why we need tests"

// but also be careful with your tests - watch what happens with "c"
const replacer = (key, value) => key ? `${value} modified` : value;
JSON.stringify(objNum, replacer, 2)
{
  "a": "1 modified",
  "b": "2 modified",
  "c": "[object Object] modified",
  "d": "5 modified"
}

// so also test the type!
const replacer = (key, value) =>
    key && typeof value === 'string' ? `${value} modified` : value;
JSON.stringify(obj, replacer, 2)
{
  "a": "one modified",
  "b": "two modified",
  "c": {
    "c1": "nested one modified",
    "c2": "nested two modified"
  },
  "d": []
}

// using functions to filter out strings 
const replacer = (key, value) =>
    key && typeof value === 'string' ? undefined : value;
JSON.stringify(obj, replacer, 2)
{
  "c": {},
  "d": []
}

// finally using functions to square numbers
const objNum = { a: 1, b: 2, c: { c1: 3, c2: 4 }, d: 5 };
const replacer = (key, value) =>
    key && typeof value === 'number' ? value ** 2 : value;
JSON.stringify(objNum, replacer, 2)
{
  "a": 1,
  "b": 4,
  "c": {
    "c1": 9,
    "c2": 16
  },
  "d": 25
}
```

Code on.

-Mike Merin
