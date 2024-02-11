---
layout: post
title: "See PHP Through Ruby-Colored Glasses"
subtitle: "A PHP Cheat Sheet"
date: 2017-11-24 22:43:38 -0400
tags: PHP, Ruby
series: Ruby Dev Learns Other Langauges
summary: Replicate Ruby shortcuts, iterations, and methods in PHP
---
If you learned how to program in Ruby, you probably noticed there's a large amount of shortcuts available to cut down on typing (while helping keep your code clean), as well as having a straightforward "English-like" syntax. PHP sort of has these but require more labor to actually get working. These shortcuts are very noticeable when you get into looping or iterating over objects, and if like me you learned Ruby first, you may not have known what those shortcuts actually do under the hood, so let's dive right in and compare how Ruby and PHP handle these shortcuts, iterations, and methods.

I also have a [Javascript through Ruby](https://mikemerin.github.io/JS-through-Ruby/) and a [Python through Ruby](https://mikemerin.github.io/Python-through-Ruby/) post in the same fashion as this post if you're interested.

**I'll be going into a lot of detail in this post, if you want an abbreviated PHP-only cheat sheet you can find that [here](https://mikemerin.github.io/PHP-Cheat-Sheet/) (not up yet, will come when this post is completed), though I would recommend going through this post if you want a better understanding of how everything works.**

I'll assume you know how to iterate in Ruby already, but if not then look at my [first cryptography post](https://mikemerin.github.io/cryptography/) for a detailed explanation.

A quick note before we begin regarding this post and formatting PHP: firstly, in each language's shell if you define a variable `name/$name = "Mike"`, in Ruby if you type `name` you'll get back `Mike`, in PHP if you type `$name` you'll get back nothing. This is just an implicit return that Ruby specifically does, but for the purposes of this post if I perform a function I'll simply give what it returns rather than spending an extra line doing `print ___;`. Secondly, using arrays with output functions like `print_r` or `var_dump` puts a neat looking but space-wasting multi-line array on the screen, so I'll instead be abbreviating that output to a normal looking array.

# PLEASE NOTE THIS POST IS A WORK IN PROGRESS AS WITH MY OTHER EDUCATION POSTS IT'S AS LONG AS A NOVEL. I HAVE NOTED THE VIP LINE BELOW

We'll be going over these basics, loops, iterations, and global methods:

Link | Ruby | PHP Equivalent | Description
---|---|---|---
|||**structure**
[1)](#1-objects-and-scripting) | not needed | `$obj`/ define, `;` | how to format PHP
[2)](#2-outputs) | puts p print | print echo print_r | ways to output objects
[3)](#3-variable-and-data-types) | str/num/etc, array/hash |  hash == array | types of variables and more
|||**functions**
[4)](#4-string-interpolation-and-manipulation) | `"#{obj}"` | `"${obj}" {$obj}" $obj"` | inserting objects into a string
[5)](#5-functions-to-change-data-type) | this.to_type | settype(this, "type") | Converts datatypes
[6)](#6-length-of-an-object) | x.length | count() / strlen() | length of an object (arr, str, etc.)
[7)](#7-ranges) | (1...5).to_a | range(1,5) | creates a ranged array (different)
[8)](#8-pushpopshiftunshift) | push / `<<` | array_push / `[]` | add onto the end of an array
| pop(x) | array_pop(a) | remove from the end of the array
| unshift | array_unshift | add onto the beginning of an array
| shift(x) | array_shift(a) | remove from the beginning of the array
[9)](#9-slicing) | .slice | slice / substr | select element(s) from array/string
[10)](#10-merging) | .concat | merge | combine two (or more in PHP) arrays
[11)](#11-splitting) | split | explode | combine two (or more in PHP) arrays
[12)](#12-testing-for-inclusion) | .include? | in | find if something is included


|||**loops**
[5)](#4-looping-with-while) | while / until | while | loops while condition is true
|||**iteration**
[5)](#5-using-for) | for | for / for..in | iterate over each element, more used in JS
[6)](#6-iterating) | .each | .forEach | iterate over each element
[7)](#7-getting-the-index) | .each.with_index | .forEach | same, but also get the index
[8)](#8-iterating-and-manipulating-with-map) | .map | .map | iterate over each element, changes the output
[9)](#9-mapping-with-the-index) | .map.with_index | .map | same, but also get the index
|||**manipulating methods**
[10)](#10-manipulating-arrays-with-reduce) | .reduce / .inject | .reduce | combines all elements via an operation
[11)](#11-making-arrays-neater) | .flatten | .concat | merge multi-dimensional / nested arrays
[12)](#12-removing-unwanted-values) | .compact | .filter | remove `nil` or `null` values from an array
[13)](#13-sorting-a-collection) | .sort / .sort_by | .sort | sort an array or hash/Object
[14)](#14-easier-ifelseetc) | case; each | switch; case | shorthand multiple `if` statements
[15)](#15-adding-to--removing-from-arrays) | .insert | .splice | add element(s) from array/string
| .delete_at / .slice! | .splice | remove element(s) from array/string
|||**selecting methods**
[17)](#17-keys-and-values) | .keys | Object.keys() | get all keys in a hash
| .values | Object.values() | get all values in a hash
[18)](#18-slice) | .slice | .slice | select element from array (different in Ruby vs. JS)
|||**more functions**
[19)](#19-callbacks) | call/procs | callbacks | function called within a function

# 1) Objects and Scripting
---
There's a simple but important difference between how the languages handle declaring of objects. In Ruby you can simply say `name = "Mike"` and there will now be an object `name` that outputs `"Mike"`, in JavaScript you need to do `var name` or `let name`/`const name`, and in PHP you simply need to add a dollar sign `$name = "Mike"`.

Finally you'll notice that at the end of all the PHP scripts above there's a semi-colon `;`. This is needed in PHP to let the program know we're ready to submit that line. Ruby is a lazy language where a new line is implicitly known by the program to end that line, same with JavaScript where you *can* but don't need a semi-colon to explicitly end a line, however PHP does need it every time.

# 2) Outputs
---
Both languages have a few ways to output data. I'll explain the different data types in the next section, but a basic difference in how each language returns information is actually calling it vs. returning it. As I mentioned before, for each language's shell if you define a variable `name/$name = "Mike"`, if you're in Ruby typing `name` will get you back `Mike`, but if you're in PHP typing in `$name` will get you nothing. This is just an implicit return that Ruby specifically does, but here's a rundown of the actual ways you can output information in each language:

```ruby
# Ruby

string = "hello"
array = ["one", "two", "three", "four"]
hash = {"one" => 1, "two" => 2}

# main output method, tries to put entries on separate lines
puts string
#=> hello
puts array
#=> one
#=> two
#=> three
#=> four
puts hash
#=> {"one"=>1, "two"=>2}
puts array[1]
#=> two
puts hash["one"]
#=> 1

# the method I usually use, helps with debugging as it helps give data type
p string
#=> "hello"
p array
#=> ["one", "two", "three", "four"]
p hash
#=> {"one"=>1, "two"=>2}
p array[1]
#=> "two"
p hash["one"]
#=> 1

# lastly a less used one, keeps things on one line
print string #=> hello
print array #=> ["one", "two", "three", "four"]
print hash #=> {"one"=>1, "two"=>2}
print array[1] #=> two
print hash["one"] #=> 1
```

```php
// PHP

$string = "hello";
$array = ["one", "two", "three", "four"];
$hash = ["one" => 1, "two" => 2];

// main output methods, they do exactly the same thing, but has limitations for arrays
// echo is slightly faster than print
echo $string;
print $string;
//=> hello
echo $array;
print $array;
//=> Array
echo $hash;
print $hash;
//=> Array
echo $array[1];
print $array[1];
//=> two
echo $hash["one"];
print $hash["one"];
//=> 1


// human-readable version, enables seeing all elements in an array
print_r ($string);
//=> hello
print_r ($array);
//=> Array
// (
//    [0] => one
//    [1] => two
//    [2] => three
//    [3] => four
// )
print_r ($hash);
//=> Array
// (
//    [one] => 1
//    [two] => 2
// )
print_r ($array[1]);
//=> two
print_r ($hash["one"]);
//=> 1

// return the data type and value. helpful for also getting the length
var_dump($string);
//=> string(5) "hello"
var_dump(5);
//=> int(5)
var_dump(5.5);
//=> float(5.5)
var_dump($array);
//=> array(4) {
//  [0]=>
//  string(3) "one"
//  [1]=>
//  string(3) "two"
//  [2]=>
//  string(5) "three"
//  [3]=>
//  string(4) "four"
// }
var_dump($hash);
//=> array(2) {
//  ["one"]=>
//  int(1)
//  ["two"]=>
//  int(2)
// }
var_dump($array[1]);
//=> string(3) "two"
var_dump($hash["one"]);
//=> int(1)
```

Again as I noted from before: Please note that in the rest of this post, instead of posting the multi-line array things like how `print_r` or `var_dump` outputs, to save space I'll instead just abbreviate it to a normal looking array like `["one", "two", "three", "four"]`.

# 3) Variable and Data Types
---
Ruby has a few unique types of variables to the language that you can declare:

```ruby
# Ruby

variable = "normal variable"
@variable = "instance variable"
@@variable = "class variable"
$variable = "global variable"
VARIABLE = "constant"
```

PHP is more limited in its variable types, though there is one addition that's similar to JavaScript's `const` in that you can **never** change it once you define it:

```php
// PHP

$variable = "normal variable";
define(VARIABLE, "a constant variable that can't be changed after this point");

print $variable;
//=> normal variable
print VARIABLE;
//=> a constant variable that can't be changed

$variable = "changing it around";
print $variable;
//=> changing it around

VARIABLE = "can't touch this";
// Parse error: parse error in php shell code on line 1
define(VARIABLE, "can't touch this");
print VARIABLE;
// a constant variable that can't be changed
```

As you can see we can change around normal variables as much as we want, but once we define a constant variable it's there to stay.

When looking at data types there are even less. While Ruby has:

```ruby
# Ruby
array = ["one", "two", "three", "four"]
hash = {"one" => 1, "two" => 2}
```

PHP combines these into just arrays:

```php
// PHP

$array1 = ["one", "two", "three", "four"];
$array2 = Array("one", "two", "three", "four");
$hash = Array("one" => 1, "two" => 2);
```

Lastly in PHP there's something called a *variable variable* which has some funny properties. You can use two dollar signs to dynamically define a variable:

```php
// PHP

$greeting = "hey";
$$greeting = "everyone";

print $greeting; //=> "hey"
print $$greeting; //=> "everyone"

// and the funny thing:

print $hey; //=> "everyone"
```

See what happened there? `$greeting` outputs `"hey"`, and we can then call on that `"hey"` as a variable to output the next dollar sign's variable output. This way we can make dynamic variables and not have to re-define them over and over again. Also, we can keep adding dollar signs and make a variable variable variable, etc. etc. etc.

# 4) String Interpolation and Manipulation
---
### Interpolation

Here is a minor but important difference between "adding" and manipulating strings. In Ruby we literally add it using the addition symbol `+` or `+=` to add it permanently. In PHP however we use a period `.` or `.=` to do this:

```ruby
# Ruby

animal = "dog"
name = "Lily"
age = 8

puts name + ", the " + age.to_s + " year old " + animal + "."
#=> "Lily, the 8 year old dog."
```

```php
// PHP

$animal = "dog";
$name = "Lily";
$age = 8;

print $name . ', the ' . $age . ' year old ' . $animal . '.';
//=> "Lily, the 8 year old dog."
```

We can also update any strings in a similar fashion:

```ruby
# Ruby

name += "ana" #=> "Lilyana"
puts name + ", the " + age.to_s + " year old " + animal + "."
#=> "Lilyana, the 8 year old dog."
```

```php
// PHP

name .= "ana" //=> "Lilyana"
print $name . ', the ' . $age . ' year old ' . $animal . '.';
//=> "Lilyana, the 8 year old dog."
```

The problem with this type of interpolation though is it's fairly ugly to look at and can be very confusing when going back and forth between objects like `name/$name` and strings (especially in Ruby's case with the number needing to be converted to a string first). Thankfully both languages have a simpler way to do this, with Ruby using a pound sign `#` and PHP a dollar sign `$` (which is the same as JavaScript) followed by curly brackets `{}`:

