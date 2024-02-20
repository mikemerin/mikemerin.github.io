---
layout: post
title: "Python Through Ruby-Colored Glasses"
subtitle: "A Python Cheat Sheet"
date: 2017-08-25 19:53:26 -0400
tags: Python, Ruby
series: Ruby Dev Learns Other Langauges
summary: Replicate Ruby shortcuts, iterations, and methods in Python
---

If you learned how to program in Ruby, you probably noticed there's a large amount of shortcuts available to cut down on typing (while helping keep your code clean), as well as having a straightforward "English-like" syntax. While JS has similar but more labor-intensive similarities, the syntax for Python is a little more abstract (at least at first). The lack of Ruby-like shortcuts in Python are very noticeable, and if like me you learned Ruby first you may not have known what those shortcuts actually do under the hood, so let's dive right in and compare how Ruby and Python handle these shortcuts, iterations, and methods.

**I'll be going into a lot of detail in this post, if you want an abbreviated Python-only cheat sheet you can find that [here](https://mikemerin.github.io/Python-Cheat-Sheet/), though I would recommend going through this post if you want a better understanding of how everything works.**

I'll assume you know how to iterate in Ruby already, but if not then look at my [first cryptography post](https://mikemerin.github.io/cryptography/) for a detailed explanation.

We'll be going over these loops, iterations, and global methods:

|| Ruby | Python Equivalent | Description
---|---|---|---
**data type names**
|| Array | List | [ 1, 2, 3, 4 ]
|| Hash | Dictionary | { 1: "one", 2: "two", 3: "three" }
| - | Tuple | (1, 2, 3) (immutable)
| - | Set | { 1, 2, 3 } (immutable)
**interpolation and structure**
|| `"#{obj}"` | `"{}".format(obj)` / `"%s" % obj` | inserting objects into a string
|| do / end | : / space | formatting to open and close methods
**functions**
|| `n.to_s` | `str(n)` | converts to string
|| `"10".to_i` | `int("10")` | converts to Integer 10
|| `"10".to_f` | `float("10")` | converts to Float 10.0
|| x.length | len(x) | length of an object (str, list, etc.)
|| (1...5).to_a | range(1,5) | creates a ranged array (different)
|| push / `<<` | append | add onto the end of an array
|| pop(x) | pop(x) | remove from the end of the array (different)
|| unshift | a = [x] + a | add onto the beginning of an array
|| shift(x) | pop(0) | remove from the beginning of the array
|| .include? | in | find if something is included
**loops**
|| while / until | while | loops while condition is true
**iteration**
|| for | for | iterate over each element, more used in Python
|| .map | for..in | in-line iteration
|| .each.with_index | for & enumerate | same, but also get the index
|| .keys | for..in | get all keys in a hash
|| .values | for..in | get all values in a hash
**callback-esque functions**
|| .map | map | iterate over each element, changes the output
|| lambda | lambda | function called within a function
|| .map.with_index | map & enumerate | map, but also get the index
|| .reduce / .inject | reduce() | combines all elements via an operation
|| .select | filter | remove `nil` or `None` values from an array
|| .compact | filter | remove `nil` or `None` values from an array
**selecting methods**
|| .slice | a[l:h:s] | select element(s) from array
|| .dup | a[:] | duplicates an object rather than copies
**manipulating methods**
|| .sort / .sort_by | sorted(a, opt_arg) | sort an array or hash/Object
|| case; each | if/elif or dict | shorthand multiple `if` statements
|| .insert | .insert(idx, elem) | add element(s) from array/string
|| .delete_at | del a[idx:idx2] | remove element(s) from array/string
|| .delete(e) | .remove(e) | remove element(s) by element
**extra functions**
|| call/proc | N/A: inherent | function called within a function

# 1) Names of data types
---
Before we begin we'll need to just cover some basic terminology to avoid confusion when talking about Ruby vs. Python. There are a few data types that are the same in both Ruby and Python but have different names:

Ruby | Python
array = list = [1, 2, 3]
hash = dictionary = { 1: "one", 2: "two", 3: "three" }

In addition Python has a few immutable data types:

tuple = (1, 2, 3)
set = { 1, 2, 3 }

While tuples are used in Ruby they don't really have a name. It's basically used when taking in arguments such as `Time.local(2017, 8, 25)`. In Python that would be called a tuple but it's just arguments in Ruby. In order to use sets in Ruby you must `require 'set'` before you can `Set.new [1, 2, 3]`, and even then sets aren't commonly used in Ruby. More explanations of tuples and sets will be for another time, but when we reference things in Python arrays are lists and hashes are dictionaries.

# 2) String Interpolation
---
Ruby and Javascript's only difference when it comes to string interpolation is a pound `#` sign vs. a dollar `$` sign respectively. While Python's quite different and a bit more complex, it lets you do **much** more customization. Here's what I mean, in Ruby you can do something like this:

```ruby
# Ruby
animal = "dog"
name = "Lily"
age = 8

puts "#{name}, the #{age} year old #{animal}."
#=> "Lily, the 8 year old dog."
```

As you can see, whenever you want to interpolate something in your string, if you have double quotes `""` you can wrap your object in `#{this}` to get it working. There are two ways to do this in Python. The first uses `.format`:

```python
# Python
animal = "dog"
name = "Lily"
age = 8

print("{}, the {} year old {}").format(name, age, animal)
#=> "Lily, the 8 year old dog."
```

While using curly brackets are similar, what Python does is go through the string and any time it finds a placeholder `{}` it goes through an argument to format the string accordingly. If we wanted to, we can put numbers in our `{}` brackets to choose which argument to format our strings in, and this will also let us repeatedly use an argument without having to put it into the tuple over and over again.

```python
# Python
animal = "dog"
name = "Lily"
age = 8

print("My {2} {0} is {1} years old. {0} is a very sweet {2}.").format(name, age, animal)
#=> My dog Lily is 8 years old. Lily is a very sweet dog.
```

You can see how this can be useful in very long sentences. There's MUCH more you can do as well, but I'll just cover two quick things:

```python
# Python
animal = "dog"
name = "Lily"
age = 8

print("My {2} {0} is {1:d} years old. {0} is a very {desc} {2}.").format(name, age, animal, desc="silly")
#=> My dog Lily is 8 years old. Lily is a very silly dog.
```

I did two things here: the `{1:d}` denotes that argument as an integer, and the `{desc}` searches for which argument has the name of "desc". Again there's MUCH more we can do but we'll talk about them in another post. For now, while the placeholder `{}` works alright we can do things another way as well that's built off the data types:

```python
# Python
animal = "dog"
name = "Lily"
age = 8

print "%s, the %d year old %s" % (name, age, animal)
#=> "Lily, the 8 year old dog."
```

What Python does is go through the string, and if you put a `%` after the string it will go through the string searching for `%` and match them up to the argument(s) you put after it, matching each argument in order that it appears. You'll also notice I use both `%s` and `%d`, which is for string and integer respectively (I believe the d stands for digit). I can technically use `%s` for all of them since they'll all end up as a string.

Here's some of the ways you can choose to interpolate:

```python
# Python
%s # string, or any type of object that can interpolate as a string instead
%d # integer / digit
 print("%d") % 60 #=> 60
%f # float
 print("%f") % 60 #=> 60.000000
%.<number>f # float out to x digits
 print("%.9f") % 60 #=> 60.000000000
%e # float formatted to exponential
 print("%e") % 60 #=> 6.000000e+01
%g # ingeter formatted to exponential if more than 4 zeroes
 print("%g") % 60 #=> 60
 print("%g") % 600000000 #=> 60e+08
%x # number formatted to hexadecimal
 print("%x") % 60 #=> 3c
%o # number formatted to octal
 print("%o") % 60 #=> 74
```

Please note that ALL of the above also works with the `{}` format from before, aka `print("{0:.5g}").format(1384356)` would output `1.3844e+06`.

Last up is breaking out of an interpolation. In Ruby if you wanted to use the same type of quote you'd use a slash `\` to break out of the string, aka `"He said \"wow\" that's useful."` and it wouldn't break. In Python you'd simply put a double `%` to put in a percentage sign without breaking the string. For example if I wanted to say "The tank is 50% full" I'd do:

