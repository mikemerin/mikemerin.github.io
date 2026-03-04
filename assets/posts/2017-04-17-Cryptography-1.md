---
layout: post
title: "Encrypt/Decrypt Your Own Ciphers"
date: 2017-04-17 13:58:14 -0400
tags: Cryptography, Ruby
series: Cryptography Code Along
summary: Code passwords and messages only you can make
---
Want a custom password only you know how to make? Want to write your own code to customize it even more? How about sending a coded message to another person to encrypt/decrypt yourselves?

![AES Encryption](http://www.youdeparted.com/images/aesencrypt.gif)

Well here's something you may not already realize: you use encryption every single day. Ever send a text or an email? Once those messages are sent they get encrypted automatically to make them look like a jumble of random characters. That is until the person you sent them to receives them, has them decrypted, and can read what you sent them. This way no one other than you two knows what you said!

I was gifted [The Code Book](simonsingh.net/books/the-code-book/) by Simon Singh over the holidays, and while the "code" in it meant ciphers and cryptography, like Morse Code or using code words, my mind right to the other type of "code" being programming. There were plenty of websites devoted to encrypting and decrypting various ciphers, but the fun is in doing it yourself. Ready to do that?

_Fair warning this will be a VERY long blog post because I'll be explaining things down to the tiniest detail for those just starting to code. My subsequent posts will be more direct, and if you have any questions you can just comment or message me for clarification. That being said I hope even those who are experts in Ruby will enjoy the process!_

# Cipher Types
---
Before we get into the ciphers themselves I'll cover the basic coding part first and then we'll kick it into high gear quickly. If you don't know anything about code then this will help you learn, and even if you're an expert pay attention so you can write your own complex encryptions. You may have heard of the following types of ciphers:

Caesar Cipher (shifting the alphabet down **x** letters)
![Caesar Cipher](https://cdn-images-1.medium.com/max/800/1*HcsFf4NRDUGKfT9SsTDCYg.png)

Rail-Fence Cipher (alternating lines, can either condense them or fill in the blanks)
![Rail Fence](http://crypto.interactive-maths.com/uploads/1/1/3/4/11345755/3703653.jpg)

Public-Key Cryptography (used in text messaging and emails)

![Public-Key Cryptography](https://docs.oracle.com/cd/E19528-01/819-0997/images/pcrypt.gif)

Let's start simple with a Monoalphabetic Cipher, which simply means we'll substitute one letter with another, e.g. A => B, B => C, etc. which looks like the Caeser Cipher above, but instead you can substitute **any** letter you want! If you've seen the puzzle section of the newspaper you may have noticed a cryptoquote puzzle which is in fact a Monoalphabetic Cipher.

![Cryptoquote](http://www.macon.com/living/53a09u/picture42207519/alternates/FREE_320/cryptoquote.JPG)

You may not have realized it but Morse Code is also one of these ciphers! In this case we're substituting a symbol or pattern with a letter:
 | A => .- | B => -... | C => -.-. | etc.

# Writing Your Encryption Program
---
So how would we write a program to convert, or "encrypt" letters into Morse Code? Well there are three words you'll want to keep in mind before we start: **hash**, **object**, and **iteration**. Don't worry these things are simple and I'll explain each of these as I go along.

In human terms we have to tell our program: “make A equal .- then make B equal -…“ and so on. A simple way to do this is to use what’s known as a **hash** which stores data like a dictionary. An example of what this looks like is:

```ruby
{ "Ruby" => "An object oriented language." }
```

So the word “ruby” is defined as “An object oriented language”. The association here is ***Word => Definition***, or more commonly known to programmers as ***Key => Value(s)***. Let’s take this even further and name this hash:

```ruby
my_dictionary = { "Ruby" => "An object oriented language." }
```

And just like that, `my_dictionary` is an **object** that stores this information! Great again, but how do we use it? Well it’s simple! We can pull information from the `my_dictionary` object like this:

```ruby
my_dictionary["Ruby"] #=> "An object oriented language."
```

We call the word *(key)* “Ruby” on the object `my_dictionary` and it outputs the desired definition *(value)*. Let’s do the same thing with Morse Code! Here’s our hash stored in an object:

```ruby
Morse_code = { "a" => ".-", "b" => "-...", "c" => "-.-.", "d" => "-..", "e" => ".", "f" => "..-.", "g" => "--.", "h" => "....", "i" => "..", "j" => ".---", "k" => "-.-", "l" => ".-..", "m" => "--", "n" => "-.", "o" => "---", "p" => ".--.", "q" => "--.-", "r" => ".-.", "s" => "...", "t" => "-", "u" => "..-",  "v" => "...-", "w" => ".--", "x" => "-..-", "y" => "-.--", "z" => "--..", " " => " ", "1" => ".----", "2" => "..---", "3" => "...--", "4" => "....-", "5" => ".....", "6" => "-....", "7" => "--...", "8" => "---..", "9" => "----.", "0" => "-----", "?" => "..--.." }
```

Now we can convert our letters by doing the following and calling:

```ruby
Morse_code["h"] #=> ....
Morse_code["e"] #=> .
Morse_code["l"] #=> .-..
Morse_code["l"] #=> .-..
Morse_code["o"] #=> ---
```

We’re basically calling the letter *(key)* on the object Morse_code to output the Morse Code symbols *(value)* for each letter!

# Iteration
___
Now the final problem: what if you have a sentence to convert? We don’t want to do this for *every single letter* right? That’d be tedious and unnecessary, so the next step is doing this is our final word we kept in mind from before: **iteration**. We’ll use a simple “while” statement first to do this before making the entire thing into a short one-line solution. Yes that's right, *one line*.

Here's a sneak peak of how that will look (don't worry if you don't understand this right now, you will by the end of this post)
```ruby
def to_Caesar(sentence)
    sentence.chars.map { |letter| Ceaser_cipher[letter] }.join
end
```

 Again don't worry if you don't know what's happening here because by the end of this post you'll be able to write this yourself! For now back to the basics: first let’s make our sentence into an object:
```ruby
sentence = "here is a sentence."
```
So let’s once again think about this in human terms:
1) Start at the first letter in the sentence
2) Convert that letter to Morse Code
3) Go to the next letter
4) Convert that letter to Morse Code
5) Keep doing this until we reach the end of the sentence.