```ruby
# Ruby

animal = "dog"
name = "Lily"
age = 8

puts "#{name}, the #{age} year old #{animal}."
#=> "Lily, the 8 year old dog."
```

```php
// PHP

$animal = "dog";
$name = "Lily";
$age = 8;

print "${name} the ${age} year old ${animal}.";
//=> "Lily, the 8 year old dog."
```

This is easier than typing out the ugly looking mix of objects from before. In addition, because PHP uses a dollar sign anyway for objects, the language can interpolate a few other ways:

```php
// PHP

// the dollar sign inside the curly brackets
print "{$name} the {$age} year old {$animal}.";

// without curly brackets entirely
print "$name the $age year old $animal.";

// mix and match
print "${name} the {$age} year old $animal.";
```

Quick note about the PHP script: even though you can call the object with or without the curly brackets `{}`, you'll need those brackets if you want to add something to an object like `{$name}ana` from before:

```php
// PHP

$animal = "dog";
$name = "Lily";
$age = 8;

// works
print "${name}ana the ${age} year old ${animal}.";
// or
print "{$name}ana the ${age} year old ${animal}.";
//=> "Lilyana, the 8 year old dog."

// doesn't work
print "${nameana} the ${age} year old ${animal}.";
// or
print "$nameana the ${age} year old ${animal}.";
//=> " the 8 year old dog."
```

### Manipulation

As far as object manipulation goes for string interpolation, while in Ruby we can do it as easily as:

```ruby
# Ruby

animal = "dog"
name = "Lily"
age = 8

puts "#{name}, the #{age + 1} year old #{animal}."
#=> "Lily, the 9 year old dog."
```

we unfortunately have to go back to the ugly concatenation way from before to get it working in PHP:

```php
// PHP

$animal = "dog";
$name = "Lily";
$age = 8;

print "${name} the " . ($age + 1) . " year old ${animal}.";
// or
print "${name} the " . ({$age} + 1) . " year old ${animal}.";
// Lilyana the 9 year old dog.
```

We have to encase the object manipulation in parentheses to make sure the string is printed correctly.

Some other quick `str` functions to note:

```php
// PHP

$string = "testing out a string";

print strrev($string);
//=> gnirts a tuo gnitset

print strpos($string, "out");
//=> 8

print str_replace("a", "this", $string);
//=> testing out this string
```

# 5) Functions to Change Data Type
---
Both Ruby and PHP have easy ways to convert data types. Ruby uses a `thing.to_type` and PHP uses `settype(thing, "type")`. Though this section will be short and sweet as it's fairly direct, there are two key differences between the two languages:

1) Ruby can convert both named variables as well as simple numbers/strings/floats/etc., however PHP can only change the type of named variables.

2) While Ruby's `to_type` temporarily changes the variable's type in that moment you call on it, PHP's `settype` is **permanent**, so be careful if you convert a variable by mistake (aka don't try to change an array into an integer, which will permanently make it into the number 1).

```ruby
# Ruby

# Converting to strings
150.to_s #=> "150"
150.to_s.class #=> String

# Converting to an integer
"10".to_i #=> 10
"10".to_i.class #=> Fixnum

# Converting to a float
"10".to_f #=> 10.0
10.to_f #=> 10.0
"10".to_f.class #=> Float
```

```php
// PHP

$n = 150;
print gettype($n); //=> integer

settype($n, "string");
print $n; //=> "150"
print gettype($n); //=> string

settype($n, "integer");
print $n; //=> 150
print gettype($n); //=> integer

settype($n, "float");
print $n; //=> 150 ()
print gettype($n); //=> double
```

Wait double? Don't worry, in PHP **float**, **double**, and **real** are all the same data types (quick note for Python programmers, a double in this language isn't the same as a Python's double which is slightly different than a float).

# 6) Length of an object
---
You've probably noticed by now that Ruby has a lot more emphasis on calling functions on an object via `object.do_something` versus PHP calling objects inside a function via `do_something(object)`. This is the same for how we count the length on an object. In Ruby this can be done in multiple ways as a "one size fits all", though in PHP it's split up into different functions depending on if it's an array or a string:

```ruby
# Ruby

[1, 2, 3, 4].size #=> 4
[1, 2, 3, 4].length #=> 4
[1, 2, 3, 4].count #=> 4
"testing out a string".size #=> 20
"testing out a string".length #=> 20
```
```php
// PHP

print count([1, 2, 3, 4]); //=> 4
print strlen("testing out a string"); //=> 20
```

In addition, PHP has a built-in function to help with counting words:

```php
// PHP

print str_word_count("testing out a string");
//=> 4
```

This is similar if in Ruby we did `string.split(" ").length`

# 7) Ranges
---
Ranges are very important and thankfully both Ruby and PHP have easy ways to create them. They work differently in each language, and surprisingly PHP is slightly more versatile in what it can do. Nevertheless it's incredibly important to know how to use it in both languages.

Ruby uses two periods `..` to denote a range. For example if you want to go from 1 to 5 you'd put `1..5`, or use three periods `...` to go from 1 *up until* 5 by doing `1...5`. Ranges must go from the lowest number to the highest number otherwise it won't work, though you can use negative numbers as long as the first one is smaller:

```ruby
# Ruby

(1..5).to_a #=> [1, 2, 3, 4, 5]
(1...5).to_a #=> [1, 2, 3, 4]
(-5..-1).to_a #=> [-5, -4, -3, -2, -1]
```

