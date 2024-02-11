---
layout: post
title:  "Creating a New ECMAScript Function - Partition"
subtitle: "Works for Ruby? Works Here Too"
date:   2021-01-11 14:45:59 -0400
tags: JavaScript
summary: Implementing Ruby's Partition function in JS
---
Ruby has some fun functions that help out greatly with array manipulation. Why can't JS share in the fun?

Before I started programming in JavaScript my first language was Ruby, with some of my favorite parts bring its functions that allowed simple modification of arrays. Overall many of these exist in JavaScript, but the ones that are missing are:

* Partition - works like filter, but instead of returning one array of [true] values, returns two arrays of [[true], [false]]

    > ```ruby
    > example: [1,2,3].partition { |x| x % 2 === 0 } # [[2], [1, 3]]
    > ```

* Combination - given a number N, returns groups of N elements in an array in the order they appear

    > ```ruby
    > example: [1,2,3].combination(2).to_a # [[1, 2], [1, 3], [2, 3]]
    > ```

* Permutation - similar to combination, but groups in any order, backwards or forwards
    > ```ruby
    > example: [1,2,3].permutation(2).to_a # [[1, 2], [1, 3], [2, 1], [2, 3], [3, 1], [3, 2]]
    > ```

So I decided to try and add them to the language! After finding the [ecma262 github](https://github.com/tc39/ecma262/) to start contributing, I got to work.

<hr />

<details><summary>For my first draft I copied the existing "filter" code, which is as follows </summary>

```js
if (!Array.prototype.filter){
    Array.prototype.filter = function(func, thisArg) {
        'use strict';
        if ( ! ((typeof func === 'function') && this) )
            throw new TypeError();

        var len = this.length >>> 0,
            res = new Array(len), // preallocate array
            t = this, c = 0, i = -1;

        var kValue;
        if (thisArg === undefined){
        while (++i !== len){
            // checks to see if the key was set
            if (i in this){
            kValue = t[i]; // in case t is changed in callback
            if (func(t[i], i, t)){
                res[c++] = kValue;
            }
            }
        }
        }
        else{
        while (++i !== len){
            // checks to see if the key was set
            if (i in this){
            kValue = t[i];
            if (func.call(thisArg, t[i], i, t)){
                res[c++] = kValue;
            }
            }
        }
        }

        res.length = c; // shrink down array to proper size
        return res;
    };
}
```
</details>

<br/>

<details><summary>Now first off, the original code seemed like it could be cut down as it had some repeated code in it</summary>

```js
if (!Array.prototype.partition){
    Array.prototype.filters = function(func, thisArg) {
        'use strict';
        if ( ! ((typeof func === 'function') && this) )
            throw new TypeError();

        var len = this.length >>> 0,
            res = new Array(len), // preallocate array
            t = this, c = 0, i = -1;

        var kValue;
        while (++i !== len){
            // checks to see if the key was set
            if (i in this){
                kValue = t[i]; // in case t is changed in callback
                if (
                    (thisArg === undefined && func(t[i], i, t)) ||
                    func.call(thisArg, t[i], i, t)
                ) {
                    res[c++] = kValue;
                }
            }
        }

        res.length = c; // shrink down array to proper size
        return res;
    };
}
```

</details>

<br>

<details><summary>With that changed I was ready to work on the new method! In my first runthrough, I modified the code to see if it could  also return the false values just like Ruby</summary>

```js
if (!Array.prototype.partition){
    Array.prototype.partition = function(func, thisArg) {
        'use strict';
        if ( ! ((typeof func === 'function') && this) )
            throw new TypeError();

        var len = this.length >>> 0,
            resTrue = new Array(len), // preallocate True array
            resFalse = new Array(len), // preallocate False array
            t = this, cT = 0, cF = 0, i = -1;

        var kValue;
        while (++i !== len){
            // checks to see if the key was set
            if (i in this){
                kValue = t[i]; // in case t is changed in callback
                if (
                    (thisArg === undefined && func(t[i], i, t)) ||
                    func.call(thisArg, t[i], i, t)
                ) {
                    resTrue[cT++] = kValue;
                } else {
                    resFalse[cF++] = kValue;
                }
            }
        }

        resTrue.length = cT; // shrink down array to proper size
        resFalse.length = cF; // shrink down array to proper size
        return [resTrue, resFalse];
    };
}
```
</details>

<br/>

And it works! This example gives the following results:

```js
const arr = [1, 2, 3, 4, 5];
const output = arr.partition(x => x % 2 === 0); // [[2, 4], [1, 3, 5]];
output[0]; // [2, 4]
output[1]; // [1, 3, 5]

// and using thisArg
const myObject = { even: 0, odd: 1 };
arr.partition(function(x) { return x % 2 === this.even }, myObject); // [[2, 4], [1, 3, 5]];
arr.partition(function(x) { return x % 2 === this.odd }, myObject); // [[1, 3, 5], [2, 4]];
```

<details><summary>Now this obviously wasn't the cleanest code, so on my second runthrough I did the following</summary>

```js
if (!Array.prototype.partition){
    Array.prototype.partition = function(func, thisArg) {
        'use strict';
        if ( ! ((typeof func === 'function') && this) )
            throw new TypeError();

        var len = this.length >>> 0,
            res = [new Array(len), new Array(len)], // preallocate True and False arrays
            t = this, c = [0, 0], i = -1;

        var kValue;
        while (++i !== len){
            // checks to see if the key was set
            if (i in this){
                kValue = t[i]; // in case t is changed in callback
                const pos = (thisArg === undefined && func(t[i], i, t)) || func.call(thisArg, t[i], i, t) ? 0 : 1;
                res[pos][c[pos]++] = kValue;
            }
        }

        res[0].length = c[0]; // shrink down array to proper size
        res[1].length = c[1]; // shrink down array to proper size
        return res;
    };
}
```
</details>

<br/>

That seems much cleaner now, and still works! Off to see if this will go far in the process :)

Code On.

-Mike Merin