Now the beautiful thing about code is that there are multiple ways to solve a problem! We’ll end with that short one-line solution, but in order to understand how to do it we’ll start with simple-yet-long way in the above steps:
1) Start at the first letter in the sentence

In programming we start counting at 0, not 1. Let’s set an object `index` equal to 0.
```ruby
index = 0
```
So now if we call the `index` on our sentence, we’ll get the first letter of “h”
```ruby
sentence[index] #=> “h”
```
2) Convert that letter to Morse Code

Now that we know how to call the sentence's index let’s call the letter “h” into our Morse_code object/hash:
```ruby
Morse_code[sentence[index]] #=> “....“
```
3) Go to the next letter
4) Convert that letter to Morse Code

It’s time for **iteration**! How do we go to the next letter? Well we have our `index` of 0 which is the first letter, let’s make that equal 1 which is the second letter. We can do this by:
```ruby
index = index + 1
# or the simpler and cleaner way:
index += 1
```
So now with `index` equal to 1 we can call the index on our sentence:
```ruby
sentence[index] #=> “e”
Morse_code[sentence[index]] #=> “.“
```
5) Keep doing this until we reach the end of the sentence.

How do we know we’ve reached the end of the sentence? There’s a neat thing we can do to figure out the length of our sentence:
```ruby
sentence.length #=> 18
# or
sentence.size #=> 18
```
So we know the length, or size of the sentence is 18 characters long. (side-note: “length” and “size” are the same thing. I prefer to use size which is shorter). So we basically have to say “until the index reaches 18, keep converting the letters to Morse Code,” or we can also say “while the index is less than the size of the sentence, keep converting the letters to Morse Code. We’d write both of these as:
```ruby
until index == sentence.size
# or
while index < sentence.size
```
And bringing it all together we’d write the entire while loop as:
```ruby
index = 0
while index < sentence.size
	puts Morse_code[sentence[index]]
	index += 1
end
```
This will put each letter on a new line. Let’s take this further though and store the Morse Code as a new sentence. We can make an object `morsed_sentence` and add each Morse Code letter to it:
```ruby
converted_sentence = ""
index = 0
while index < sentence.size
    converted_sentence += Morse_code[sentence[index]]
    index += 1
end
converted_sentence #=> "......-.. ..... .- ....-.-.-.-.-.."
```
Oops! While English letters can be read next to one another, Morse Code needs a space between each letter otherwise we can’t discern what they are. Let’s add that space to our code to fix this by using `+ " "` at the end of each letter:
```ruby
converted_sentence = ""
index = 0
while index < sentence.size
    converted_sentence += Morse_code[sentence[index]] + “ “
    index += 1
end
converted_sentence #=> ".... . .-. .   .. ...   .-   ... . -. - . -. -.-. ."
```
We can also do this using an **array**. Side-lesson: arrays stores information like this:
```ruby
array = ["here", "is", "an", "array"]
```
And we can push new things into the array by using push or a shovel `<<` operator:
```ruby
array.push("hooray!")
array #=> ["here", "is", "an", "array", "hooray"]
array << "for us!"
array #=> ["here", "is", "an", "array", "hooray", "for us!"]
```
Each element in the array is split up with a comma. We can use **join** to join them together:
```ruby
array.join #=> hereisanarrayhoorayforus!
```
And to take care of that pesky space we can use `join(" ")`
```ruby
array.join(" ") #=> here is an array hooray for us!
array.join("+") #=> here+is+an+array+hooray+for us!
array.join(" :) ") #=> here :) is :) an :) array :) hooray :) for us!
```
So let’s convert into Morse Code using arrays!
```ruby
converted_sentence = []
index = 0
while index < sentence.size
    converted_sentence << Morse_code[sentence[index]]
    index += 1
end
converted_sentence
#=> ["....", ".", ".-.", ".", " ", "..", "...", " ", ".-", " ", "...", ".", "-.", "-", ".", "-.", "-.-.", "."]
converted_sentence.join(“ “)
#=> ".... . .-. .   .. ...   .-   ... . -. - . -. -.-. ."
```
OK so I said there were three words to keep in mind but I’ll add another one into the mix: **method**. All this means is we’ll be putting all the above into something neat and tidy so we can run it all once. Let’s define our method as `convert_to_morse_code` and have it take in a sentence:
```ruby
def convert_to_morse_code(sentence)
    converted_sentence = []
    index = 0
    while index < sentence.size
        converted_sentence << Morse_code[sentence[index]]
        index += 1
    end
    return converted_sentence
end
```
The **method** `convert_to_morse_code` will return the converted sentence to us and we don’t have to copy down all those long steps every single time we want to convert something to Morse Code! We can simply do:
```ruby
convert_to_morse_code("here is a sentence")
#=> ".... . .-. .   .. ...   .-   ... . -. - . -. -.-. ."
convert_to_morse_code("simple right?")
#=> "... .. -- .--. .-.. .   .-. .. --. .... - ..--.. "
```
Another side-lesson: in a method you don’t actually have to put the word "return" down for the last line, a method will return the last value no matter what.

