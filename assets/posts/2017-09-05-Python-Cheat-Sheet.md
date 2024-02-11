---
layout: post
title:  "A Python Cheat Sheet"
date: 2017-09-05 23:28:15 -0400
tags: Python
series: Cheat Sheets
summary: One-stop-shop for Python functions methods and more
---
This is an abbreviated cheat sheet for Python. If you want an detailed explanation of how everything you see here works including explanations through the eyes of Ruby you can find that [here](/blog?post=2017-08-25-Python-through-Ruby), which I highly recommend.

interpolation | structure | type conversions
len | ranges | pop | append
in | while | for..in | keys/values
enumerate | map | lambda | reduce
filter | a[] | sorted | insert
del | remove | callbacks

### String Interpolation
Easily bring objects into a string.

```python
animal = "dog"
name = "Lily"
age = 8

# Type 1
print("{}, the {} year old {}").format(name, age, animal)
#=> "Lily, the 8 year old dog."
print("My {2} {0} is {1} years old. {0} is a very sweet {2}.").format(name, age, animal)
#=> My dog Lily is 8 years old. Lily is a very sweet dog.
print("My {2} {0} is {1:d} years old. {0} is a very {desc} {2}.").format(name, age, animal, desc="silly")
#=> My dog Lily is 8 years old. Lily is a very silly dog.

# Type 2
print "%s, the %d year old %s" % (name, age, animal)
#=> "Lily, the 8 year old dog."

# ways to interpolate with type 2
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

# example to use in similar fashion with type 1
print("{0:.5g}").format(1384356) #=> 1.3844e+06
```

### Structure
Whitespace is important, tab after a colon `:` to continue, unindent to move on

```python
x = 5
y = 10
if x < y:
  print "x is smaller than y"
  print "{} - {} = {}".format(y, x, y-x)
else:
  print "x is larger than y"
  print "{} - {} = {}".format(x, y, x-y)

print ("small" if x < y else "large")

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

### Type Conversions

```python
str(150) #=> "150"
int("10") #=> 10
float("10") #=> 10.0
float(10.5) #=> 10.5
```

### Length of an Object

```python
len([1, 2, 3, 4]) #=> 4
len("testing out a string") #=> 20
len({1: "one", 2: "two", 3: "three"}) #=> 3
```

### Ranges
Create arrays from a range of numbers

```python
range(x) #=> go from 0 to x
range(x, y) #=> go from x up until y
range(x, y, z) #=> z is the step, how many in between each number

range(4) #=> [0, 1, 2, 3]
range(1, 5) #=> [1, 2, 3, 4]
range(1, 10, 3) #=> [1, 4, 7] (notice 10's not there, again it's 1 up until 10, not including)
range(-5, 0) #=> [-5, -4, -3, -2, -1]

range(0, -5, -1) #=> [0, -1, -2, -3, -4]
range(1, -10, -3) #=> [1, -2, -5, -8]
range(100, 20, -18) #=> [100, 82, 64, 46, 28]
```

### Push/Append/Pop/Shift/Unshift
Add/remove from beginning/end of an array

```python
# add to end
array = [1, 2, 3, 4]
array.append(5) #=> [1, 2, 3, 4, 5]
array = array + [6, 7] #=> [1, 2, 3, 4, 5, 6, 7]

# add to beginning
array = [1, 2, 3, 4]
array = [0] + array  #=> [0, 1, 2, 3, 4]
array = [-2, -1] + array #=> [-2, -1, 0, 1, 2, 3, 4]

# remove from end
array = ["one", "two", "three", "four", "five", "six", "seven", "eight"]
array.pop() #=> "eight"
array #=> ["one", "two", "three", "four", "five", "six", "seven"]
array.pop(2) #=> "three"
array #=> ["one", "two", "four", "five", "six", "seven"]
array.pop(0) #=> "one"
array #=> ["two", "four", "five", "six", "seven"]

# remove from beginning
array = [1, 2, 3, 4, 5]
array = array[1:]
array #=> [2, 3, 4, 5]
```

### in
Test for inclusion

```python
5 in [1, 2, 3, 4, 5] #=> True
7 in [1, 2, 3, 4, 5] #=> False
"t" in "this is a string" #=> True
"is" in "this is a string" #=> True
"e" in "this is a string" #=> False
"t" not in "this is a string" #=> False
```

### while
Loop until condition is met

```python
array = []
x = 1
while x < 6:
  array.append(x)
  x += 1