```python
print("The tank is %d%% full.") % 50
#=>  The tank is 50% full.
```

# 3) Structure
---
One of the biggest, and possibly my favorite parts so far about Python is the way the language is structured. In Ruby you need to use `end` after you `do` something or declare something, however you won't see `end` when looking at Python scripts. Why? Python uses whitespace to structure scripts which makes it arguably much easier to read. If you're doing something inside a function, if you end a line with a colon `:`, just add some whitespace on the next line and Python will know you're inside it. Once you return to the left-most side Python will know you're moving on. Here's what I mean:

```ruby
# Ruby
x = 5
y = 10
if x < y
  puts "x is smaller than y"
  puts "#{y} - #{x} = #{y-x}"
else
  puts "x is larger than y"
  puts "#{x} - #{y} = #{x-y}"
end
```

```python
# Python
x = 5
y = 10
if x < y:
  print "x is smaller than y"
  print "{} - {} = {}".format(y, x, y-x)
else:
  print "x is larger than y"
  print "{} - {} = {}".format(x, y, x-y)
```

So there are two things that are different here: the colon after `x < 10` and `else`, and there's no `end`. It doesn't look like much here, but when our programs grow and we have more and more functions or objects then Python looks much, much neater. As far as working towards one liners, Ruby basically simply uses semi-colons `;`, and Python uses those same colons `:` to declare and then and semi-colons `;` to use our scripts:

```ruby
# Ruby
x = 5
y = 10
if x < y; puts "small"; else puts "large" end
# or
puts (if x < y; "small"; else "large" end)
# or the ternary
puts (x < y ? "small" : "large")
```

```python
# Python
x = 5
y = 10
# mainly use this first example when writing code
print ("small" if x < y else "large")
# or a pseudo ternary (not used as much)
print( ("large", "small") [x < y] )
#=> aka print( ("F", "T")[True])
# or the more explicit using a dictionary (however it evaluates both)
print ( {False: "large", True: "small"} [x<y] )
```

Let's take a look at some Object Oriented programming to see what we mean. Don't worry if this is confusing, we're merely taking a look at how the scripts are structured:

```ruby
# Ruby
class Animal

  attr_accessor :animal_type, :name, :age

  def initialize(animal_type, name, age)
    @animal_type = animal_type
    @name = name
    @age = age
  end

  def info
    puts "#{name}, the #{age} year old #{animal_type}"
  end

end

class Car

  attr_accessor :name, :age

  def initialize(make, model, year)
    @make = make
    @model = model
    @year = year
  end

  def info
    puts "The car is a #{year} #{make} #{model}"
  end

end
```

Now we have two classes, and can make a new animal by typing in `my_pet = Animal.new("dog", "Lily", 8)`. Here's how the same thing looks in Python:

```python
# python
class Animal:
  def __init__(self, animal_type, name, age):
    self.animal_type = animal_type
    self.name = name
    self.age = age
  def info(self):
    print "%s, the %d year old %s" % (self.name, self.age, self.animal_type)

class Car
  def __init__(self, make, model, year):
    self.make = make
    self.model = model
    self.year = year
  def info(self):
    print "The car is a %d %s %s" % (self.year, self.make, self.model)
```

The use of indenting the whitespace is very neat and makes the code much more readable. You can clearly see the cascade of where one part starts and the next continues. It's very much like a bulleted list. You can make a new animal by typing in `my_pet = Animal("dog", "Lily", 8)`.


# 4) Functions to change data types
---
Ruby has quite a few types of `.to_something` that can change the data types. This section will be short and sweet as it's fairly direct:

Converting to strings:

```ruby
# Ruby
150.to_s #=> "150"
```
```python
# Python
str(150) #=> "150"
```

Converting to an integer:

```ruby
# Ruby
"10".to_i #=> 10
```
```python
# Python
int("10") #=> 10
```

Converting to a float:

```ruby
# Ruby
"10".to_f #=> 10.0
10.to_f #=> 10.0
```
```python
# Python
float("10") #=> 10.0
float(10) #=> 10.0
```

# 5) Length of an object
---
You've probably noticed by now that Ruby has a lot more emphasis on calling functions on an object via `object.do_something` versus Python calling objects inside a function via `do_something(object)`. This is the same for for the length function (also can be done as `Size` in Ruby):

```ruby
# Ruby
[1, 2, 3, 4].size #=> 4
[1, 2, 3, 4].length #=> 4
"testing out a string".size #=> 20
"testing out a string".length #=> 20
```
```python
# Python
len([1, 2, 3, 4]) #=> 4
len("testing out a string") #=> 20
```

# 6) Ranges
---
Ranges are very important and thankfully both Ruby and Python have easy ways to create them. They work differently in each language, and even though Ruby's more versatile in what it can do, it's incredibly important to know how to use it in both languages.

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

Onto Python. The `range` method takes in 1-3 arguments. If you put in one number it'll go from 0 *up until* that number just like Ruby's three period `...` operator. If you put in two numbers it'll go from the first number *up until* the second number in the same fashion. If you put in a **third** number that'll be the step.

```python
# Python
range(4) #=> [0, 1, 2, 3]
range(1, 5) #=> [1, 2, 3, 4]
range(1, 10, 3) #=> [1, 4, 7] (notice 10's not there, again it's 1 up until 10, not including)
range(-5, 0) #=> [-5, -4, -3, -2, -1]
```

Here's something nifty though that Python can only do: reverse steps. Just negate the step and you're good to go.

```python
# Python
range(0, -5, -1) #=> [0, -1, -2, -3, -4]
range(1, -10, -3) #=> [1, -2, -5, -8]
range(100, 20, -18) #=> [100, 82, 64, 46, 28]
```

While not native to Python, there's a way to do floats by importing `numpy`. This will let us use `arange`:

```python
# Python
import numpy
numpy.arange(1.0, 2.0, 0.1)
#=> array([1., 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9])
```

There are some problems with this though as if you type a[3] for example you'll get `1.3000000000000003`. Obviously you'd want to round these values which you can do by:

```python
# Python
print "%.1f" % a[3] #=> 1.3
```

There's a way to map over each element in this array, but we'll get to that later as well. Alternatively we can use numpy's `linspace` to list how many elements appear in a range as well as control the endpoints manually:

```python
import numpy
numpy.linspace(1, 2, 11)
#=> array([1., 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9])
numpy.linspace(1, 2, 10)
#=> array([ 1., 1.11111111, 1.22222222, 1.33333333, 1.44444444, 1.55555556, 1.66666667, 1.77777778, 1.88888889, 2.])
# fixed with this:
numpy.linspace(1, 2, 10, endpoint=False)
#=> array([ 1. ,  1.1,  1.2,  1.3,  1.4,  1.5,  1.6,  1.7,  1.8,  1.9])
```

It's not perfect, and you may have to use the `%.1f` trick to make sure it works, but these are some good tricks for working with floats if you need it.

# 7) Push/Append/Pop/Shift/Unshift
---
While Ruby and JS have the same push/pop/unshift/shift methods for modifying arrays, only Python's `.append` is the exact same as `.push`. Let's quickly go through them and how we can both directly and indirectly handle the same types of functions.

#### Ruby: push / `<<` | Python: append

Ruby's `push` or shovel `<<` operator works the same as Python's `append`, which adds element(s) onto the end of an array.

```ruby
# Ruby
array = [1, 2, 3, 4]
array.push(5) #=> [1, 2, 3, 4, 5]
array.push(6, 7) #=> [1, 2, 3, 4, 5, 6, 7]
array << 8 #=> [1, 2, 3, 4, 5, 6, 7, 8]
```

Unlike `push` though, Python's `append` is much more limited and works more like the shovel operator which can only handle a single argument.

```python
# Python
array = [1, 2, 3, 4]
array.append(5) #=> [1, 2, 3, 4, 5]
array = array + [6, 7] #=> [1, 2, 3, 4, 5, 6, 7]
```

#### Ruby: unshift | Python: a = [x] + a

There's no direct `unshift` in Python, so we have to manually add it together:

```ruby
# Ruby
array = [1, 2, 3, 4]
array.unshift(0) #=> [0, 1, 2, 3, 4]
array.unshift(-2, -1) #=> [-2, -1, 0, 1, 2, 3, 4]
```