# One-line iteration
---
Now for some special iteration to make this a single line long. To know how to do this we need to know more words. Yes I originally said you’d have to know three at the start, and we got to four with **method**. Well that’s true for the simple stuff above, but we’re in the thick of it now and learning more complicated iterations.

First up is a **range** which is easy enough. If you want to go from 0 to 60, we’d use `(0..60)` where the `..` means range. In the case of our sentence which is 18 characters long we’d use:
```ruby
(0..sentence.size)
```
Here we’re going from 0 to 18, or `(0..18)`. Something’s wrong though: our sentence is 18 characters long, aka it has 18 characters in it, but If we call `sentence[18]` we’ll get nil. Why? Remember that in programming we start counting at 0 not 1, so even though in English we’d count the letters from 1 to 18, we’d have to count in code from 0 to 17. This means the final letter is at `sentence[17]` so we’d have to subtract one from the end of our range:
```ruby
(0..sentence.size - 1)
```
Or a fancy little trick is to use `...` instead of `..` for our range, which instead says "go up ***until*** the number". So `(0...18)` says "go from 0 up until 18", aka "0 to 17". We’d then be able to simply say:
```ruby
(0...sentence.size)
```
And not get `nil` or cause errors. As for iterating we’ll use `each`. Each basically says "go through each of these, then do whatever I want for each one". In this case: `(0...sentence.size).each` would go over each number from 0 to 17 in our sentence. We can then use blocks to tell the **each** to do something for us! We can do something fancy like this:
```ruby
(0...6).each do |number|
    print number
end
#=> 012345

# or the simpler and cleaner:
(0...6).each { |number| print number } #=> 012345
```
The `|number|` is the each individual thing we want to go through, in this case the numbers 0 then 1 then 2 etc. We the `do` and `end`, or the curly brackets `{}` surround what we want to run each of those individual things, and is called a **block**. All together in the example above we go through each number in the range of `(0..6)` to prints out each number.

