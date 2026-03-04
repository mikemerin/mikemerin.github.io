---
layout: post
title: "Integers? Give Me a Sign"
subtitle: "More Than Just a Name"
date: 2021-01-04 19:02:25 -0400
tags: Rust
summary: Covering Rust's brilliant handling of number types
---
Integer types are nothing new; with SQL there's tiny/small/int/big (1/2/4/8 bytes of memory each), and in many languages there's integer, float, double, etc. However Rust is VERY strict with its types, and there are quite a few, but they're governed by this simple idea:

* Signed = positive OR negative values
* Unsigned = positive values ONLY

This appears in other languages as well (I remember SQL's `Unsigned INTEGER in column imported as numeric` which now makes more sense), in Rust this looks like:

isize - any signed integer | usize - any unsigned integer

Why **any** integer? That's because Rust goes even further with types and it's easy! Make integers of 8/16/32/64 bits by combining the letter and number! Here's a simple cheat sheet (works for floats as well):

| bits | signed | unsigned | float |
|---|---|---|---|
| **any** | isize | usize | |
| **8** | i8 | u8 | |
| **16** | i16 | u16 | |
| **32** | i32 | u32 | f32 |
| **64** | i64 | u64 | f64 |

Also another nuance: bits can contain 2^N numbers, so 8 bits contain 2^8 or 256 numbers. That means:

u8: 0 through 255

So i8 is -256 through 255 right? Nope! You'd use i16 for that. i8 is:

i8: -128 through 127

Why? when working with signed we make sure there are the same number of positive and negative integers. Simply put you take the total number and divide by 2. If you wanted 256 negative and 256 positive numbers you'd use i16 (-256 to +255).

Code On.

-Mike Merin