```python
# Python
array = [1, 2, 3, 4]
array = [0] + array  #=> [0, 1, 2, 3, 4]
array = [-2, -1] + array #=> [-2, -1, 0, 1, 2, 3, 4]
```

#### Ruby: pop/shift | Python: pop

While Python doesn't have `shift`, it's `pop` method does both jobs here. Why? Pop works differently in Python than it does in Ruby. In both languages, these functions return the removed item(s), not the changed array. But how they remove them is what makes the difference.

In Ruby, both shift and pop can either be called without taking in a number and it'll remove the first or last element respectively.

Here's where the difference lies: in Ruby if you have it take in an argument it will remove x elements from the beginning or the end.

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

In Python, if you take in an element it will remove the element at the **index** put in. That means to imitate `shift` we'll simply say "pop at index 0"

```python
# Python
array = ["one", "two", "three", "four", "five", "six", "seven", "eight"]
array.pop() #=> "eight"
array #=> ["one", "two", "three", "four", "five", "six", "seven"]
array.pop(2) #=> "three"
array #=> ["one", "two", "four", "five", "six", "seven"]

array.pop(0) #=> "one"
array #=> ["two", "four", "five", "six", "seven"]
```

However this operation is very slow when talking about Big O notation as operationally it's going through each bit of memory to shift the elements down by one. Instead we can create a new array from index 1 until the end:

```python
# Python
array = [1, 2, 3, 4, 5]
array = array[1:]
array #=> [2, 3, 4, 5]
```

# 8) Testing for inclusion
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

# 9) Looping
### While / until
---

Onto loops! Let's start off with the easiest example of the while loop.

```ruby
# Ruby
array = []
x = 1
while x < 6
  array.push(x)
  x += 1
end
array #=> [1, 2, 3, 4, 5]
```

```python
# Python
array = []
x = 1
while x < 6:
  array.append(x)
  x += 1

array #=> [1, 2, 3, 4, 5]
```

Let's do a side-by-side:

Ruby | Python | Difference
---|---|---
array = [] | array = [] | N/A
x = 1 | x = 1 | N/A
while x < 6 | while x < 6: | Python needs a colon `:` to go to the next line
array.push(x) | array.append(x) | push is append and the lines needs to be indented
x += 1 | x += 1 | same (but indented)
end |  | only Ruby needs `end`, Python just needs to be unindented
array | array | both #=> [1, 2, 3, 4, 5]

They're almost identical, but Python needs the colon `:` to say we're going to use the lines under the original one, and then those lines need to be indented. Once the lines unindent Python knows that we're done working with the original line. However there are some tricks to doing one line solutions (helpful if combining with other complex scripts):
```ruby
# Ruby
array = []
x = 1
while x < 6; array.push(x); x += 1 end
array #=> [1, 2, 3, 4, 5]
```
```python
# Python
array = []
x = 1
while x < 6: a.append(x); x += 1
array #=> [1, 2, 3, 4, 5]
```

While in this case our Python script looks a bit cleaner, this is by no means the cleanest way to do this type of operation. There are quite a few ways to shorten this, including a trick using `.reduce` (also known as `.inject` in Ruby only), but I'll cover that later on.

# 10) Iterating with `for..in`
---
While `for` isn't used much in Ruby (since `while`, `until`, or other iterations can do much more, are cleaner, and get the job done easier), it's very important in Python. We can use the `range` trick we learned before to make a cleaner 1-5 array, or modify it.

```ruby
# Ruby
array = []
array2 = []
for x in 1..5
  array.push(x)
  array2.push(x * x)
end
array #=> [1, 2, 3, 4, 5]
array2 #=> [1, 4, 9, 16, 25]
```

```python
# Python
range(1,6) #=> [1, 2, 3, 4, 5]
array = []
array2 = []
for x in range(1,6):
  array.append(x)
  array2.append(x * x)

array #=> [1, 2, 3, 4, 5]
array2 #=> [1, 4, 9, 16, 25]
```

And of course doing it one lined:

```ruby
# Ruby
array = []
array2 = []

for x in 1..5; array.push(x); array2.push(x * x) end

array #=> [1, 2, 3, 4, 5]
array2 #=> [1, 4, 9, 16, 25]
```

```python
# Python
range(1,6) #=> [1, 2, 3, 4, 5]
array = []
array2 = []

for x in range(1,6): array.append(x); array2.append(x * x)

array #=> [1, 2, 3, 4, 5]
array2 #=> [1, 4, 9, 16, 25]
```

You can also use `for` with existing arrays:

```ruby
# Ruby
array2 = [1, 4, 9, 16, 25]
array3 = []
for x in array2
  array3.unshift(x)
end
array3 #=> [25, 16, 9, 4, 1]
```

Python though can do one more thing: work on strings without having to split it into an array of strings:

```python
# Python
array2 = [1, 4, 9, 16, 25]
array3 = []
for x in array2:
  array3 = [x] + array3

array3 #=> [25, 16, 9, 4, 1]

s = "hey all"
s2 = ""
for l in s:
  s2 += "|" + s2

s2 #=> "|h|e|y| |a|l|l"
```

`for..in` is useful, but we're sandwiching in our script between creating an empty array, pushing/appending to it, and then displaying it. It's better practice to do it all at once. Ruby can use `.map` to help, and we'll get to mapping in Python later, but for we'll simply surround our `for..in` script inside of hard brackets to create our array in one line. After all `for` in Python is technically more useful and better practice overall, an Python mapping is more of a callback. Anyways here's how our one line function works works:

```ruby
# Ruby
(1..5).map { |x| x*x } #=> [1, 4, 9, 16, 25]
```

```python
# Python
[x*x for x in range(1,6)] #=> [1, 4, 9, 16, 25]
```

We can also use this trick when using hashes/dictionaries to obtain its keys or values. Ruby has an easy shortcut to do this by calling `.keys` and `.values` respectively, but a little `for..in` trick works just as well:

```ruby
# Ruby
hash = {1=>"one", 2=>"two", 3=>"three"}
hash.keys #=> [1, 2, 3]
hash.values #=> ["one", "two", "three"]
```

```python
# Python
d = {1: "one", 2: "two", 3: "three"}

[key for key in d] #=> [1, 2, 3]
[d[key] for key in d] #=> ["one", "two", "three"]
```

Note that I just named `key` in there to make things clearer but the value can be anything you want. `[x for x in d]` works just as well. Of course we can also get the index by using enumerate just like before:

```python
# Python
[x*i for i, x in enumerate(range(1,6))] #=> [0, 2, 6, 12, 20]
```

# 11) Getting the index
### Ruby: `.each_with_index` | Python: `enumerate`
---

Iterating with `for` is okay but sometimes we want to use the index along with the element. Ruby has the easy to use methods `.each_with_index` or `each.with_index` that lets you simply grab both in a block. Python's not too far off though you need to use `enumerate` in order to do it. It's a little less intuitive but it works nonetheless:

```ruby
# Ruby
array = ["a","b","c","d","e"]
array.each_with_index do |x, i|
 puts "#{x} is at index #{i}"
end

''' result:
a is at index 0
b is at index 1
c is at index 2
d is at index 3
e is at index 4
'''
```

each with index equivalent
```python
# Python
array = ["a","b","c","d","e"]
for i, x in enumerate(array):
 print x + " is at index " + str(i)

''' result:
a is at index 0
b is at index 1
c is at index 2
d is at index 3
e is at index 4
'''
```

And last up can use the index in math:

```ruby
# Ruby
array = []
(1..5).each_with_index { |x, i| array << x*i }
array #=> [0, 2, 6, 12, 20]
```

```python
# Python
array = []
for i, x in enumerate(range(1,6)): array.append(i*x)
array #=> [0, 2, 6, 12, 20]
```

# 12) Iterating and manipulating
### Ruby: `.map`, Python: `map()`
---
In Ruby `.each` is incredibly useful, and does what both `for` and `for..in` does in Python, or what `.forEach` does in JavaScript. They're all great but there's a problem: what if we want to return a new array without having to perform the arduous task of creating a blank array and then appending it to that array, then having to set it up again each time? We saw in the Ruby example just above how map goes a step farther in modifying the output of what you put in. Let's do the same thing we did before in Python, but this time use map as well. You'll see why it's different:

```ruby
# Ruby
(1..5).map { |x| x*x } #=> [1, 4, 9, 16, 25]
```

```python
# Python
# from before
[x*x for x in range(1,6)] #=> [1, 4, 9, 16, 25]

# Here's a basic function
def square(x): return x*x
def double(x): return x*2

# calling that function with one element
square(5) #=> 25
double(5) #=> 10

array = [1,2,3,4,5]

# using map to call that function over every element in an array
map(square, array) #=> [1, 4, 9, 16, 25]
map(double, array) #=> [2, 4, 6, 8, 10]
```

As you can see, `map` in Python acts more like a callback rather than Ruby calling a script within a block. What would this look like in Ruby? Something like:

```ruby
# Ruby
def square(x)
  x*x
end

def double(x)
  x*2
end

(1..5).map { |x| square(x) } #=> [1, 4, 9, 16, 25]
(1..5).map { |x| double(x) } #=> [2, 4, 6, 8, 10]
```

I'll get more into what an actual callback is in a second, but in Python `map` first takes in a function and then an array to iterate over. This is great, and is highly interchangeable as we can replace the function or the array at will, just like in the last Ruby example above. However what if we wanted to map just like the first part in the block?

# 13) Creating functions with lambda
---

If you try to do something like Ruby's `(1..5).map { |x| x*x }` that has a function in the block, you'll get an error:

```python
# Python
map(x*x, array)
#=> Traceback (most recent call last):
#=> File "<stdin>", line 1, in <module>
#=> TypeError: 'int' object is not callable

# or getting that |x| from Ruby
map(x*x for x, array)
#=> File "<stdin>", line 1
#=>   map(x*x for x, array)
#=>                       ^
#=> SyntaxError: invalid syntax
```

You can't simply port in `for` to mimick Ruby's `|x|` otherwise it'll break. In comes lambda which allows you to define the letter or word to make into a function. We'll cover calls and procs at the end of the post, but lambda is much simpler on its own, and the only major difference in Ruby vs. Python's use of it is its syntax. Here's what lambda looks like in Ruby:

```ruby
# Ruby
# lambda has a block that stores a function "puts polo"
marco = lambda { puts "polo" }
# marco is now an object that has the stored function
marco #=> #<Proc:0x007fb8ed169150@(irb):358 (lambda)>
# you can call the function by putting .call
marco.call #=> puts "polo"

# you can also have it take in an argument
function = lambda { |x| puts x }
function.call("hey") #=> puts "hey"

# it can be called multiple ways
square = lambda { |x| x*x }
square.call(5) #=> 25
square.(5) #=> 25
square[5] #=> 25

# or take in multiple arguments
exponential = lambda { |x, y| x**y }
exponential.call(3, 4) #=> 81
```

In Python, here's the most direct comparison for what lambda does.

```python
# Python
def normal(x): return x*x
normal(5) #=> 25

lam = lambda x: x*x
lam(5) #=> 25
```

lambda is very similar to what's in Ruby's block. The `|x|` is instead a `x:`, and after that is the function, all without needing to be wrapped in curly brackets. Here are what the Ruby examples from before look like in Python:

```python
# Python
marco = lambda: "polo"
marco #=> <function <lambda> at 0x10221d668>
marco() #=> "polo"

square = lambda x: x*x
square(5) #=> 25

function = lambda x: x
function("hey") #=> "hey"

exponential = lambda x, y: x**y
exponential(3, 4) #=> 81
```

Now that we know how to use lambda, let's bring it full circle and use it in our `map` function. Here's the before and after, and some more fancy things you can do:

```python
# Python

# before with functions:
array = [1,2,3,4,5]
def square(x): return x*x

map(square, array) #=> [1, 4, 9, 16, 25]

# after with lambda:

array = [1,2,3,4,5]
map(lambda x: x**, array) #=> [1, 4, 9, 16, 25]

# and more you can do:

array_a = [1,2,3,4,5]
array_b = [2,4,6,8,10]

# doesn't alter the original array
map(lambda x: x*2, array_a) #=> [2, 4, 6, 8, 10]
map(lambda x: x+5, array_a) #=> [6, 7, 8, 9, 10]

# handles multiple arrays if they're the same length, acting on the same index
map(lambda x, y: [x,y], a, b)
#=> [[1, 2], [2, 4], [3, 6], [4, 8], [5, 10]]

map(lambda x, y: x*y, array_a, array_b)
#=> [2, 8, 18, 32, 50]
```

# 14) Getting the index with map
### Ruby: `.map.with_index` | Python: `map() & enumerate`

Just like before when using `.each` in Ruby, it's very simple to get the index. Here's the difference between `.each`, it's `with_index` and `.map` and its `with_index`:

```ruby
# Ruby
array = [1, 2, 3, 4, 5]
array.each { |x| x*x }
#=> [1, 2, 3, 4, 5] (output not changed)
array.each.with_index { |x, i| x*i }
#=> [1, 2, 3, 4, 5] (output not changed)

array.map { |x| x*x }
#=> [1, 4, 9, 16, 25] (output is changed)
array.map.with_index { |x, i| x*i }
#=> [0, 2, 6, 12, 20] (output is changed)
```

That's it, easy enough, just change `each` to `map` and the functions are changed, and add `.with_index` and you can get their index by calling it in the block. Python is another story as we're going from `for..in` instead of the similar `.each` and we need to use `enumerate` in order to get the index. Here's the difference between those in Python:

```python
# Python
array = [1, 2, 3, 4, 5]

for x in array: x*x
#=> [1, 4, 9, 16, 25]
for i, x in enumerate(array): x*i
#=> [0, 2, 6, 12, 20]

# or

[x*x for x in array]
#=> [1, 4, 9, 16, 25]
[x*i for i, x in enumerate(array)]
#=> [0, 2, 6, 12, 20]

map(lambda x: x*x, array)
#=> [1, 4, 9, 16, 25]
map(lambda (i, x): x*i, enumerate(array))
#=> [0, 2, 6, 12, 20]
```

Now this is a little bit of a false equivalency going from Ruby to Python as each isn't exactly the same as `for..in` since the output does in fact change. The key here though is to see how useful `enumerate` can be in obtaining an array's index. Also as you noticed we're still using lambda in our scripts. That'll be a common theme so keep it in mind.

# 15) Manipulating arrays with `reduce`
---
Now let's go over what `reduce` does (also known as `.inject` in Ruby) and add up all values in the array, starting with the shortcut then expanding out to see what's under the hood. Note that all of these will produce the correct answer of 15:

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

In Python however, we don't have the basic shortcut available to us, so instead we have to write it out, albeit a little bit. Let's look at the following four Ruby scripts in order to understand their JS counterparts. They all do the same thing, and Python sort of has something to do with all of them. Let's go through them and build up our `.reduce` statement:

#### 1. reduce takes place inside a single parenthesis

```ruby
# Ruby
array.reduce(:+)
```
```python
# Python
reduce("sum script", array)
```
#### 2. you can set a default value (Python will be in the 3rd position, not the 1st)
```ruby
# Ruby
array.reduce(0, :+)
```
```python
# Python
reduce( "sum script", array, 0 )
```
#### 3. the operation inside the Ruby block looks almost identical to the Python version.
```ruby
# Ruby
array.reduce { |sum, x| sum + x }
array.reduce(0) { |sum, x| sum + x }
```
```python
# Python
reduce(lambda sum, x: sum + x, array) #=> 15
reduce(lambda sum, x: sum + x, array, 0) #=> 15
reduce(lambda sum, x: sum + x, array, 10) #=> 25

# with the literal example of this being:

array = [1,2,3,4,5]
total = 0
for x in array: total += x
total #=> 15
```

Again the default value in Python is AFTER the script (and array), not before it. So here's the answer to what that `(:+)` symbol (smiley) was doing under the hood in Ruby, but we'll explain it through Python! We can make our reduce function cleaner though by making `sum` into a variable, and we can also make one for multiplication while we're at it:

```python
# Python
array = [1, 2, 3, 4, 5]

sum = lambda s, x: s + x
multi = lambda m ,x: m * x

reduce(sum, array) #=> 15
reduce(sum, array, 10) #=> 25

reduce(multi, array) #=> 120
reduce(multi, array, 2) #=> 240
```