array #=> [1, 2, 3, 4, 5]

array = []
x = 1
while x < 6: a.append(x); x += 1
array #=> [1, 2, 3, 4, 5]
```

### for
Iterate through a range or array

```python
range(1,6) #=> [1, 2, 3, 4, 5]
array = []
array2 = []
for x in range(1,6):
  array.append(x)
  array2.append(x * x)
# or: for x in range(1,6): array.append(x); array2.append(x * x)

array #=> [1, 2, 3, 4, 5]
array2 #=> [1, 4, 9, 16, 25]

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

One line `for..in`

```python
[x*x for x in range(1,6)] #=> [1, 4, 9, 16, 25]
```

### Keys and Values
Using `for..in` to get a dictionary's info

```python
d = {1: "one", 2: "two", 3: "three"}

[key for key in d] #=> [1, 2, 3]
[d[key] for key in d] #=> ["one", "two", "three"]
```

### enumerate
Iterate, but also get the index

```python
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

array = []
for i, x in enumerate(range(1,6)): array.append(i*x)
array #=> [0, 2, 6, 12, 20]
```

### map()
Iterate and manipulate

```python
# Python
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

### lambda
Functions that can be called in multiple ways, can be used as a pseudo callback

```python
# Python
lam = lambda x: x*x
lam(5) #=> 25

marco = lambda: "polo"
marco #=> <function <lambda> at 0x10221d668>
marco() #=> "polo"

square = lambda x: x*x
square(5) #=> 25

function = lambda x: x
function("hey") #=> "hey"

exponential = lambda x, y: x**y
exponential(3, 4) #=> 81

array = [1,2,3,4,5]
map(lambda x: x**, array) #=> [1, 4, 9, 16, 25]
map(lambda x: x+5, array) #=> [6, 7, 8, 9, 10]

array_a = [1,2,3,4,5]
array_b = [2,4,6,8,10]

# handles multiple arrays if they're the same length, acting on the same index
map(lambda x, y: [x,y], a, b)
#=> [[1, 2], [2, 4], [3, 6], [4, 8], [5, 10]]

map(lambda x, y: x*y, array_a, array_b)
#=> [2, 8, 18, 32, 50]
```

### map() and enumerate
Map but also get the index

```python
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

### reduce
Manipulate an array down to one value

```python
reduce("script", array, "starting value (optional)")

reduce(lambda sum, x: sum + x, array) #=> 15
reduce(lambda sum, x: sum + x, array, 0) #=> 15
reduce(lambda sum, x: sum + x, array, 10) #=> 25

# store function

array = [1, 2, 3, 4, 5]

sum = lambda s, x: s + x
multi = lambda m ,x: m * x

reduce(sum, array) #=> 15
reduce(sum, array, 10) #=> 25

reduce(multi, array) #=> 120
reduce(multi, array, 2) #=> 240
```

### filter
Select from an array / filter out what doesn't pass as True

```python
array = [1, 2, 3, 4, 5]
filter(lambda x: x % 2 == 0, array) #=> [2, 4]
filter(lambda x: not x % 2 == 0, array) #=> [1, 3, 5]

def even(n): return n % 2 == 0
filter(even, a) #=> [2, 4]

array = [1, 2, 3, None, 4, 5]
filter( lambda x: x, array ) #=> [1, 2, 3, 4, 5]
```

### slice aka accessing
Select the element(s) of your choice

```python
a = ["a", "b" ,"c" ,"d" ,"e"]

# one value just gives the index, negatives work the same
a[0] #=> "a"
a[-1] #=> "e"

# two values, first value up until (but not including) the second
a[0:1] #=> ["a"]
a[0:2] #=> ["a", "b"]
a[1:4] #=> ["b", "c', "d"]

# three values, third is the step
a[1:4:2] #=> ["b", "d"]
a[0:5:2] #=> ["a", "c", "e"]

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

string = "this is a string"
string[0] #=> "t"
string[1:] #=> "his is a string"
string[:7] #=> "this is"
string[-6:] #=> "string"
string[:-7] #=> "this is a"
string[5:9] #=> "is a"
string[::2] #=> "ti sasrn"
```

### Duplicating an object
Copy an object's information, not the object itself