Additionally in Ruby only you can also do ranges of letters:

```ruby
# Ruby

("a".."e").to_a #=> ["a", "b", "c", "d", "e"]
("M"..."Q").to_a #=> ["M", "N", "O", "P"]
```

Finally you can space out how many numbers/letters by using `.step` and it'll skip ahead by that many numbers/letters:

```ruby
# Ruby

(1..10).step(3).to_a #=> [1, 4, 7, 10]
("a".."i").step(2).to_a #=> ["a", "c", "e", "g", "i"]
```

Onto PHP. The `range` method takes in 2-3 arguments: if you put in two numbers it'll go from the first number up to the second number, and if you add a third number it will be the step.

```php
// PHP

print_r (range(1, 5)); //=> [1, 2, 3, 4, 5]
print_r (range(1, 10, 3)); //=> [1, 4, 7, 10]
print_r (range(-5, 0)); //=> [-5, -4, -3, -2, -1, 0]

print_r (range("a","e")); //=> ["a", "b", "c", "d", "e"]
print_r (range("a","i",2)); //=> ["a", "c", "e", "g", "i"]
```

Here's something nifty though that PHP can only do: ranges in reverse without needing steps. If you tried to do `(0..-5)` or `(10..1)` in Ruby you'd get an error, but in PHP ranges this is valid! Another quick note that the step can be either positive or negative and it will still count the step correctly.

```php
// PHP

print_r (range(0, -5)); //=> [0, -1, -2, -3, -4]
print_r (range(1, -10, 3)); //=> [1, -2, -5, -8]
print_r (range(100, 20, 18)); //=> [100, 82, 64, 46, 28]

print_r (range("e","a")); //=> ["e", "d", "c", "b", "a"]
```

# 8) Push/Pop/Shift/Unshift
---
While Ruby and JS have the same push/pop/unshift/shift functions for modifying arrays, in PHP you instead call `array_type` in different ways. Even though there are some limitations in PHP for shifting/popping, all the above functions are just as easy to do with some subtle differences.

#### Ruby: push / `<<` | PHP: array_push / `[]`

Ruby's `push` or shovel `<<` operator works the same as PHP's `array_push`, which adds element(s) onto the end of an array. In addition you can do `array[]` to add a single element onto the array

```ruby
# Ruby

array = [1, 2, 3, 4]
array.push(5) #=> [1, 2, 3, 4, 5]
array.push(6, 7) #=> [1, 2, 3, 4, 5, 6, 7]
array << 8 #=> [1, 2, 3, 4, 5, 6, 7, 8]
```

```php
// PHP

$array = [1, 2, 3, 4];
array_push($array, 5); //=> [1, 2, 3, 4, 5]
array_push($array, 6, 7); //=> [1, 2, 3, 4, 5, 6, 7]
$array[] = 8;  //=> [1, 2, 3, 4, 5, 6, 7, 8]
```

#### Ruby: unshift | PHP: array_unshift

These add element(s) onto the beginning of an array.

```ruby
# Ruby
array = [1, 2, 3, 4]
array.unshift(0) #=> [0, 1, 2, 3, 4]
array.unshift(-2, -1) #=> [-2, -1, 0, 1, 2, 3, 4]
```

```php
// PHP
$array = [1, 2, 3, 4];
array_unshift($array, 0); //=> [0, 1, 2, 3, 4]
array_unshift($array, -2, -1); //=> [-2, -1, 0, 1, 2, 3, 4]
```

#### Ruby: pop/shift | PHP: array_pop/array_shift

I'll cover both of these functions at once since they do the same thing at different locations and have the same limitations in PHP. Calling `pop` removes element(s) from the end of an array (you pop it off), and `shift` removes element(s) from the beginning of an array (you shift everything down). Ruby can handle multiple elements at once but PHP can only do one at a time. If you wanted to do more you could use PHP's `array_slice` method which I'll cover next.

```ruby
# Ruby
array = ["one", "two", "three", "four", "five", "six", "seven", "eight"]
array.pop #=> "eight"
array #=> ["one", "two", "three", "four", "five", "six", "seven"]
array.pop(2) #=> ["six", "seven"]
array = ["one", "two", "three", "four", "five"]

array.shift #=> "one"
array #=> ["two", "three", "four", "five"]
array.shift(2) #=> ["two", "three"]
array #=> ["four", "five"]
```

```php
// PHP
$array = ["one", "two", "three", "four", "five", "six", "seven", "eight"];
print array_pop($array); //=> "eight"
print_r ($array); //=> ["one", "two", "three", "four", "five", "six", "seven"]

print array_shift($array); //=> "one"
print_r ($array); //=> ["two", "three", "four", "five", "six", "seven"]
```

# 9) Slicing
### Ruby: `.slice` | PHP: `slice()` / `substr()`
---
While popping and shifting can let you modify an array from the end and beginning, there's an even more powerful function that can let you the above and then some. Slice is a *non-destructive* method (doesn't change the array after you call it) that lets you pick and choose what parts of an array (or even a string) you'd like to return. This is especially even more useful in PHP since its pop/shift functions can only do one element at a time, and `slice` can tackle any number of elements.

There are three differences between the two languages' slices:

The first: if slice takes in only one argument, Ruby will use that as the **index number** you'd like to return (it acts just like if you're doing array[n]), while PHP will use that as the **low index number** to start returning from until the end of the array. Note that this first number can be negative and that index number will count from the end of the array:

```ruby
# Ruby

array = ["one", "two", "three", "four", "five", "six", "seven", "eight"]

array[1] # same as
array.slice(1)
#=> "two"
array.slice(-3)
#=> "six"
```

```php
// PHP

$array = ["one", "two", "three", "four", "five", "six", "seven", "eight"];
print_r (array_slice($array, 1));
//=> ["two", "three", "four", "five", "six", "seven", "eight"]
print_r (array_slice($array, -3));
//=> ["six", "seven", "eight"]

```

However if you put two arguments in, both languages will use the first as the low index number and the second will be how many elements to count out from.

```ruby
# Ruby

array = ["one", "two", "three", "four", "five", "six", "seven", "eight"]

array[0, 7] # same as
array.slice(0, 7)
#=> ["one", "two", "three", "four", "five", "six", "seven"]
array.slice(2, 2)
#=> ["three", "four"]
```

```php
// PHP

$array = ["one", "two", "three", "four", "five", "six", "seven", "eight"];
print_r (array_slice($array, 0, 7));
//=> ["one", "two", "three", "four", "five", "six", "seven"]
print_r (array_slice($array, 2, 2));
//=> ["three", "four"]
```

The second: in PHP we can add a third optional argument of `true` if we want to return the actual index of the returned values:

```php
// PHP

print_r (array_slice($array, 2, 2));
//=> Array
// (
//    [0] => three
//    [1] => four
// )
print_r (array_slice($array, 2, 2, true));
//=> Array
// (
//    [2] => three
//    [3] => four
// )
```

The third: if we wanted to use this for strings, Ruby's slice can just be used the exact same way:

```ruby
# Ruby

string = "string"

string[1] # same as
string.slice(1)
#=> "t"
string.slice(-3)
#=> "i"
string.slice(0,4)
#=> "stri"
string.slice(2,2)
#=> "ri"
```

While in PHP we'd instead need to use `substr`. The good news though is it's a carbon copy of PHP's slice function so just use it the same way:

```php
// PHP

$string = "string";

print substr($string, 1);
//=> "tring"
print substr($string, -3);
//=> "ing"
print substr($string, 0, 4);
//=> "stri"
print substr($string, 2, 2);
//=> "ri"
```

# 10) Merging
### Ruby: `+` / `.concat` | PHP: `array_merge`
---

Back to building onto arrays, while pushing and shifting allows you to

 and the `array_merge` function lets you do even more.

Another way you can add anything to an array and flatten it in the process is by using `array_merge`. You can do a pseudo array_push or array_unshift this way, and even better you can merge as many arrays together as you want!

```php
// PHP

$array = [1, 2];
$array = array_merge($array, [3]);
//=> [1, 2, 3]
$array = array_merge($array, [4, 5]);
//=> [1, 2, 3, 4, 5]
$array = array_merge($array, array(6, 7));
//=> [1, 2, 3, 4, 5, 6, 7]
$array = array_merge([0], $array);
//=> [0, 1, 2, 3, 4, 5, 6, 7]

$array = [1, 2, 3];
$array = array_merge($array, $array);
//=> [1, 2, 3, 1, 2, 3]

$array = [1, 2, 3];
$array = array_merge($array, $array, $array);
//=> [1, 2, 3, 1, 2, 3, 1, 2, 3]
```

# 11) Splitting
---





# WIP LINE BELOW
---