# 16) Selecting from an array
### Ruby: `select` | Python: `filter`
---
Say you have an array but only want to use certain elements in it. Ruby has a `.select` to do this and Python has `filter`. They're pretty much the same thing in the end. Let's get any element in an array that's even by using the modulo script of `x % 2 == 0` to say "any value divided by 2 will give no remainder":

```ruby
# Ruby
array = [1, 2, 3, 4, 5]
array.select { |x| x % 2 == 0 } #=> [2, 4]
```

```python
# Python
array = [1, 2, 3, 4, 5]
filter(lambda x: x % 2 == 0, array) #=> [2, 4]
```

Once again, just like with mapping or reducing, filter takes in a function first and the array second. Lambda strikes again. What if we want to reverse filter though? Aka what Ruby's `.reject` does? Simply enough we'll just throw a `not` in there:

```ruby
# Ruby
array = [1, 2, 3, 4, 5]
array.reject { |x| x % 2 == 0 } #=> [1, 3, 5]
```

```python
# Python
array = [1, 2, 3, 4, 5]
filter(lambda x: not x % 2 == 0, array) #=> [1, 3, 5]
```

If we don't want to always write out this entire lambda function every time we can also use a normal function along with filter to get it working:

```python
def even(n): return n % 2 == 0

even(4) #=> True
even(5) #=> False

a = [1, 2, 3, 4, 5]

filter(even, a) #=> [2, 4]
```

What about if we have a `nil` value in our Ruby array or a `None` value in our Python list? Ruby has a nice little method called `compact` which does it for us automatically, but we can simply use `filter` again and filter out anything that doesn't give us a false value like `None`

```ruby
# Ruby
array = [1, 2, 3, nil, 4, 5]
array.compact #=> [1, 2, 3, 4, 5]
```

```python
# Python
array = [1, 2, 3, None, 4, 5]
filter( lambda x: x, array ) #=> [1, 2, 3, 4, 5]
```

# 17) slice, aka accessing
---
Slice in Ruby is a nice method that goes into an array (or string) and selects the element(s) of your choice. It's mimicked by basically using hard brackets `[]` after an array or string. Though Python doesn't have a slice method, its use of hard brackets actually goes much, much farther.

Again, Ruby's slice method is exactly the same as the hard brackets, so here's how it looks on both arrays and strings:

```ruby
# Ruby
array = ["Hello", "World", "How", "Are", "You?"]
# access index 0
array[0] #=> "Hello"
array.slice(0) #=> "Hello"

# access indexes 2 through 4 with a range
array[2..4] #=> ["How", "Are", "You?"]
array.slice(2..4) #=> ["How", "Are", "You?"]
array.slice(2...4) #=> ["How", "Are"]

# start at index 2, and access the next 3 elements
array[2, 3] #=> ["How", "Are", "You?"]
array.slice(2, 3) #=> ["How", "Are", "You?"]

string = "this is a string"
string[0] #=> "t"
string[1,4] #=> "his "
string[1..4] #=> "his "
string[1...4] #=> "his"
```

That's the extent of what Ruby can do. Python blows it out of the water. Python can take in 1 to 3 arguments instead of Ruby's 1 to 2, and that opens up the possibilities exponentially. The syntax is different of course, instead of separating them by commas like in Ruby we separate them with colons.

`array[low value : high value : step]`

Let's start off with simple examples.

```python
# Python
a = ["a", "b" ,"c" ,"d" ,"e"]

# one value just gives the index, negatives work the same
a[0] #=> "a"
a[-1] #=> "e"

# two values, first value up until the second, just like Ruby's `...` operator
a[0:1] #=> ["a"]
a[0:2] #=> ["a", "b"]
a[1:4] #=> ["b", "c', "d"]

# three values, third is the step
a[1:4:2] #=> ["b", "d"]
a[0:5:2] #=> ["a", "c", "e"]
```

Again it's important to know that the `[low:high]` works just like Ruby's `low...high` operator in that it goes *up until* the second number but does not include it. All of the above is just the beginning though as we don't *have* to use all three numbers here. I'll just give you examples below to show what I mean, bit by bit:

```python
# Python
a = ["a", "b" ,"c" ,"d" ,"e"]

# go from index until the end of the array
a[1:] #=> ["b" ,"c" ,"d" ,"e"]

# go up until index 3
a[:3] #=> ["a", "b", "c"]

# both work with negatives as well
a[-2:] #=> ["d", "e"]
a[:-2] #=> ["a", "b", "c"]

# go through the whole array, step of 2
# aka, no low, no high, only step
a[::2] #=> ["a", "c", "e"]

# do the same, but start at index 1, no end index
a[1::2] #=> ["b", "d"]

# and the same, but end at an index, no start index
a[:3:2] #=> ["a", "c"]
```

And of course this works with strings as well:

```python
# Python
string = "this is a string"
string[0] #=> "t"
string[1:] #=> "his is a string"
string[:7] #=> "this is"
string[-6:] #=> "string"
string[:-7] #=> "this is a"
string[5:9] #=> "is a"
string[::2] #=> "ti sasrn"
```

# 18) Duplicating an Array/List
---
You may have run into this problem before where you have an array and want to duplicate it. You may start off doing array2 = array, but there's an issue: if you change `array`, then `array2` will also change because you merely set it to equal the array object, not the array of numbers. Ruby has a quick fix by simply adding `.dup` to the array, and Python has a similar trick. Let's go through the problem so you can see how it will be fixed:


```ruby
# Ruby

# problem
array_a = [1, 2, 3, 4, 5]
array_b = array_a
array_b #=> [1, 2, 3, 4, 5]
array_a[2] = 9
array_a #=> [1, 2, 9, 4, 5]
array_b #=> [1, 2, 9, 4, 5] (changed)

# we didn't want array_b to change, only array_a. the fix:
array_a = [1, 2, 3, 4, 5]
array_b = array_a.dup
array_b #=> [1, 2, 3, 4, 5]
array_a[2] = 9
array_a #=> [1, 2, 9, 4, 5]
array_b #=> [1, 2, 3, 4, 5] (doesn't change)
```

Here's the same problem and fix in Python:

```python
# Python

# problem
array_a = [1, 2, 3, 4, 5]
array_b = array_a
array_b #=> [1, 2, 3, 4, 5]
array_a[2] = 9
array_a #=> [1, 2, 9, 4, 5]
array_b #=> [1, 2, 9, 4, 5] (changed)

# we didn't want array_b to change, only array_a. the fix:
array_a = [1, 2, 3, 4, 5]
array_b = array_a[:]
array_b #=> [1, 2, 3, 4, 5]
array_a[2] = 9
array_a #=> [1, 2, 9, 4, 5]
array_b #=> [1, 2, 3, 4, 5] (doesn't change)
```

The `array[:]` operator says "select everything from this array" which means when we set our `array_b` object to it, we're taking in the elements of the array instead of the object that holds the array.

# 19) Sorting a collection
### Ruby: `.sort` | Python: `sorted()`

Say you have an array/list of mixed up numbers or strings (or anything else), or a hash/dictionary with keys and values but want to sort them into an array/list, or a bunch of objects of a certain class. Ruby and Python both have native sorting methods that you can use, separate of course from scripts you can write for the many, many sorting types of varying efficiencies,

Ruby's `.sort` is a quicksort and Python's `sorted` is a Timsort (mix between merge sort and insert sort). Here are the many ways you can use these sort methods. We'll be covering these 5 types of collections:

```ruby
array = [1, 7, 4, 9, 2, 8, 5, 10, 6, 3]
array_strings = ["hello", "everyone", "how", "are", "you?"]
hashes = {1 => "one", 2 => "two", 3 => "three", 4 => "four", 5 => "five"}
array_hash = [ {borough: 'Manhattan', population: 1585874},
               {borough: 'Brooklyn', population: 2504706},
               {borough: 'Queens', population: 2230545},
               {borough: 'Bronx', population: 1385107},
               {borough: 'Staten_Island', population: 486730} ]
animals = {Lily:  { animal_type: "dog",
                    age: 8,
                    breed: "Pit Mix"},
           Rhana: { animal_type: "horse",
                    age: 28,
                    breed: "Norwegian Fjord"},
           Lira:  { animal_type: "cat",
                    age: 15,
                    breed: "Chartreux"},
           Sasha: { animal_type: "dog",
                    age: 11,
                    breed: "Corgi"}
           }
```