```python
# problem
array_a = [1, 2, 3, 4, 5]
array_b = array_a
array_b #=> [1, 2, 3, 4, 5]
array_a[2] = 9
array_a #=> [1, 2, 9, 4, 5]
array_b #=> [1, 2, 9, 4, 5] (changed)

# the fix
array_a = [1, 2, 3, 4, 5]
array_b = array_a[:]
array_b #=> [1, 2, 3, 4, 5]
array_a[2] = 9
array_a #=> [1, 2, 9, 4, 5]
array_b #=> [1, 2, 3, 4, 5] (doesn't change)
```

### sorted()
Sort a collection


```python
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

Object Oriented sorting:

```python
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

### dictionary manipulation
Easier if/else/etc, a `case; each` or `switch: case` alternative

```python
# old
def title(name):
  if name == "CJ": return "Press Secretary"
  elif name == "Donna": return "Assistant to the DCoS"
  elif name == "Abbey": return "First Lady"
  elif name == "Jed": return "President"
  elif name == "Josh": return "Deputy Chief of Staff"
  elif name == "Sam": return "Deputy Communications Director"
  elif name == "Toby": return "Communications Director"
  else: "Name Not Found"

# new
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

# quickly explaining .get
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

Using for ranges,


```python
grades = [95, 83, 68, 102, 99, 75, 60]

# old
def grade(number):
  if number in range(90,101): return "A"
  elif number in range(80,90): return "B"
  elif number in range(70,80): return "C"
  elif number in range(65,70): return "D"
  elif number in range(0,65): return "F"
  else: return "Invalid"

map(lambda x: grade(x), grades)
#=> ["A", "B", "D", "Invalid", "A", "C", "F"]

# new
def grade(number):
  return dict(
      [(n, "A") for n in range(90, 101)] +
      [(n, "B") for n in range(80, 90)] +
      [(n, "C") for n in range(70, 80)] +
      [(n, "D") for n in range(65, 70)] +
      [(n, "F") for n in range(0, 65)]
      ).get(number, "Invalid")

# or create the dictionary first, which is faster for multiple calls

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

### insert(idx, elem) / accessing (a[x:x])
Add to an array

```python
array = ["Hello", "World", "How", "Are", "You?"]
array.insert(2, "!") #=> ["Hello", "World", "!", "How", "Are", "You?"]

# add multiple at once
array[1:1] = ["Everyone", "In", "The"]
#=> ["Hello", "Everyone", "In", "The", "World", "!", "How", "Are", "You?"]
```

### del a[idx:idx2] / .remove(e) / for..in..if
Remove from an array

```python
array = ["Hello", "Everyone", "In", "The", "World", "!", "How", "Are", "You?"]

del array[5]
array #=> ["Hello", "Everyone", "In", "The", "World", "How", "Are", "You?"]

del array[0]
array #=> ["Everyone", "In", "The", "World", "How", "Are", "You?"]

del array[1:4]
array #=> ["Everyone", "How", "Are", "You?"]

# remove one element at a time
array = [1, 2, 3, 4, 5, 1, 2, 3, 4, 5]

array.remove(4) #=>
array #=> [1, 2, 3, 5, 1, 2, 3, 4, 5]

# remove all at once
array = [1, 2, 3, 4, 5, 1, 2, 3, 4, 5]

array = [x for x in array if x != 4]
array #=> [1, 2, 3, 5, 1, 2, 3, 5]

# and you can do multiple arguments this way as well
array = [x for x in array if x != 2 and x != 5]
array #=> [1, 3, 1, 3]
```

### callback / call/proc
Inherent to Python

```python
def double(n): return n*2

def triple(n): return n*3

def multi(n, type): return type(n)

multi(10, double) #=> 20

def multi_with_order(n, type, name):
  return "If we {} {} we'll get {}".format(name, n, type(n))

multi_with_order(5, double, "double") #=> "If we double 5 we'll get 10"
multi_with_order(5, triple, "triple") #=> "If we triple 5 we'll get 15"

def multi_twice(n, type1, type2): return type1(type2(n))

multi_twice(5, double, double) #=> 20
multi_twice(5, double, triple) #=> 30
multi_twice(5, triple, triple) #=> 45
multi_twice(5, triple, square) #=> 50
multi_twice(5, square, triple) #=> 100
```

Code on.

Mike Merin