# 12) Testing for inclusion
### Ruby: `include` | Python: `in`
---
We're about to see the word `in` much more in Python, so let's get used to using it. Ruby has a very useful function called `include?` which lets us test if something is included in an array or string.

```ruby
# Ruby
[1, 2, 3, 4, 5].include?(5) #=> true
[1, 2, 3, 4, 5].include?(7) #=> false
"this is a string".include?("t") #=> true
"this is a string".include?("is") #=> true
"this is a string".include?("e") #=> false
```

Thankfully it's just as easy to do this in Python, the difference again is merely syntax:

```python
# Python
5 in [1, 2, 3, 4, 5] #=> True
7 in [1, 2, 3, 4, 5] #=> False
"t" in "this is a string" #=> True
"is" in "this is a string" #=> True
"e" in "this is a string" #=> False
```

There's also a way to negate both of these scripts. Though Ruby doesn't have an `exclude?` function, we can simply put an exclamation point `!` in front of the script to negate it, and in Python we'll simply put `not`

```Ruby
# Ruby
![1, 2, 3, 4, 5].include?(5) #=> false
```

```python
# Python
"t" not in "this is a string" #=> False
```







# 8) Looping With `while`
---
Let's start off with the easiest example. These methods are almost identical in both Ruby and PHP (if you know JavaScript it's virtually the same as in PHP), in fact the only thing that's different is the syntax. Here's a quick example:

```ruby
# Ruby
array = []
x = 1
while x < 6
    array.push(x)
    x += 1
end
array #=> [1,2,3,4,5]
```

```php
// PHP
$array = [];
$x = 1;
while ($x < 6) {
    $array.push(x);
    x += 1;
}
print $array; //=> [1,2,3,4,5]
```

Let's do a side-by-side:

Ruby | JavaScript | Difference
---|---|---
array = [] | var array = [] | var for JS (can also do let)
x = 1 | var x = 1 | same, doing var (or let)
while x < 6 | while (x < 6) | JS needs its test to be in parenthesis `()`
array.push(x) | { array.push(x) | same, but JS needs to be in a block `{}`
x += 1 | x += 1 | same (but in JS you can also do `x++`)
end | } | JS must ends by closing off the curly bracket
array | array | both #=> [1,2,3,4,5]

While Ruby does much of the work for us, JS we need to manually put in the parentheses and curly brackets. However knowing this means we can more easily do one line solutions (helpful if combining with other complex scripts):

```ruby
# Ruby
array = []
x = 1
while x < 6; array.push(x); x += 1 end
array #=> [1,2,3,4,5]
```

```javascript
// JavaScript
array = []
x = 1
while ( x < 6 ) { array.push(x); x++ }
array //=> [1,2,3,4,5]
```

While in this case our JS looks a bit cleaner, this is by no means the cleanest way to do this type of operation. Ruby has quite a few ways to shorten this, including a trick using `.reduce` (also known as `.inject` in Ruby only), but I'll cover that later on.

# 5) Using `for`
---
While `for` isn't used much in Ruby (since `while`, `until`, or other iterations can do much more, are cleaner, and get the job done easier), it's very important in JS. While this is a nice trick in Ruby:

```ruby
# Ruby
array = []
for x in 1..5
    array.push(x)
end
array #=> [1,2,3,4,5]
```

Unfortunately there's no quick way to do a range iterator in JavaScript (the `(1..5)` above), ***however*** `for` is still very useful if we use it another way. Remember that while loop from before? Here's how we'd cleanly do it in JS:

```javascript
// JavaScript
array = []
for (let x = 1;
    x < 6;
    x++ )
    { array.push(x) }
array #=> [1,2,3,4,5]
```

Or the MUCH cleaner one-liner:

```javascript
// JavaScript
array = []
for (let x = 1; x < 6; x++) { array.push(x) }
array //=> [1,2,3,4,5]
```

We basically include what we want our number `x` to do all in one neat place (our parenthesis), and then operate on it within our block. As you'd expect, we can do this with other things too, like iterating over an array!