So with this all in mind let’s write our one-liner using our previous code!
```ruby
def to_morse_code(sentence)
    morsed_sentence = []
    (0...sentence.size).each { |index| morsed_sentence << Morse_code[sentence[index]] }
    morsed_sentence.join(" ")
end

to_morse_code("here is a sentence")
#=> ".... . .-. .   .. ...   .-   ... . -. - . -. -.-. ."
```
But wait that’s three lines, not one! Well we can use `map` or `collect` (same thing) instead of `each`, which maps/collects the values and changes them all at once we can finally do our one-liner:
```ruby
def to_morse_code(sentence)
    (0...sentence.size).map { |index| Morse_code[sentence[index]] }.join(" ")
end
```
Horray! Oh right we can make this even simpler: instead of iterating from 0 to 17, let’s just call `each` on the sentence itself! We can split up the sentence’s characters into an array by using `split("")` or `chars`:
```ruby
"hi there".split #=> ["hi", "there"]

"hi there".split("") #=> ["h", "i", " ", "t", "h", "e", "r", "e"]
"hi there".chars #=> ["h", "i", " ", "t", "h", "e", "r", "e"]
```
And then we can iterate over `sentence.chars`  like this:
```ruby
def to_morse_code(sentence)
    sentence.chars.map { |letter| Morse_code[letter] }.join(" ")
end
```
This is less code we’ll have to write! And now that we’ve written this, here’s the fun thing: because Morse Code is a Monoalphabetic Cipher we can now use this code for ANY of those ciphers! A Caeser Cipher shifts all the letters down, so if we did that by one letter:
```ruby
Caesar_cipher = { "a" => "b", "b" => "c", "c" => "d", "d" => "e", "e" => "f", "f" => "g", "g" => "h", "h" => "i", "i" => "j", "j" => "k", "k" => "l", "l" => "m", "m" => "n", "n" => "o", "o" => "p", "p" => "q", "q" => "r", "r" => "s", "s" => "t", "t" => "u", "u" => "v",  "v" => "w", "w" => "x", "x" => "y", "y" => "z", "z" => "a", " " => " " }

def to_Caesar(sentence)
    sentence.chars.map { |letter| Ceaser_cipher[letter] }.join
end

to_Caesar("here is a sentence") #=> "ifsf jt b tfoufodf"
```
Or how about an Atbash Cipher which reverses A and Z, B and Y, C and X, and so on?
```ruby
Atbash_cipher = { "a" => "z", "b" => "y", "c" => "x", "d" => "w", "e" => "v", "f" => "u", "g" => "t", "h" => "s", "i" => "r", "j" => "q", "k" => "p", "l" => "o", "m" => "n", "n" => "m", "o" => "l", "p" => "k", "q" => "j", "r" => "i", "s" => "h", "t" => "g", "u" => "f",  "v" => "e", "w" => "d", "x" => "c", "y" => "b", "z" => "a", " " => " " }

def to_atbash(sentence)
    sentence.chars.map { |letter| atbash_cipher[letter] }.join(" ")
end

to_atbash(“here is a sentence”) #=> "sviv rh z hvmgvmxv"
```
Fun fact: running an Atbash Cipher twice returns the same thing! A => Z => A
```ruby
to_atbash(to_atbash((“here is a sentence”)) #=> "here is a sentence"
```
And so on and so on with any type of Monoalphabetic Cipher you can think of.