In addition to an object oriented collection which I'll do per language. Please note as well the above hashes are Ruby-styled as Python requires the keys to be strings or integers. The simple fix: encase each named key in quotes, or if it's an integer just replace the rocket `=>` with a colon `:`. Sidenote that you can't technically sort a hash/dictionary as they're inherently orderless so sorting will return an array/list.

Let's cover basic sorting first and what they do:

```ruby
# Ruby
array.sort #=> [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
array_strings.sort #=> ["are", "everyone", "hello", "how", "you?"]
hashes.sort #=> [[1, "one"], [2, "two"], [3, "three"], [4, "four"], [5, "five"]]
array_hash.sort #=> ArgumentError: comparison of Hash with Hash failed
animals.sort #=> [[:Lily, all_info], [:Lira, all_info], [:Rhana, all_info, [:Sasha, all_info]]
```

```python
# Python
sorted(array) #=> [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
sorted(array_strings) #=> ["are", "everyone", "hello", "how", "you?"]
sorted(hashes) #=> [1, 2, 3, 4, 5]
sorted(array_hash) #=> [ {Bronx_dict}, {Brooklyn_dict}, {Manhattan_dict} ... ]
sorted(animals) #=> ["Lily", "Lira", "Rhana", "Sasha"]
```

Both languages handle basic arrays the same way, but past that you can see the obvious differences. When you sort a basic hash or a nested hash, Ruby will give you every piece of information for each key and value while Python will just give you the key. Python basically does Ruby's version of `hashes.sort.map { |key, value| key }` to limit the huge amount of information can can be spit out on your screen.

The other difference is in the array of hashes: Ruby will give you an ArgumentError because it can't parse which key to sort in each element, however Python will go through and find the first key by alphabetical order and sort out the array accordingly. I tested it out thoroughly and the only way it will natively sort via population using `sorted` is if you rename `population` to something that comes before `borough`, aka renaming it to `all_population` will let the native `sorted` sort by the population instead. We don't need to go through the trouble of doing that though as we can specifically target specific keys.

Before that though lemme quickly cover how to reverse the sorts to get you used to the syntax:

```ruby
# Ruby
array.sort.reverse #=> [10, 9, 8, 7, 6, 5, 4, 3, 2, 1]
```

```python
# Python
sorted(array, reverse=True) #=> [10, 9, 8, 7, 6, 5, 4, 3, 2, 1]
```

In Python, any argument after the collection you want to sort will be a modifier. Let's put that information to use by introducing different ways to modify your sort.

The most direct comparison in Ruby is its `sort_by` method, and though it's slower than the native sort it's incredibly useful because you can also sort by other parameters and use it to sort hashes as well. Here are some examples going through each of the 5 collections:


```ruby
# Ruby
array.sort_by { |x| x } #=> [1, 2, 3, 4, 5, 6, 7]
array.sort_by { |x| -x } #=> [7, 6, 5, 4, 3, 2, 1]

array_string.sort_by { |x| x.length }
# or the less used:
array_string.sort_by(&:length)
# both => ["how", "are", "you?", "hello", "everyone"]

# multiple sorts at once, first length then alphabetically
array_string.sort_by { |x| [x.length, x] }
#=> ["are", "how", "you?", "hello", "everyone"]

hashes.sort_by { |key, value| value }
#=>  [[5, "five"], [4, "four"], [1, "one"], [3, "three"], [2, "two"]]
hashes.sort_by { |key, value| value.length }
#=> [[1, "one"], [2, "two"], [4, "four"], [5, "five"], [3, "three"]]
hashes.sort_by { |key, value| [value.length, value] }
#=> [[1, "one"], [2, "two"], [5, "five"], [4, "four"], [3, "three"]]

array_hash.sort_by { |x| x[:borough] }
#=> [{:borough=>"Bronx",         :population=>1385107},
   # {:borough=>"Brooklyn",      :population=>2504706},
   # {:borough=>"Manhattan",     :population=>1585874},
   # {:borough=>"Queens",        :population=>2230545},
   # {:borough=>"Staten_Island", :population=>486730}]
array_hash.sort_by { |x| x[:population] }
#=> [{:borough=>"Staten_Island", :population=>486730},
   # {:borough=>"Bronx",         :population=>1385107},
   # {:borough=>"Manhattan",     :population=>1585874},
   # {:borough=>"Queens",        :population=>2230545},
   # {:borough=>"Brooklyn",      :population=>2504706}]

animals.sort_by { |key, value| value[:age] }
#=> [[:Lily, {:animal_type=>"dog", :age=>8, :breed=>"pit mix"}],
  # [:Sasha, {:animal_type=>"dog", :age=>11, :breed=>"corgi"}],
  # [:Lira,  {:animal_type=>"cat", :age=>15, :breed=>"chartreux"}],
  # [:Rhana, {:animal_type=>"horse", :age=>28, :breed=>"Norwegian Fjord"}]]
```

As far as Python goes, its `sorted` method can do both of the above Ruby methods. Here's a reminder of what we're working with (hashes fixed to work with Python now) and then going through them all:

```python
# Python
array = [1, 7, 4, 9, 2, 8, 5, 10, 6, 3]
array_strings = ["hello", "everyone", "how", "are", "you?"]
hashes = {1: "one", 2: "two", 3: "three", 4: "four", 5: "five"}
array_hash = [ {"borough": 'Manhattan', "population": 1585874},
               {"borough": 'Brooklyn', "population": 2504706},
               {"borough": 'Queens', "population": 2230545},
               {"borough": 'Bronx', "population": 1385107},
               {"borough": 'Staten_Island', "population": 486730} ]
animals = {"Lily":  { "animal_type": "dog",
                    "age": 8,
                    "breed": "pit mix"},
           "Rhana": { "animal_type": "horse",
                    "age": 28,
                    "breed": "Norwegian Fjord"},
           "Lira":  { "animal_type": "cat",
                    "age": 15,
                    "breed": "chartreux"},
           "Sasha": { "animal_type": "dog",
                    "age": 11,
                    "breed": "corgi"}
           }

sorted(array) #=> [1, 2, 3, 4, 6, 7, 8, 9, 10]
sorted(array, reverse=True) #=> [10, 9, 8, 7, 6, 4, 3, 2, 1]

sorted(array_strings)
#=> ['are', 'everyone', 'hello', 'how', 'you?']
sorted(array_strings, key=len)
#=> ['how', 'are', 'you?', 'hello', 'everyone']
sorted(array_strings, key=len, reverse=True)
#=> ['everyone', 'hello', 'you?', 'how', 'are']

sorted(hashes) #=> [1, 2, 3, 4, 5]
# also get the values
sorted(hashes.items())
#=> [(1, 'one'), (2, 'two'), (3, 'three'), (4, 'four'), (5, 'five')]
# sort by value, both give the same answer
sorted(hashes.items(), key=lambda x: x[1])
sorted(hashes.items(), key=lambda (key, value): value)
#=> [(5, 'five'), (4, 'four'), (1, 'one'), (3, 'three'), (2, 'two')]
sorted(hashes.items(), key=lambda (key, value): len(value))
#=> [(1, 'one'), (2, 'two'), (4, 'four'), (5, 'five'), (3, 'three')]
# sort multiple ways
sorted(hashes.items(), key=lambda (key, value): (len(value), value))
#=> [(1, 'one'), (2, 'two'), (5, 'five'), (4, 'four'), (3, 'three')]

sorted(array_hash, key=lambda x: x["borough"])
#=> [{:borough=>"Bronx",         :population=>1385107},
   # {:borough=>"Brooklyn",      :population=>2504706},
   # {:borough=>"Manhattan",     :population=>1585874},
   # {:borough=>"Queens",        :population=>2230545},
   # {:borough=>"Staten_Island", :population=>486730}]
sorted(array_hash, key=lambda x: x["population"])
#=> [{:borough=>"Staten_Island", :population=>486730},
   # {:borough=>"Bronx",         :population=>1385107},
   # {:borough=>"Manhattan",     :population=>1585874},
   # {:borough=>"Queens",        :population=>2230545},
   # {:borough=>"Brooklyn",      :population=>2504706}]

# also get the values
sorted(animals.items())
#=> [('Lily', {'age': 8, 'breed': 'pit mix', 'animal_type': 'dog'}),
   # ('Lira', {'age': 15, 'breed': 'chartreux', 'animal_type': 'cat'}),
   # ('Rhana', {'age': 28, 'breed': 'Norwegian Fjord', 'animal_type': 'horse'}),
   # ('Sasha', {'age': 11, 'breed': 'corgi', 'animal_type': 'dog'})]

sorted(animals.items(), key=lambda (key, value): value["age"])
#=> [[:Lily, {:animal_type=>"dog", :age=>8, :breed=>"pit mix"}],
  # [:Sasha, {:animal_type=>"dog", :age=>11, :breed=>"corgi"}],
  # [:Lira,  {:animal_type=>"cat", :age=>15, :breed=>"chartreux"}],
  # [:Rhana, {:animal_type=>"horse", :age=>28, :breed=>"Norwegian Fjord"}]]
```