# 6) Iterating
### Ruby: `.each` / for | JS: `for`/`for..in` then `.forEach`
---
Onto iterations. As I said before, `.each` in Ruby is incredibly useful, and does what both `for` and `.forEach` does in JS. Before we get to the latter, let's flash back to Ruby and cover how we can iterate over an array using `.each` beginning with a more lengthy iteration (similar to JS's `for`) and ending with a shortcut (similar to JS's `.forEach`). These first three examples are the former:

```ruby
# ruby
array = [1,2,3,4,5]
array2 = []

(0...array.length).each { |i| print array[i] }
#=> 12345

(0...array.length).each { |i| array2.push( array[i] ) }
array2 #=> [1,2,3,4,5]

array2 = []
(0...array.length).each { |i| array2.unshift( array[i] ) }
array2 #=> [5,4,3,2,1]
```

Now let's finally do that fancy JS iteration using `for` but this time over an array. To spoof the range we'll set our index to 0, limit it to the array.length, and add up by 1:

```javascript
// JavaScript
array = [1,2,3,4,5]
array2 = []

// long version for clarification:

for (let i = 0, l = array.length; // declare i, l as variables
     i < l; // while index is less than the array length
     i++ ) // increment by 1
    { array2.push( array[i] ) }
array2 //=> [1,2,3,4,5]

// shorter and clean version:

for (let i = 0, l = array.length; i < l; i++) { array2.push( array[i] ) }
//=> [1,2,3,4,5]
for (let i = 0, l = array.length; i < l; i++) { array2.unshift( array[i] ) }
//=> [5,4,3,2,1]
```

This is how `.each` directly correlates with `for`, but there's a better way to iterate over an array that inherently **knows** to go from the start to the end of an array without us needing to tell it. Doing this in Ruby:

```ruby
# Ruby
for x in array; puts x end
for x in array; array2.push(x) end
```

In JS we'll introduce `in`:

```javascript
// JavaScript
for (let i in array) { console.log( array[i] ) }
for (let i in array) { array2.push( array[i] ) }
```

We're obtaining the index `i` from the `array`, then using it in our code block.

This is as far we can go using `for` in JS. You'll notice that there's a very important difference in how Ruby handles `for` compared to JS: while Ruby calls on the element, JS calls on the index, and we can't grab the element directly, therefore we **still** have to do `array[i]` instead of how we were just using `x` in Ruby above. Time to break out `forEach` and fix that:

```ruby
# Ruby
array.each { |x| puts x }
array.each { |x| array2.push2.push( array[i] ) }
```

```javascript
// JavaScript
array.forEach( x => { console.log(x) } )
array.forEach( x => { array2.push(x) } )
```

# 7) Getting the Index
### Using Ruby's `.each_with_index` or `.each.with_index` in JS
---
Both of these each functions are the same thing in Ruby, however JS has neither of these functions available. Thankfuly though JS has a way to easily iterate over both the element **and** the index at the **same time**:

```ruby
# Ruby
array = ["Hello", "World"]
array.each_with_index { |x,i| puts "the index is #{i}, the element is #{x}" }
```

```javascript
// JavaScript
array.forEach( (x, i) => console.log(`The index is ${i}, the element is ${x}`) )
```

These both print out:

"the index is 0, the element is Hello"

"the index is 1, the element is World"

# 8) Iterating and manipulating with `.map`
---
Our newfound `.forEach` is great, but there's a problem: what if we want to return a new array without having to perform the arduous task of creating a blank array and then appending it to that array, then having to set it up again each time? In comes `.map` which simply outputs our answer each time we call it! It's used in the same way we use `.forEach`. For example if we have `array = [1,2,3,4,5]` and compare `.each/.forEach` vs. `.map`:

```ruby
# Ruby
array.each { |x| x * 2 } #=> [1,2,3,4,5] unchanged output
array.map { |x| x * 2 } #=> [2,4,6,8,10] changed output
```

```javascript
// JavaScript
array.forEach(x => x * 2) //=> undefined (no output)
array.map(x => x) //=> [1,2,3,4,5] unchanged output (technically spoofs the input like Ruby .each)
array.map(x => x * 2) //=> [2,4,6,8,10] changed output
```

`.map` is great for shortening your code and making them one-liners, which cleans up your code and makes it much more readable.

# 9) Mapping With the Index
### Using Ruby's `.map.with_index` in JS
---
Just like with `.each.with_index`, JS has a way to easily iterate over both the element **and** the index at the **same time** and output the value you want:

```ruby
# Ruby
array = [10,20,30,40,50]
array.map.with_index { |x,i| i } #=> [0,1,2,3,4]
array.map.with_index { |x,i| x * i } #=> [0,20,60,120,200]
```

```javascript
// JavaScript
array.map((x, i) => i) //=> [0,1,2,3,4]
array.map((x, i) => x * i) //=> [0,20,60,120,200]
```

# 10) Manipulating arrays with `.reduce`
---
Now let's go over what `.reduce` does (also known as `.inject` in ruby) and add up all values in the array, starting with the shortcut then expanding out to see what's under the hood. Note that all of these will produce the correct answer of 15:

```ruby
# ruby
array = [1,2,3,4,5]

array.reduce(:+)
# reduce takes in an addition symbol
# note: (:+) is also a smiley face

array.reduce(0, :+)
# start at 0, then perform the reducing

array.reduce(0) { |sum, x| sum + x }
# what the (:+) is actually doing

sum = 0
array.each { |x| sum += x }
sum #=> 15
# an even more literal example
```

As you can see, what reduce does is:
start at 0 (default), add 1, now sum = 1
start at sum (1), add 2, now sum = 3
start at sum (3), add 3, now sum = 6
etc. until the end.

In JS however, we don't have these shortcuts available to us, so instead we have to write it out, albeit a little bit. Let's look at the following four Ruby scripts in order to understand their JS counterparts. They all do the same thing, and JS sort of has something to do with all of them. Let's go through them and build up our `.reduce` statement:

#### 1. reduce takes place inside a single parenthesis

```ruby
# Ruby
array.reduce(:+)
```

```javascript
// JavaScript
array.reduce( "sum script" )
```

#### 2. you can set a default value (JS will be in the 2nd position, not the 1st)

```ruby
# Ruby
array.reduce(0, :+)
```

```javascript
// JavaScript
array.reduce( "sum script", 0 )
```

#### 3. the operation inside the Ruby block looks almost identical to the JS version.

```ruby
# Ruby
array.reduce { |sum, x| sum + x }
array.reduce(0) { |sum, x| sum + x }
```

```javascript
// JavaScript
array.reduce( function(sum, x) { return sum + x } , 0)
```

 Here's how these same reduce functions can look in JS, including with the cleaner ES6 notation:

```javascript
// JavaScript
array.reduce( function(sum, x) { return sum + x } )
array.reduce( function(sum, x) { return sum + x }, 0 )
// vs ES6:
array.reduce( (sum, x) => sum + x )
array.reduce( (sum, x) => sum + x, 0 )
```

Again the default value in JS is AFTER the sum variable, not before it. So here's the answer to what that `(:+)` symbol (smiley) was doing under the hood in Ruby, but we'll explain it through JS! We can make our reduce function cleaner though by making `sum` into a variable (using `const`), and we can also make one for multiplication while we're at it:

```javascript
// JavaScript
const sum = (sum,x) => sum + x
const multi = (multi,x) => multi * x

array.reduce(sum) //=> 15
array.reduce(sum, 10) //=> 25

array.reduce(multi) //=> 120
array.reduce(multi, 2) //=> 240
```

# 11) Making Arrays Neater
### Ruby: `.flatten` | JS: `.concat`
---
What happens when you have an array nested within an array (a multi-dimensional array) and want to make it look neater (into a single-dimensional array)? For example we want this ugly nested array:

`array = [1, 2, [[3, 4], 5], [6, nil, 7], 8, 9]`

to look like this neat one:

`array = [1, 2, 3, 4, 5, 6, nil, 7, 8, 9]`

In Ruby it's simple enough as we'd simply call `.flatten` on the array (Ruby once again takes care of the behind-the-scenes code for us)

```ruby
# Ruby
array.flatten #=> [1, 2, 3, 4, 5, 6, nil, 7, 8, 9]
```

In JS it's a bit more complicated, though only by a bit when you get used to it. I'll explain each of these in detail along with what goes into both of these methods.

The first way is the easiest (and my preferred) way: use `.concat` to append each element onto a blank array along with a neat little JS trick:

```javascript
// javascript
[].concat(...array) //=> [1, 2, 3, 4, 5, 6, null, 7, 8, 9]
[].concat(0, ...array) //=> [0, 1, 2, 3, 4, 5, 6, null, 7, 8, 9]
[].concat(...[-1,0], ...array, "woo!") //=> [-1, 0, 1, 2, 3, 4, 5, 6, null, 7, 8, 9, "woo!"]
```

I'll explain the `...` in a second, but the important part about this `.concat` method is that you can combine **any number of arrays or values** and it will combine them all! Meanwhile, in the `(...array)`, that `...` is what's known in JS as a `spread operator` which, well, spreads out an array. It's used during creation or changing of arrays to expand the array and call on all elements in it. For your understanding, here is an example of what this operator does:

```javascript
// JavaScript
a1 = [1,2,3]
a2 = [4,5,6]
[a1,a2] //=> [ [1,2,3], [4,5,6] ]
[...a1,a2] //=> [1,2,3, [4,5,6] ]
[...a1,...a2] //=> [1,2,3,4,5,6]
```

The second way is by using `.apply`, which, well, applies what you want into an array. We can either do this to an empty array or to an existing one. Note that unlike the first way you cannot combine more than one array or value:

```javascript
// JavaScript
[].concat.apply([],array) //=> [1, 2, 3, 4, 5, 6, null, 7, 8, 9]
[].concat.apply([-1,0],array) //=> [-1, 0, 1, 2, 3, 4, 5, 6, null, 7, 8, 9]
```

Again though, the first method is shorter and is much more useful especially for multiple arrays. It's good to know though what `.apply` can do.

# 12) Removing Unwanted Values
### Ruby: `.compact` | JS: `.filter`
---
Hold on though, in the above example, even though we ran `flatten`/`concat` on our array, we still have a `nil`/`null` value in there. To get rid of them we simply run the following in Ruby:

```ruby
# Ruby
[1, 2, nil, 3, 4, 5, "hey"].compact #=> [1, 2, 3, 4, 5, "hey"]
```

Which basically iterates over the array and removes `nil` whenever it finds it (non-destructively). To destructively do this just use `.compact!` or `array.delete(nil)`. The syntax will look very similar to the latter where we'll tell our program to delete any element that doesn't pass our test, aka keeping elements that pass. This brings us to how `.filter` is used in JS:

```javascript
// JavaScript
[1, 2, null, 3, 4, 5, "hey"].filter(x => x) //=> [1, 2, 3, 4, 5, "hey"]
[1, 2, null, 3, 4, 5, "hey"].filter(Number) //=> [1, 2, 3, 4, 5]
[1, 2, null, 3, 4, 5, "hey"].filter(x => x % 2 === 0) //=> [2, null, 4]
[1, 2, null, 3, 4, 5, "hey"].filter(x => x % 2 === 1) //=> [1, 3, 5]
```

The first basically says: "filter this array by calling the element, and if it's true then it passes through the filter" which gets rid of all `null` values. The second says "filter this array, and if it's a number then it passes through the filter." Note that the second only works if all elements are numbers, but the first works even if you have a mixture of numbers, strings, or otherwise!

The third/fourth filters show the usefulness of filtering out our array as we can test if certain things are true, in this case testing which elements are even or odd respectively. Notice that `null` still passes as `null % 2` is 0, weird right?

# 13) Sorting a Collection
### array/string/hash/Object with `.sort`
---

Let's start off simple and we'll end with some neat tricks. Say you have an array of strings that you want to sort alphabetically:

```ruby
# Ruby
array_string = "hey everyone how's it going?".split
array_string #=> ["hey", "everyone", "how's", "it", "going?"]
array_string.sort #=> ["everyone", "going?", "hey", "how's", "it"]
array_string.sort.reverse #=> ["it", "how's", "hey", "going?", "everyone"]
```

```javascript
// JavaScript
var array_string = ["hey", "everyone", "how's", "it", "going?"]
array_string.sort() //=> [ "everyone", "going?", "hey", "how's", "it" ]
array_string.sort().reverse() //=> [ "it", "how's", "hey", "going?", "everyone" ]
```

Great easy enough, so let's move onto an array of integers:

```ruby
# Ruby
array = [14, 25, 16, 22, 5]
array.sort #=> [5, 14, 16, 22, 25]
array.sort.reverse #=> [25, 22, 16, 14, 5]
```

```javascript
// JavaScript
var array = [14, 25, 16, 22, 5]
array.sort() //=> [ 14, 16, 22, 25, 5 ]
array.sort().reverse() //=> [ 5, 25, 22, 16, 14 ]
```

Oh that's strange, Ruby's smart enough to sort numbers normally but JavaScript isn't. Why? JavaScript first converts everything to a string first before sorting, then does the actual sort, so it sorts it "alphabetically" instead of numerically. Here's what it's doing from the viewpoint of Ruby:

```ruby
# Ruby
array = [14, 25, 16, 22, 5]
array_string = array.map(&:to_s) #=> ["14", "25", "16", "22", "5"]
array_string.sort #=> ["14", "16", "22", "25", "5"]
array_string.sort.map(&:to_i) #=> [14, 16, 22, 25, 5]
```

The number "1" in 14 appears before the number "5", just like how the "h" in hey appears before the "i" in it, even though "it" is two letters long and "hey" is three letters long, like how 5 is one digits long and 14 is two digits long. So how do we fix this? There's a little trick and it involves forcing JavaScript to compare values of adjacent elements. I'll explain this after we do it:

```javascript
// JavaScript
var array = [14, 25, 16, 22, 5]
array.sort( function(a,b) { return a - b } ) //=> [ 5, 14, 16, 22, 25 ]
array.sort( function(a,b) { return a > b } ) //=> [ 5, 14, 16, 22, 25 ]
// and reverse:
array.sort( function(a,b) { return b - a } ) //=> [ 25, 22, 16, 14, 5 ]
array.sort( function(a,b) { return a < b } ) //=> [ 25, 22, 16, 14, 5 ]

// ES6 notation

array.sort( (a,b) => a - b ) //=> [ 5, 14, 16, 22, 25 ]
array.sort( (a,b) => a > b ) //=> [ 5, 14, 16, 22, 25 ]
// and reverse:
array.sort( (a,b) => b - a ) //=> [ 25, 22, 16, 14, 5 ]
array.sort( (a,b) => b < a ) //=> [ 25, 22, 16, 14, 5 ]
```

Basically we have to inputs, `a` and `b`. When we return `a - b` or `a > b` we're telling our script to first return smaller values and then larger values, and vice-versa for `a < b` where we tell our script to first return larger values. Remember this trick because it will be used **everywhere**. Let's first try and sort our old string by string length instead of alphabetically. We'll do this by introducing `.sort_by` in Ruby, and just using our prior trick for JavaScript:

```ruby
# Ruby
array_string = ["hey", "everyone", "how's", "it", "going?"]
array_string.sort_by { |x| x.length } #=> ["it", "hey", "how's", "going?", "everyone"]
array_string.sort_by { |x| x.length }.reverse #=>  ["everyone", "going?", "how's", "hey", "it"]
```

For JavaScript, we'll use that trick from before but instead of comparing each element `a` to `b`, we'll compare their *lengths*:

```javascript
// JavaScript
var array_string = ["hey", "everyone", "how's", "it", "going?"]
array_string.sort( (a,b) => a.length - b.length ) //=> [ "it", "hey", "how's", "going?", "everyone" ]
array_string.sort( (a,b) => a.length > b.length ) //=> [ "it", "hey", "how's", "going?", "everyone" ]
array_string.sort( (a,b) => b.length - a.length ) //=> [ "everyone", "going?", "how's", "hey", "it" ]
array_string.sort( (a,b) => a.length < b.length ) //=> [ "everyone", "going?", "how's", "hey", "it" ]
```

This is for an array of elements or object, but what if we have an array of Ruby hashes also known in JS as Objects?

```ruby
# Ruby
array_hash = [ {borough: 'Manhattan', population: 1585874},
               {borough: 'Brooklyn', population: 2504706},
               {borough: 'Queens', population: 2230545},
               {borough: 'Bronx', population: 1385107},
               {borough: 'Staten_Island', population: 486730} ]

array_hash.sort_by { |x| x[:borough] }
#=> [{:borough=>"Bronx", :population=>1385107},
   # {:borough=>"Brooklyn", :population=>2504706},
   # {:borough=>"Manhattan", :population=>1585874},
   # {:borough=>"Queens", :population=>2230545},
   # {:borough=>"Staten_Island", :population=>486730}]

array_hash.sort_by { |x| x[:population] }
#=> [{:borough=>"Staten_Island", :population=>486730},
   # {:borough=>"Bronx",        :population=>1385107},
   # {:borough=>"Manhattan",    :population=>1585874},
   # {:borough=>"Queens",       :population=>2230545},
   # {:borough=>"Brooklyn",     :population=>2504706}]
```

We call on the attribute in ruby, however in JS we call it the exact same way as we would the length, but as the attribute!

```javascript
// JavaScript
var array_hash = [ {borough: 'Manhattan', population: 1585874},
                   {borough: 'Brooklyn', population: 2504706},
                   {borough: 'Queens', population: 2230545},
                   {borough: 'Bronx', population: 1385107},
                   {borough: 'Staten_Island', population: 486730} ]

array_hash.sort( (a,b) => a.borough > b.borough )
//=> [ { burough: 'Bronx', population: 1385107 },
    // { burough: 'Brooklyn', population: 2504706 },
    // { burough: 'Manhattan', population: 1585874 },
    // { burough: 'Queens', population: 2230545 },
    // { burough: 'Staten_Island', population: 486730 } ]

// By the length of the borough name
array_hash.sort((a,b) => a.borough.length - b.borough.length ) // or
array_hash.sort((a,b) => a.borough.length > b.borough.length )
//=> [ { borough: 'Bronx', population: 1385107 },
    // { borough: 'Queens', population: 2230545 },
    // { borough: 'Brooklyn', population: 2504706 },
    // { borough: 'Manhattan', population: 1585874 },
    // { borough: 'Staten_Island', population: 486730 } ]

array_hash.sort( (a,b) => a.population - b.population ) // or
array_hash.sort( (a,b) => a.population > b.population )
//=> [ { borough: 'Staten_Island',  population: 486730 },
    // { borough: 'Bronx',         population: 1385107 },
    // { borough: 'Queens',        population: 2230545 },
    // { borough: 'Brooklyn',      population: 2504706 },
    // { borough: 'Manhattan',     population: 1585874 } ]
```

Last up is fairly useless and therefore a but more tricky: sorting a Ruby hash/JS object by its values. This usually isn't *ever* done because a hash/object by nature isn't actually in an order like an array is, it's just **presented** to us visually in an order. In fact if you try to reorder a hash/object you won't get a hash/object back, you'll get an *array*.

```ruby
# Ruby
hash = {Manhattan: 1585874, Brooklyn: 2504706, Queens: 2230545, Bronx: 1385107, Staten_Island: 486730}

# by key
hash.sort # or
hash.sort_by { |key, value| key }
#=> [[:Bronx, 1385107], [:Brooklyn, 2504706], [:Manhattan, 1585874], [:Queens, 2230545], [:Staten_Island, 486730]]

# by value
hash.sort_by { |key, value| value }
#=> [[:Staten_Island, 486730], [:Bronx, 1385107], [:Manhattan, 1585874], [:Queens, 2230545], [:Brooklyn, 2504706]]
```

JavaScript can't actually directly do this using sort, only indirectly, in fact it will give you the error "hash.sort is not a function". So we have to use a trick called `Object.values()`, which I'll explain when we get to that section! For now I'll just show you what it looks like:

```javascript
// JavaScript
var object = {Manhattan: 1585874, Brooklyn: 2504706, Queens: 2230545, Bronx: 1385107, Staten_Island: 486730}
object.sort() //=> error, not a function

Object.keys(object).sort( (a,b) => object[a] - object[b] ).map(x => `${x}: ${hash[x]}`)
//=> [ 'Staten_Island: 486730',
    // 'Bronx:        1385107',
    // 'Manhattan:    1585874',
    // 'Queens:       2230545',
    // 'Brooklyn:     2504706' ]
```

In basic terms, we sort the values by descending order but we can only get an array of keys back, then we just map that key on itself to get the values.

# 14) Easier if/else/etc
### Ruby: `Case; each` | JS: `Switch; case`
---
The thing about `if/else/elsif/else if` statements is that they can get very repetitive, especially when going through multiple conditions. Say we're watching West Wing and want to get a main character's White House title. We *could* do a series of if statements:

```ruby
# Ruby
def title(name)
  if name == "CJ"; "Press Secretary"
  elsif name == "Donna"; "Assistant to the DCoS"
  elsif name == "Abbey"; "First Lady"
  elsif name == "Jed"; "President"
  elsif name == "Josh"; "Deputy Chief of Staff"
  elsif name == "Sam"; "Deputy Communications Director"
  elsif name == "Toby"; "Communications Director"
  end
end
```

```javascript
// JavaScript
function title(name) {
  if (name === "CJ") { return "Press Secretary" }
  else if (name === "Donna") { return "Assistant to the DCoS"}
  else if (name === "Abbey") { return "First Lady"}
  else if (name === "Jed") { return "President"}
  else if (name === "Josh") { return "Deputy Chief of Staff"}
  else if (name === "Sam") { return "Deputy Communications Director"}
  else if (name === "Toby") { return "Communications Director"}
}
```

If we call `title("CJ")` we'll get "Press Secretary", or `title("Jed")` we'll get "President" which is great! But in our code we have to call on `name ===` every. single. time. In addition to a few other things in the code, they're repetitive and constrictive, so instead we can use a `case statement` in Ruby or a `switch statement` in JS.

```ruby
# Ruby
def title(name)
  case name;
    when "CJ"; "Press Secretary"
    when "Donna"; "Assistant to the DCoS"
    when "Abbey"; "First Lady"
    when "Jed"; "President"
    when "Josh"; "Deputy Chief of Staff"
    when "Sam"; "Deputy Communications Director"
    when "Toby"; "Communications Director"
    else "Name Not Found"
  end
end
```

```javascript
// JavaScript
function title(name) {
  switch(name) {
    case "CJ": return "Press Secretary"
    case "Donna": return "Assistant to the DCoS"
    case "Abbey": return "First Lady"
    case "Jed": return "President"
    case "Josh": return "Deputy Chief of Staff"
    case "Sam": return "Deputy Communications Director"
    case "Toby": return "Communications Director"
    default: return "Name Not Found"
  }
}
```

**SO** much better! We can even link this to our `.map` method if we'd like to call on an array:

`names = ["Josh", "Jed", "Toby", "CJ", "Sam"]`

```ruby
# Ruby
names.map do |name|
  case name;
    when "CJ"; "Press Secretary"
    when "Donna"; "Assistant to the DCoS"
    when "Abbey"; "First Lady"
    when "Jed"; "President"
    when "Josh"; "Deputy Chief of Staff"
    when "Sam"; "Deputy Communications Director"
    when "Toby"; "Communications Director"
    else "Name Not Found"
  end
end
```

```javascript
// JavaScript
names.map(name => {
  switch(name) {
    case "CJ": return "Press Secretary"
    case "Donna": return "Assistant to the DCoS"
    case "Abbey": return "First Lady"
    case "Jed": return "President"
    case "Josh": return "Deputy Chief of Staff"
    case "Sam": return "Deputy Communications Director"
    case "Toby": return "Communications Director"
    default: return "Name Not Found"
  }
})
```

Both of these output:

`[ 'Deputy Chief of Staff', 'President',
  'Communications Director', 'Press Secretary',
  'Deputy Communications Director' ]`

Let's do one more example with an array of grades someone got on their tests:

`grades = [95, 83, 68, 102, 99, 75, 60]`

And we want to map those into basic letter grades, aka an A is 90-100, B is in the 80's, etc. Unfortunately JS doesn't have ranges like Ruby does, so it may only be *slightly* better than a series of if statements, but we can still make it work by simply testing to see which case is `true`:

```ruby
# Ruby
grades.map do |grade|
  case grade;
    when 90..100; "A"
    when 80..89; "B"
    when 70..79; "C"
    when 65..69; "D"
    when 0..64; "F"
    else "That grade is impossible!"
  end
end
```

```javascript
// JavaScript
grades.map(grade => {
  switch(true) {
    case grade > 100: return "That grade is impossible!"
    case grade >= 90: return "A"
    case grade >= 80: return "B"
    case grade >= 70: return "C"
    case grade >= 65: return "D"
    case grade >= 0: return "F"
    default: return "That grade is impossible!"
  }
})
```

Both of these output `["A", "B", "D", "That grade is impossible!", "A", "C", "F"]`, great!

# 15) Adding to / removing from arrays
### Ruby: `.insert` / `.delete_at` / `.slice!` /  | JS: `.splice`
---
It's easy to use `.unshift`/`.shift`/`.push`/`.pop` to add/remove items from the beginning/end of arrays respectively, but what about when we have to add/remove items at certain points *within* the array? Ruby uses `.insert` and `.delete_at`/`.slice!` to do these separately.

`.insert` takes in an index along with a value (or values) you'd like to add, while `.delete_at` takes in just an index:

```ruby
# Ruby
array = ["Hello", "World", "How", "Are", "You?"]

array.insert(2, "!") #=> ["Hello", "World", "!", "How", "Are", "You?"]

array.insert(1,"Everyone", "In", "The")
#=> ["Hello", "Everyone", "In", "The", "World", "!", "How", "Are", "You?"]

array.delete_at(5) #=> ["Hello", "Everyone", "In", "The", "World", "How", "Are", "You?"]
array.slice!(0) # array #=> ["Everyone", "In", "The", "World", "How", "Are", "You?"]
```
JS can do both of these with one method, `.splice`! Splice like `.insert` or `.delete_at` takes in an index, and while the rest are optional they change splice's behavior entirely. Splice's default behavior is to delete, and we need those extra values in there to instead insert. Here's how it looks:

`array.splice(index, how_many_positions_out_to_delete, add_element(s) )`

Since `.splice` is destructive (changes the array permanently), in these examples I'll be remaking the array quite a bit. Let's test it out bit by bit:

```javascript
// JavaScript
array = ["Hello", "World", "How", "Are", "You?"]

array.splice(2)
array //=> ["Hello", "World"]
```
If we just put in one value (the index), it will delete all elements starting at that index until the end of the array. It works the same as if we put in a second value:
```javascript
// JavaScript
array = ["Hello", "World", "How", "Are", "You?"]

array.splice(2, 100)
array //=> ["Hello", "World"]
```
In this case we're deleting all elements starting at index 2 and going 100 elements out, which covers the end of the array. Let's try deleting just a few at a time instead:
```javascript
// JavaScript
array = ["Hello", "World", "How", "Are", "You?"]

array.splice(2, 0)
array //=> ["Hello", "World", "How", "Are", "You?"]
// start at index 2, then delete 0 elements out (which is none!)

array.splice(2, 1) //=> ["How"] removed
array //=> ["Hello", "World", "Are", "You?"]
// start at index 2, then delete 1 element out (just 2)

array = ["Hello", "World", "How", "Are", "You?"]
array.splice(1, 3) //=> ["World", "How", "Are"] removed
array //=> ["Hello", "You?"]
// start at index 1, then delete 3 elements out (1-3)
```
Anything after these two numbers is **added** to the array, so let's mimic what we did in Ruby:
```javascript
// JavaScript
array = ["Hello", "World", "How", "Are", "You?"]

array.splice(2, 0, "!") //=> ["Hello", "World", "!", "How", "Are", "You?"]
// start at index 2, delete nothing, then add "!" at index 2

array.splice(1, 0, "Everyone", "In", "The")
//=> ["Hello", "Everyone", "In", "The", "World", "!", "How", "Are", "You?"]
// start at index 1, delete nothing, then add "Everyone", "In", and "The" at index 1

array.splice(4, 1, "Universe")
//=> ["Hello", "Everyone", "In", "The", "Universe", "!", "How", "Are", "You?"]
// start at index 4, delete 1 element out, then add "Universe" at index 4
```
# 16) Testing for Inclusion
### Ruby: `.include?` | JS: `.includes`
---
There's a great way to test for inclusion which can be utilized in many ways, and surprisingly JS is the one here that can do more! While Ruby's `.include?` can only test to see if something is included:

```ruby
# Ruby
array = [1, 2, 3, "hello", "world"]
array.include?(3) #=> true
array.include?("hello") #=> true
array.include?(7) #=> false
```

JS can do this, but in addition it can even test for inclusion at a specific index!

```javascript
// JavaScript
array = [1, 2, 3, "hello", "world"]
array.includes(3) //=> true
array.includes("hello") //=> true
array.includes(7) //=> false
array.includes("world", 4) //=> true
array.includes(1, 3) //=> false
```

# 17) Keys and Values
---
If you have a Hash in ruby you can simply call `.keys` or `.values` on it to easily get their information:

```ruby
# Ruby
pets = { dogs: 3, cats: 2, birds: 1 }
pets.keys #=> [:dogs, :cats, :birds]
pets.values #=> [3, 2, 1]
```

Under the hood, these methods are basically going through each element in the hash and pulling out the chosen value and putting them in an array. These shortcuts work a bit different in JS. First off, a **hash in Ruby** is known as an **object in JS**. So we'll have to call `.keys` or `.values` on a blank `Object` class and have it take in the Object pets:

```javascript
// JavaScript
Object.keys(pets) //=> ["dogs", "cats", "birds"]
Object.values(pets) //=> [3, 2, 1]
```

# 18) slice
---
Slice is a nice method that goes into an array (or string) and selects the element(s) of your choice. While in Ruby you can directly call on the array/string to get these values using `array[0]` for the first value, or in Ruby only doing more fancy `array[1..4]` to get

```ruby
# Ruby
array = ["Hello", "World", "How", "Are", "You?"]
array[0] #=> "Hello"
array[2..4] #=> ["How", "Are", "You?"]
array[2, 3] #=> ["How", "Are", "You?"]
```

Only the first script `array[0]` can be used in JS. This is where `.slice` comes in, however just like `.reduce` it's used differently. If you're familiar with Ruby, `.slice` is used exactly like the above scripts and has the same exact outputs:

```ruby
# Ruby
array = ["Hello", "World", "How", "Are", "You?"]
array.slice(0) # select at index 0
array.slice(2..4) # select from index 2 to index 4
array.slice(2, 3) # select from index 2 and go 3 positions further
```

JS operates differently however. Obviously we don't have ranges so the middle script is of no use to us, but what happens if we try the other two scripts?

```javascript
// JavaScript
array = ["Hello", "World", "How", "Are", "You?"]
array.slice(0) //=> ["Hello", "World", "How", "Are", "You?"]
array.slice(2, 3) //=> ["How"]
```

"How" is right... what is happening here? Well in both languages the slice takes in two instances:
`array.slice( start_index, optional_second_number ) `
The `start_here` is the same in both languages, however the `optional_second_number` is what's different.

Ruby says: `start_index`, `go_this_many_positions_further (default is 0)`
JS says: `start_index (default is 0)`, `end_index (default is array.length)`

Wait a second, `(start_index, end_index)`? that's a range! Specifically it's the three-dotted `(n1...n2)` range where we go **up until** the end index. So with that knowledge:

```javascript
// JavaScript
array = ["Hello", "World", "How", "Are", "You?"]

array.slice(0) // start at index 0, go to the default end of array.length
array.slice(0, array.length) // same
array.slice(0, 5) // same (array.length is 5, the last index in it is 4)
array.slice(2, 3) // start at index 2, go up until 3 (therefore only index 2)

array.slice() //=> ["Hello", "World", "How", "Are", "You?"]
array.slice(2) || array.slice(2,array.length) || array.slice(2, 5)
// all of them //=> ["How", "Are", "You?"]
array.slice(2, 4) //=> ["How", "Are"]
```

# 19) Callbacks
### Ruby: `.call` / `.proc` | JS: `callbacks`
---
Finally, what if we had a function inside of another function? Let's come back to that question shortly.

Say we were writing a function that did a few complicated things within it, but then wanted to easily change them or call on them again? For example, what if we wanted to multiply two numbers but have them squared first? We *could* do something like write it all out:

```ruby
# Ruby
def multiply_squared(x, y)
  x*x * y*y
end

multiply_squared(2, 3) #=> 2*2 * 3*3 = 4 * 9 = 36
```

```javascript
// JavaScript
function multiply_squared(x, y) { x*x * y*y }

multiply_squared(2, 3) //=> 2*2 * 3*3 = 4 * 9 = 36
```

Great, but what if instead of squaring these I wanted to cube them? What if I wanted to have `x` equal another equation? Sure for cubing I could simply change the equation to `2*2*2 * 3*3*3` but that'd get messy especially if I wanted to add another one to the exponent, or I could change the equation to `2**3 * 3**3` and just simply change the exponent that way, but that'd get tedious and I also wouldn't be able to call that as its own function. For `x` as another equation that'd also get ugly as for example `multiply_squared(2, (32/8) + 4)`. `.call` / `.proc` in Ruby and `callbacks` in JavaScript fix this.

In Ruby, we can first make a `Proc` which is a function that can be called on in the future. For example:

```ruby
# Ruby
say_hello = Proc.new { puts "hello" }
#=> <Proc:0x007fbf7019b270@(irb):41>

# we then can call on this Proc object

say_hello.call #=> "hello"

say_hello()
```
A proc is an object that has its own set of variables. If you know about classes, then the `<Proc:0x007fbf7019b270@(irb):41>` looks very similar:

```ruby
# Ruby
class Dog

  def initialize(name, breed)
    @name = name
    @breed = breed
  end

end

dog = Dog.new("Lily", "Pit Mix")
#=> <Dog:0x007fbf701290d0 @name="Lily", @breed="Pit Mix">
```

So what can we do with Procs? Here's an example of what a basic function, and then a proc function does:

```ruby
# Ruby
def multi_basic(x, y)
  x * y
end

multi_basic(2, 3) #=> 6

def multi_proc(x, y)
  Proc.new { x * y }
end

multi_proc(2, 3) #=> <Proc:0x007fbf701808d0@(irb):47>
multi_proc(2, 3).call #=> 6
```
Why is this so special? Our proc isn't simply the answer to `2*3`, it's an **object** that stores that answer, and we can call on it at any point or even do more with it. In the very simplest form we can create an object that simply can output the answer:

```ruby
# Ruby
multiply_5_6 = multi_proc(5, 6) #=> <Proc:0x007fbf7016adf0@(irb):48>
multiply_5_6.call #=> 30

say_hello_to_someone = Proc.new { |name| puts "Hello #{name}!" }
say_hello_to_someone #=> <Proc:0x007fb0d20b4ca0@(irb):49>
say_hello_to_someone.call("Mike") #=> "Hello Mike!"
```
OR, we can get to the real reason why calls and procs are great: the ability to create an open-ended proc function that can be completed with a call:

```ruby
# Ruby
def multiply(n)
    Proc.new { |x| x * n }
end

multiply_by_six = multiply(6)
multiply_by_six.call(5) #=> 30
multiply_by_six.call(10) #=> 60

multiply_by_thirty = multiply(30)
multiply_by_thirty.call(5) #=> 150
multiply_by_thirty.call(25) #=> 750
```
If we wrote these same scripts out as functions within a function it would get pretty messy. Going back to what we did before:
```ruby
# Ruby
def multiply_squared(x, y)
  x**2 * y**2
end

multiply_squared(multiply_by_six.call(2), 2) #=> 12*12 * 2*2 = 144 * 4 = 576

# instead with callbacks

multiply_six_squared = Proc.new { |x,y| multiply_by_six.call(x)**2 * y**2 }
multiply_six_squared.call(2, 2) #=> 576
```
We have our object to call on, and can change it any way we want. Why did I take a long time to go through what these do? Because this is one of those times where JavaScript makes things easier than Ruby and it's important to be able to visualize what goes on under the hood. Here's how a callback would work in JavaScript; see if you can see the similarities:

```javascript
// JavaScript
var say_hello = function() { console.log("Hello") }
say_hello() //=> "Hello"

// The same in ES6 notation:

var say_hello = () => { console.log("Hello") }
say_hello() //=> "Hello"

// as a callback:

var say_hello_callback = function(callback) { callback }
say_hello_callback(console.log("Hello")) //=> "Hello"

// ES6
var say_hello_callback = callback => { callback }
say_hello_callback(console.log("Hello")) //=> "Hello"

// extract "hello" as another callback

function hello() { return "Hello" }
say_hello_callback(console.log( hello() )) //=> "Hello"
```

As you can see, JavaScript handles our "proc" by just naming a function. Let's callback even further:

```javascript
// JavaScript
var say_hello_to_someone = function(name) { console.log(`Hello ${name}!`) }
say_hello_to_someone("Mike") //=> "Hello Mike!"

//ES6:
var say_hello_to_someone = name => { console.log(`Hello ${name}!`) }
say_hello_to_someone("Mike") //=> "Hello Mike!"

// extract "hello" again

function hello() { return "Hello" }
var say_hello_to_someone = name => { console.log(`${hello()} ${name}!`) }
say_hello_to_someone("Mike") //=> "Hello Mike!"

// and name

function hello() { return "Hello" }
function name() { return "Mike" }
var say_hello_to_someone = () => { console.log(`${hello()} ${name()}!`) }
say_hello_to_someone() //=> "Hello Mike!"

// with a callback

var say_hello_to_someone_callback = (callback) => { callback }
say_hello_to_someone_callback(console.log(`${hello()} ${name()}!`))

// double callback!

function greeting() { return "Hello" }
function name() { return "Mike" }
function log() { console.log(`${hello()} ${name()}!`) }
var say_hello_to_someone_callback_callback(callback_2) = (callback) => { callback }
say_hello_to_someone_callback_callback(log()) //=> "Hello Mike!"

// another way with multiple inputs

var say_hello_to_someone_input = (greeting, name) => { console.log(`${greeting} ${name}!`) }
say_hello_to_someone_input("Hello", "Mike") //=> "Hello Mike!"
say_hello_to_someone_input(greeting(), name()) //=> "Hello Mike!"
```
We can even call our function and do things before we callback:

```javascript
// JavaScript
var lastly_say_hello_callback = callback => {
  console.log("Loading greeting...")
  callback
}
lastly_say_hello_callback(console.log("Hello"))
//=> "Hello"
//=> "Loading greeting..."
```

Oops our greeting callback loaded before our loading message because this is asynchronous. Let's add a `timeout` to our callback:

```javascript
// JavaScript
var lastly_say_hello_callback = callback => {
  console.log("Loading greeting...")
  setTimeout(callback, 1000)
}
lastly_say_hello_callback(()=>console.log("Hello"))
//=> "Loading greeting..."
// sleep for 1 second
//=> "Hello"
```

And to be really cheeky, let's have some callbacks that also take in inputs:

```javascript
// JavaScript
function log(greeting, name) { console.log(`${greeting} ${name}!`) }
function say_hello_to_someone_callback_inputs(callback) { callback(arguments[1], arguments[2]) }
say_hello_to_someone_callback_inputs(log, "Hello", "Mike")
```

There's so much more you can do with this, try it out yourselves!

---

So that covers some of the most important JS loops/iterations/methods. If there are any others you'd like added let me know!

Code on.

Mike Merin