# Decrypting
---
So we can encrypt each message, great! But we now can't read them so how to you *decrypt* what was encrypted? Well since we're using a Monoalphabetic Cipher which simply replaces a letter with another it's easy! We did A => B before for our Caesar Cipher, so let's just `invert` that into saying We'll just reverse the replacement process by inverting our hash so that instead of say, A => B we'll switch them to B => A. How do you do this? You probably guessed it already: use `invert`!
```ruby
Caesar_cipher.invert = { "b"=>"a", "c"=>"b", "d"=>"c", "e"=>"d", "f"=>"e", "g"=>"f", "h"=>"g", "i"=>"h", "j"=>"i", "k"=>"j", "l"=>"k", "m"=>"l", "n"=>"m", "o"=>"n", "p"=>"o", "q"=>"p", "r"=>"q", "s"=>"r", "t"=>"s", "u"=>"t", "v"=>"u", "w"=>"v", "x"=>"w", "y"=>"x", "z"=>"y", "a"=>"z", " " => " " }

# our encrypting/decrypting methods:

def to_Caesar(sentence)
    sentence.chars.map { |letter| Caesar_cipher[letter] }.join
end

def from_Caesar(sentence)
    sentence.chars.map { |letter| Caesar_cipher.invert[letter] }.join
end

encrypted_message = to_Caesar("et tu brute") #=> "fu uv csvuf"
from_caesar(encrypted_message) #=> "et tu brute"
from_Caesar(to_Caesar("et tu brute")) #=> "et tu brute"
```
With some slight modifications we can even convert Morse Code back to English! Use `invert` to invert our `Morse_code` object/hash:
```ruby
Morse_code.invert #=> {".-"=>"a", "-..."=>"b", "-.-."=>"c", "-.."=>"d", "."=>"e", "..-."=>"f", "--."=>"g", "...."=>"h", ".."=>"i", ".---"=>"j", "-.-"=>"k", ".-.."=>"l", "--"=>"m", "-."=>"n", "---"=>"o", ".--."=>"p", "--.-"=>"q", ".-."=>"r", "..."=>"s", "-"=>"t", "..-"=>"u", "...-"=>"v", ".--"=>"w", "-..-"=>"x", "-.--"=>"y", "--.."=>"z", " "=>" ", ".----"=>"1", "..---"=>"2", "...--"=>"3", "....-"=>"4", "....."=>"5", "-...."=>"6", "--..."=>"7", "---.."=>"8", "----."=>"9", "-----"=>"0", "..--.."=>"?"}

def from_morse_code(sentence)
    sentence.split.map { |letter| Morse_code.invert[letter] }.join(" ")
end

from_morse_code(".... . .-. .   .. ...   .-   ... . -. - . -. -.-. .") #=> "h e r e i s a s e n t e n c e"
```
We understand this even with the spacing issues that we get since our Morse Code converting adds spaces, but Ruby splits up based on any number of spaces, so with a quick modification:
```ruby
def from_morse_code(sentence)
    words = sentence.split("   ") #=> [".... . .-. .”, “.. ...”, “.-“, “... . -. - . -. -.-. ."]
    words.map { |word| word.split(" ").map { |letter| Morse_code.invert[letter] }.join }.join(" ")
end
```
Basically we break apart the spaces into words:

```ruby
[".... . .-. .”, “.. ...”, “.-“, “... . -. - . -. -.-. ."]
```

Then again into individual letters:

```ruby
[["....", ".", ".-.", "."], ["..", "..."], [".-"], ["...", ".", "-.", "-", ".", "-.", "-.-.", "."]]
```