If you're doing object oriented programming, these sorting methods also work with classes:

```ruby
# Ruby
class Animal
  attr_accessor :animal_type, :age, :breed
  def initialize(animal_type, age, breed)
    @animal_type = animal_type
    @age = age
    @breed = breed
  end
end

lily = Animal.new("dog", 8, "Pit Mix")
rhana = Animal.new("horse", 28, "Norwegian Fjord")
lira = Animal.new("cat", 15, "Chartreux")
sasha = Animal.new("dog", 11, "Corgi")

class_animals = [ lily, rhana, lira, sasha ]
class_animals.sort_by { |x| x.age }
#=> [#<Animal:0x007fb8ec016ad8 @age=8, @animal_type="dog", @breed="Pit Mix">,
     #<Animal:0x007fb8ec859bc8 @age=11, @animal_type="dog", @breed="Corgi">,
     #<Animal:0x007fb8ed0068a8 @age=15, @animal_type="cat", @breed="Chartreux">,
     #<Animal:0x007fb8ec8e4318 @age=28, @animal_type="horse", @breed="Norwegian Fjord">]

# remapping to an attribute
class_animals.sort_by { |x| x.age }.map { |x| x.animal_type }
#=> ["dog", "dog", "cat", "horse"]
```

```python
# Python
class Animal:
    def __init__(self, animal_type, age, breed):
        self.animal_type = animal_type
        self.age = age
        self.breed = breed


lily = Animal("dog", 8, "Pit Mix")
rhana = Animal("horse", 28, "Norwegian Fjord")
lira = Animal("cat", 15, "Chartreux")
sasha = Animal("dog", 11, "Corgi")

class_animals = [ lily, rhana, lira, sasha ]

sorted(class_animals, key=lambda x: x.breed)
#=> [<lira instance">, <sasha instance>, <rhana instance>, <lily instance>]
# let's just map it to the breed and age so it's easier to see
map(lambda x: "{} age {}".format(x.breed, x.age), sorted(class_animals, key=lambda x: x.breed))
#=> ['Chartreux age 15', 'Corgi age 11', 'Norwegian Fjord age 28', 'Pit Mix age 8']

sorted(class_animals, key=lambda x: x.age)
#=> [<lily instance">, <sasha instance>, <lira instance>, <rhana instance>]
map(lambda x: "{} age {}".format(x.breed, x.age), sorted(class_animals, key=lambda x: x.age))
#=> ['Pit Mix age 8', 'Corgi age 11', 'Chartreux age 15', 'Norwegian Fjord age 28']

map(lambda x: "{} age {}".format(x.breed, x.age), sorted(class_animals, key=lambda x: x.age, reverse=True))
#=> ['Norwegian Fjord age 28', 'Chartreux age 15', 'Corgi age 11', 'Pit Mix age 8']
```

There's even more you can do when you import in other methods, but this is just a small amount that you can do with the native sorting.

# 20) Easier if/else/etc
### Ruby: `Case; each` | Python: dictionary manipulation
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

```python
# Python
def title(name):
  if name == "CJ": return "Press Secretary"
  elif name == "Donna": return "Assistant to the DCoS"
  elif name == "Abbey": return "First Lady"
  elif name == "Jed": return "President"
  elif name == "Josh": return "Deputy Chief of Staff"
  elif name == "Sam": return "Deputy Communications Director"
  elif name == "Toby": return "Communications Director"
```

If we call `title("CJ")` we'll get "Press Secretary", or `title("Jed")` we'll get "President" which is great! But in our code we have to call on `name == X` every. single. time. In addition to a few other things in the code, they're repetitive and constrictive, so instead we can use a `case statement` in Ruby or a dictionary in Python. Unfortunately unlike JavaScript with its switch/case statements, there's nothing that directly translates to it in Python. That being said using a dictionary works just fine.

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
```python
# Python
def title(name):
  titles = {
    "CJ": "Press Secretary",
    "Donna": "Assistant to the DCoS",
    "Abbey": "First Lady",
    "Jed": "President",
    "Josh": "Deputy Chief of Staff",
    "Sam": "Deputy Communications Director",
    "Toby": "Communications Director"
  }
  return titles[name]
```

**SO** much better! Well, almost for the Python script. There's a major problem, and that's our missing "else" statement. Right now we simply have a dictionary of titles and are calling on our name as its key. What if we put in someone's name that isn't in our list, or misspell it? We'd get an error:

```python
# Python
title("Abbey Bartlet")
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
  File "<stdin>", line 11, in title
KeyError: 'Abbey Bartlet'
```

To fix this there's a fancy method called `.get` which can be called on a dictionary and give a separate output if the input isn't found. Here's a basic example building off what we did before in our sorting section:

```python
# Python
hashes = {1: "one", 2: "two", 3: "three", 4: "four", 5: "five"}
hashes[1] #=> "one"

# getting an error if not found
hashes[7] #=> Traceback (most recent call last):  File "<stdin>", line 1, in <module>; KeyError: 7

# fix by using .get instead
hashes.get(1) #=> "one"
hashes.get(7) #=> nothing returned

# output a message if not found
hashes.get(1, "Number not found") #=> "one"
hashes.get(7, "Number not found") #=> "Number not found"
```

When we replace the `[number]` with `.get(number)` we're telling Python to not give us an error if the key isn't found, and a second argument will be the message given if that happens. This effectively becomes our "else" statement. Putting it all together with our West Wing dictionary:

```python
# Python
def title(name):
  return {
    "CJ": "Press Secretary",
    "Donna": "Assistant to the DCoS",
    "Abbey": "First Lady",
    "Jed": "President",
    "Josh": "Deputy Chief of Staff",
    "Sam": "Deputy Communications Director",
    "Toby": "Communications Director"
  }.get(name, "Name Not Found")

title("CJ") #=> "Press Secretary"
title("Josh") #=> "Deputy Chief of Staff"
title("Josh 'Lemon' Lyman") #=> "Name Not Found"
```

Taking this a step further, we can even link this to our `map` method if we'd like to call on an array:

```ruby
# Ruby
names = ["Josh", "Jed", "Toby", "John", "CJ", "Sam"]

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

#=> ["Deputy Chief of Staff", "President", "Communications Director", "Name Not Found", "Press Secretary", "Deputy Communications Director"]
```

```python
# Python
names = ["Josh", "Jed", "Toby", "John", "CJ", "Sam"]

map(lambda name:
    { "CJ": "Press Secretary",
      "Donna": "Assistant to the DCoS",
      "Abbey": "First Lady",
      "Jed": "President",
      "Josh": "Deputy Chief of Staff",
      "Sam": "Deputy Communications Director",
      "Toby": "Communications Director"
    }.get(name, "Name Not Found"), names)

#=> ["Deputy Chief of Staff", "President", "Communications Director", "Name Not Found", "Press Secretary", "Deputy Communications Director"]
```

Let's do one more example with an array of grades someone got on their tests:

`grades = [95, 83, 68, 102, 99, 75, 60]`

And we want to map those into basic letter grades, aka an A is 90-100, B is in the 80's, etc. Ranges don't translate as well with Python dictionaries, so in this case a multiple if/elif/else may work better.