We basically convert each letter to Morse Code, join up the letters directly, and then join up the words with a space. Like I said before, there’s always a different way to make all of these codes work with programming. We can also use **gsub** to make it look neater (replace one character with another). Another example with the Atbash Cipher we can convert each letter to its ASCII number, change it, and convert it back to a letter:
```ruby
“hello”.chars.map { |x| ((27-(x.ord - 96))+96).chr }.join #=> "znzav"
```
We can use **regex** to scan for which letters we want to change and return:
```ruby
“hello”.scan(/[a-z]/).map { |x| ((27-(x.ord - 96))+96).chr }.join #=> "znzav"
```
And we can modify it to only run Atbash on letters (ignoring things like punctuation or spaces)
```ruby
sentence.chars.map { |x| ("a".."z").include?(x) ? ((27-(x.ord - 96))+96).chr : x }.join
```
# Easy creation of hashes
---
Since a Caesar Cipher is simply shifting the alphabet, we can create our hash using rotate and zip without having to painstakingly do it ourselves! We use `zip` to literally zip together two arrays into a hash. Think of a zipper with the left side going ABC and the right side going 123. When you pull up the zipper, they interlock going from left to right sort of like this:

ABC zipped with 123 #=> A1 B2 C3

In Ruby it looks like this:
```ruby
["A", "B", "C"].zip([1, 2, 3]) #=> [ ["A", 1], ["B", 2], ["C", 3] ]
```
And then we can make that into a hash by using `to_h` or calling `Hash` on it:
```ruby
["A", "B", "C"].zip([1, 2, 3]).to_h #=> { "A" => 1, "B" => 2, "C" => 3 }
# or
Hash[ ["A", "B", "C"].zip([1, 2, 3] ] #=> { "A" => 1, "B" => 2, "C" => 3 }
```
Now let's do this for the entire alphabet all at once, using `rotate` to our advantage, which literally rotates the entire array from right to left (shifts the first element(s) and pushes it onto the end):
```ruby
[1, 2, 3, 4, 5].rotate    #=> [2, 3, 4, 5, 1]
[1, 2, 3, 4, 5].rotate(2) #=> [3, 4, 5, 1, 2]

alphabet = ("a".."z").to_a
Hash[alphabet.zip(alphabet.rotate(1))] #=> {"a"=>"b", "b"=>"c", "c"=>"d", etc. }
Hash[alphabet.zip(alphabet.rotate(2))] #=> {"a"=>"c", "b"=>"d", "c"=>"e", etc. }
```
And yes that’s right, we can use other things like reverse to recreate Atbash:
```ruby
Hash[alphabet.zip(alphabet.reverse)] #=> {"a"=>"z", "b"=>"y", "c"=>"x", etc. }
```
The possibilities are endless:
```ruby
lowercase = ("a".."z").to_a
uppercase = ("A".."Z").to_a
Hash[(lowercase + uppercase).zip((1..52).to_a)] #=> {"a"=>1, "b"=>2, … "Z"=>52}
```
Letters to their numbers?
```ruby
numbers = (1..26).to_a
Hash[alphabet.zip(numbers)] #=> {"a"=>1, "b"=>2, "c"=>3, etc. }

binary = (1..26).map { |x| x.to_s(2).to_i }
Hash[alphabet.zip(binary)] #=> {"a"=>1, "b"=>10, "c"=>11, "d"=>100, etc. }
```
And just like before with any of these, we’d simply call upon any of these hashes to encrypt our alphabet with our custom Monoalphabetic Ciphers, or decrypt them back!

Lastly if you're wondering how to add items to your hashes, while an **array** works by using the shovel `<<` or pushing, for a hash simply do this:
```ruby
my_hash = { "a" => 1, "b" => 2 }
my_hash["c"] = 3
my_hash #=> { "a" => 1, "b" => 2, "c" => 3 }
```
Again sorry for this long post; next time I’ll get right to the chase without this in-depth tutorial to cover how to code some more complex ciphers like the Rail Fence and the revolutionary Vigenère Cipher, also known as le chiffre indéchiffrable (the indecipherable cipher) which was unbroken for over 300 years!

Let me know if you have any questions. Happy encrypting!

Code on.

Mike Merin