```ruby
# Ruby
def grade(number)
  case number;
    when 90..100; "A"
    when 80..89; "B"
    when 70..79; "C"
    when 65..69; "D"
    when 0..64; "F"
    else "Invalid"
  end
end

grades.map { |x| grade(x) }
#=> ["A", "B", "D", "Invalid", "A", "C", "F"]
```

```python
# Python
def grade(number):
  if number in range(90,101): return "A"
  elif number in range(80,90): return "B"
  elif number in range(70,80): return "C"
  elif number in range(65,70): return "D"
  elif number in range(0,65): return "F"
  else: return "Invalid"

map(lambda x: grade(x), grades)
#=> ["A", "B", "D", "Invalid", "A", "C", "F"]
```

That being said we can still create a dictionary that covers every single number from 0 to 100 very quickly by using the `dict` method:

```python
# Python
def grade(number):
  return dict(
      [(n, "A") for n in range(90, 101)] +
      [(n, "B") for n in range(80, 90)] +
      [(n, "C") for n in range(70, 80)] +
      [(n, "D") for n in range(65, 70)] +
      [(n, "F") for n in range(0, 65)]
      ).get(number, "Invalid")

# the dictionary in this function looks like this: {0: 'F', 1: 'F', 2: 'F', ... 99: 'A', 100: 'A'}

map(lambda x: grade(x), grades)
#=> ["A", "B", "D", "Invalid", "A", "C", "F"]
```

This is slower though since each time we call the function it will generate the dictionary. We can fix this by separating them out to make the dictionary first then simply call it:


```python
# Python
letters = dict(
    [(n, "A") for n in range(90, 101)] +
    [(n, "B") for n in range(80, 90)] +
    [(n, "C") for n in range(70, 80)] +
    [(n, "D") for n in range(65, 70)] +
    [(n, "F") for n in range(0, 65)]
    )

def grade(number): return letters.get(number, "Invalid")

map(lambda x: grade(x), grades)
#=> ["A", "B", "D", "Invalid", "A", "C", "F"]
```

# 21) Adding to / removing from arrays
---
#### Adding with Ruby: `.insert` | Python: `insert(idx, elem)` / accessing

It's easy to use `.unshift`/`.shift`/`.push`/`.pop` to add/remove items from the beginning/end of arrays respectively, but what about when we have to add/remove items at certain points *within* the array? `insert` comes to the rescue, though it works differently in both languages.

Ruby's `.insert` takes in an index along with a value (or values) you'd like to add:

```ruby
# Ruby
array = ["Hello", "World", "How", "Are", "You?"]

array.insert(2, "!") #=> ["Hello", "World", "!", "How", "Are", "You?"]

array.insert(1, "Everyone", "In", "The")
#=> ["Hello", "Everyone", "In", "The", "World", "!", "How", "Are", "You?"]
```

Python's insert method works the same way *but can only add* ***one*** *element at once*. There's another way to add multiple elements at once though by taking advantage of its slice aka accessing method. If you use brackets and a colon like `[x:x]` you can add as many elements as you want and it will flatten it automatically as it inserts it.

```python
# Python
array = ["Hello", "World", "How", "Are", "You?"]

array.insert(2, "!") #=> ["Hello", "World", "!", "How", "Are", "You?"]

array[1:1] = ["Everyone", "In", "The"]
#=> ["Hello", "Everyone", "In", "The", "World", "!", "How", "Are", "You?"]
```

#### Removing with Ruby: `.delete_at` / `.slice!` | Python: `del a[idx:idx2]`

Ruby's `.delete_at` takes in just the index as its argument, however we can use the `slice` method (that normally selects an element at an index) and make its selection permanent by changing it to `slice!`. This will let us remove a range of elements rather than just one. Note that when you use `.delete_at` or `slice/slice!`, just like with pop/shift it will **return the removed item(s)**, and you'll need to call on the array again to see its values:

```ruby
# Ruby
array.delete_at(5) #=> "!"
array #=> ["Hello", "Everyone", "In", "The", "World", "How", "Are", "You?"]

array.slice!(0) #=> "Hello"
array #=> ["Everyone", "In", "The", "World", "How", "Are", "You?"]

array.slice!(1,3) #=> ["In", "The", "World"]
array #=> ["Everyone", "How", "Are", "You?"]
```

Python's `del` method works the same way except it doesn't return the removed element(s), only changes the array. However it also does what Ruby's `slice!` method can do by using a range:

```python
# Python
del array[5] #=>
array #=> ["Hello", "Everyone", "In", "The", "World", "How", "Are", "You?"]

del array[0] #=>
array #=> ["Everyone", "In", "The", "World", "How", "Are", "You?"]

del array[1:4] #=>
array #=> ["Everyone", "How", "Are", "You?"]
```

#### Removing element(s) by element Ruby: `.delete(e)` | Python: `.remove(e)`

Finally you can remove elements by their name rather than their index. For example I can remove any element that is a 4 by doing:

```ruby
# Ruby
array = [1, 2, 3, 4, 5, 1, 2, 3, 4, 5]

array.delete(4) #=> 4
array #=> [1, 2, 3, 5, 1, 2, 3, 5]
```

Though in Python it will simple find the first one and remove it, not all of them:

```python
# Python
array = [1, 2, 3, 4, 5, 1, 2, 3, 4, 5]

array.remove(4) #=>
array #=> [1, 2, 3, 5, 1, 2, 3, 4, 5]
```

There is a fix though iI you want to remove multiple of the same element at the same time just like in Ruby. To do it just map it out:

```python
# Python
array = [1, 2, 3, 4, 5, 1, 2, 3, 4, 5]

array = [x for x in array if x != 4]
array #=> [1, 2, 3, 5, 1, 2, 3, 5]

# and you can do multiple arguments this way as well
array = [x for x in array if x != 2 and x != 5]
array #=> [1, 3, 1, 3]
```

# 22) Calls and Procs
### Ruby: `.call` / `.proc` | Python: N/A, it's inherent
---

While Ruby can handle calls and procs aka callbacks, aka a function inside of another function, in Python you don't need to do any of that since it can handle it inherently.

Let's quickly go through the complication in Ruby first to see how easily Python handles this. Say we were writing a function that did a few complicated things within it, but then wanted to easily change them or call on them again? For example, what if we wanted to multiply two numbers but have them squared first? We *could* do something like write it all out:

```ruby
# Ruby
def multiply_squared(x, y)
  x*x * y*y
end

multiply_squared(2, 3) #=> 2*2 * 3*3 = 4 * 9 = 36
```

Great, but what if instead of squaring these I wanted to cube them? What if I wanted to have `x` equal another equation? Sure for cubing I could simply change the equation to `2*2*2 * 3*3*3` but that'd get messy especially if I wanted to add another one to the exponent, or I could change the equation to `2**3 * 3**3` and just simply change the exponent that way, but that'd get tedious and I also wouldn't be able to call that as its own function. For `x` as another equation that'd also get ugly as for example `multiply_squared(2, (32/8) + 4)`. `.call` / `.proc`.

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
We have our object to call on, and can change it any way we want. Now in Python, here's how easy everything is:

```python
# Python
def double(n): return n*2

def triple(n): return n*3

double(5) #=> 10
triple(5) #=> 15

# and the magic:
def multi(n, type): return type(n)

multi(10, double) #=> 20
```

As you can see, Python handles our "proc" by just naming a function with multiple arguments and then calling it. We don't need to do anything fancy. That being said let's get fancy:

```python
# Python
def double(n): return n*2

def triple(n): return n*3

def multi_with_order(n, type, name):
  return "If we {} {} we'll get {}".format(name, n, type(n))

multi_with_order(5, double, "double") #=> "If we double 5 we'll get 10"
multi_with_order(5, triple, "triple") #=> "If we triple 5 we'll get 15"

# fanciness intensifies

def square(n): return n**2

def multi_twice(n, type1, type2): return type1(type2(n))

multi_twice(5, double, double) #=> 20
multi_twice(5, double, triple) #=> 30
multi_twice(5, triple, triple) #=> 45
multi_twice(5, triple, square) #=> 50
multi_twice(5, square, triple) #=> 100
```

There's so much more you can do with this, try it out yourselves!

---

So that covers some of the most important Python loops/iterations/methods. If there are any others you'd like added let me know!

Code on.

Mike Merin
