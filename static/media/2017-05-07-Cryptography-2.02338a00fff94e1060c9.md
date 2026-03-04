---
layout: post
title: "Creating Polyalphabetic Ciphers"
date: 2017-05-07 15:32:42 -0400
tags: Cryptography, Ruby
series: Cryptography Code Along
summary: Make hard to decrypt code and how to decrypt it
---
In my last post we talked about making your own Monoalphabetic Cipher using Ruby (view that if you don't understand what's happening below). To summarize, we created a Caesar Cipher by shifting all letters forward by one letter:

```ruby
# create the alphabet array:
alphabet = ("a".."z").to_a
```
```ruby
# turn the alphabet into a hash, and keep punctuation from changing by appending it to the hash (using merge)
punctuation = {" "=>" ", ","=>",", "."=>".", "?"=>"?","'"=>"'",'"'=>'"'}
Caesar_cipher = Hash[ alphabet.zip( alphabet.rotate(1) )]
Caesar_cipher.merge!(punctuation)
# output => { "a"=>"b", "b"=>"c", "c"=>"d", "d"=>"e", "e"=>"f", "f"=>"g", "g"=>"h", "h"=>"i", "i"=>"j", "j"=>"k", "k"=>"l", "l"=>"m", "m"=>"n", "n"=>"o", "o"=>"p", "p"=>"q", "q"=>"r", "r"=>"s", "s"=>"t", "t"=>"u", "u"=>"v",  "v"=>"w", "w"=>"x", "x"=>"y", "y"=>"z", "z"=>"a", " "=>" ", ","=>",", "."=>".", "?"=>"?","'"=>"'",'"'=>'"' }
```
```ruby
def to_caesar(sentence)
    sentence.chars.map { |letter| Ceaser_cipher[letter] }.join(" ")
end

to_caesar("here is a sentence") #=> "ifsf jt b tfoufodf"
```
But remember, from a cryptography standpoint, since this is a Monoalphabetic Cipher it can decrypted easily by substituting the letters one by one. If we reverse the step above:
```ruby
Caesar_cipher.invert #=> { "b"=>"a", "c"=>"b", "d"=>"c", "e"=>"d", "f"=>"e", "g"=>"f", "h"=>"g", "i"=>"h", "j"=>"i", "k"=>"j", "l"=>"k", "m"=>"l", "n"=>"m", "o"=>"n", "p"=>"o", "q"=>"p", "r"=>"q", "s"=>"r", "t"=>"s", "u"=>"t", "v"=>"u", "w"=>"v", "x"=>"w", "y"=>"x", "z"=>"y", "a"=>"z", " " => " " }

def from_Caesar(sentence)
    sentence.chars.map { |letter| Caesar_cipher.invert[letter] }.join
end

encrypted_message = to_Caesar("et tu brute") #=> "fu uv csvuf"
from_caesar(encrypted_message) #=> "et tu brute"
from_Caesar(to_Caesar("et tu brute")) #=> "et tu brute"
```

This wouldn't be a good way to encrypt a message or a password since people can easily decrypt it (remember, Cryptoquotes in a puzzle section of the newspaper are just Monoalphabetic Ciphers). So let's move onto the next evolution in ciphers: a **Poly**alphabetic Cipher!
# The Polyalphabetic Cipher
---

Let's go through some keywords first to make this easier:
 + **plaintext**: the unencrypted text you type in
 + **key**: how you encrypt your plaintext, usually a codeword
 + **ciphertext**: the encrypted text

So what is a Polyalphabetic Cipher? Well instead of using **one** shift applied to all letters (*mono*), we'll be using **multiple** shifts (*poly*). Let's compare the two with the same plaintext of "AAAAAAAAA". In a Monoalphabetic Cipher a shift of 1 would make our **ciphertext** "BBBBBBBBBB", so our **key** would be the single (*mono*) letter "B", aka what the letter "A" turns into:
```ruby
key = "B"
plaintext_1 = "AAAAAAAAAA"
ciphertext_1 = "BBBBBBBBB"

plaintext_2 = "Hello world, how are you?"
ciphertext_2 = "Ifmmp xpsme, ipx bsf zpv?"
```
However in a Polyalphabetic Cipher our **key** isn't a single letter but multiple (*poly*) letters! If we had a key of "BCD", we'd shift the first letter by 1, the second letter by 2, third by 3, then repeat until our entire message is encrypted.

```ruby
key = "BCD"
plaintext_1 = "AAAAAAAAAA"
ciphertext_1 = "BCDBCDBCDB"

plaintext_2 = "Hello world, how are you?"
ciphertext_2 = "Igomq xqumf, iqz cuf bpw?"
```

Pretty easy to grasp right? While the execution is slightly more complex we still can picture how this works. Let's walk through the questions we should think about:
1) How do we code this? Can our prior Monoalphabetic Cipher code help us out?
2) Why did this cipher take 300 years to break? Is it really that much harder to decrypt?

# Coding our cipher
---
Let's tackle the first question: coding the Polyalphabatic Cipher and using our prior code to our advantage. Once again I'll start off with a step-by-step (though not as in depth as the last post) before we make some clean and brief looking code. The name of this revolutionary cipher is called a *Vigenère Cipher*, also known as le chiffre indéchiffrable (the indecipherable cipher).

Once again in out example above, the plaintext we used was "AAAAAAAAAA", the key was "BCD" (B = 1 shift, C = 2, D = 3), and the ciphertext obtained after we applied the key was "BCDBCDBCDB". So if we think about this in code:

```ruby
alphabet = ("a".."z").to_a
Key_B = Hash[ alphabet.zip( alphabet.rotate(1) )]
# => { "a" => "b", "b" => "c", "c" => "d", "d"=>"e"....etc}
Key_C = Hash[ alphabet.zip( alphabet.rotate(2) )]
# => { "a" => "c", "b" => "d", "c" => "e", "d"=>"f"....etc}
Key_D = Hash[ alphabet.zip( alphabet.rotate(3) )]
# => { "a" => "d", "b" => "e", "c" => "f", "d"=>"g"....etc}
```
We'd like our code to do something like this:
1) If it's the 1st/4th/7th/etc. letter then use Key_B
2) If it's the 2nd/5th/8th/etc. letter then use Key_C
3) If it's the 3rd/6th/9th/etc. letter then use Key_D

We'll use a **modulo** here to figure out the letter's position. A modulo gives the remainder after you divide a number. For example `3 / 3 = 0` divides in evenly and has 0 remaining after you divide, but `5 / 3 = 1.66` doesn't divide evenly. We can rewrite this as `5 / 3 = 1 + 2/3` so it divides with a remainder of 2. If we use modulos we can direclty get the remainder: `5 % 3 = 2`.

Since our key "ABC" is 3 letters we'll modulo by 3. Remember that in code we start our counting at 0, so expanding on the above:
```ruby
"If our letter is at index 0/3/6 etc. then use Key_B"
Key_B[letter] if index % 3 == 0
Key_B["H"] #=> I
```
```ruby
"If our letter is at index 1/4/7 etc. then use Key_C"
Key_C[letter] if index % 3 == 1
Key_C["e"] #=> g
```
```ruby
"If our letter is at index 2/5/8 etc. then use Key_D"
Key_D[letter] if index % 3 == 2
Key_D["l"] #=> o
```
With this knowledge, there's two things we need to know before we can make our iteration work: **.with_index** and **case**. You already know about **each** and **map** which lets us iterate through each character one by one, but we only get the letter and not the index as we need above. In the last post we started off by doing `(0..sentence.size)` to get our index numbers, but that's messy. If we simply do `each.with_index` or `map.with_index` we can now use the letter along with the index as we iterate! A quick note that `each_with_index` works but `map_with_index` doesn't. We'll make the start of our iteration look like this:
```ruby
sentence.chars.map.with_index do |letter, index|
```
So for every `letter` we have its `index` at our disposal. Next up is our **case** statement. You can think of this like a more clean **if/elsif/else**. These two do the exact same thing:
```ruby
if index % 3 == 0
    Key_B[letter]
elsif index % 3 == 1
    Key_C[letter]
elsif index % 3 == 2
    Key_D[letter]
end

case index % 3
    when 0
        Key_B[letter]
    when 1
        Key_C[letter]
    when 2
        Key_D[letter]
end
```
It's much easier to read as we're not repeating `index % 0` every time. We can further condense these by replacing the line breaks with a semi-colon:
```ruby
if index % 3 == 0; Key_B[letter]
elsif index % 3 == 1; Key_C[letter]
elsif index % 3 == 2; Key_D[letter]
end

case index % 3
    when 0; Key_B[letter]
    when 1; Key_C[letter]
    when 2; Key_D[letter]
end
```
Case is still the winner. So let's combine the two to make our cipher, adding a little twist at the end:
```ruby
def vigenere(sentence)
    sentence.chars.map.with_index do |letter, index|
        case index % 3
            when 0; Key_B[letter]
            when 1; Key_C[letter]
            when 2; Key_D[letter]
        end
    end.join.upcase
end

vigenere("hello world how are you?") #=> IGOMQXQUMFIQZCUFBPW
```
You'll notice I took away spaces, didn't add punctuation, and made it all uppercase. If we don't have spaces we make our cipher even harder to break, and the uppercase simply makes it easier to read. When we have the key at our disposal and decrypt the message we'll get: `HELLOWORLDHOWAREYOU`. Even though it doesn't have spaces or punctuation we can still read it, but that won't help for a jumble of letters for those who don't have a key, so our cipher is more secure!
# Making this simpler
---
If it's not obvious already, this isn't the best way by far to make our cipher work. I made mine like this for the time being so you can understand how it works, but there are many problems with it. Let's ask ourselves 5 questions:
1) We'd have to make a new `Key_#[letter]` for every letter in the alphabet
2) Even if we had a new `Key_#[letter]` for each of the 26 letters, our code would be VERY long
3) Is a case statement really the best way to do this if we start iterating?
4) What's the best way for us to define a key?
5) Our code isn't modular for any key length (it only works for 3 letter keys)

So how do we fix these? Let's go down the list one by one!
> 1 - We'd have to make a new `Key_#[letter]` for every letter in the alphabet

Once again iteration is our friend; let's think back to our original hash creation of the alphabet with a slight change:

```ruby
def rotation(x)
    Hash[ alphabet.zip( alphabet.rotate(x) ) ]
end
```
Notice that we have a `rotation(x)` method, and instead of having `rotate(1)` or `rotate(2)` etc. hard-coded in each time, we now have a value `x` we can change freely. In essence, if our Key was "B" we'd rewriting `Key_B[letter]` as `rotation(1)[letter]`, both of which do ` #=> Hash[ Alphabet.zip( Alphabet.rotate(1))][letter]`.

Before we get to customizing this let's simply hard-code this to visualize it:
```ruby
def rotation(x) Hash[ alphabet.zip( alphabet.rotate(x) ) ] end

def vigenere(sentence)
    sentence.upcase.chars.map.with_index do |letter, index|
        case index % 3
            when 0; rotation(1)[letter] # same as Key_B[letter]
            when 1; rotation(2)[letter] # same as Key_C[letter]
            when 2; rotation(3)[letter] # same as Key_D[letter]
        end
    end.join.upcase
end

vigenere("hello world how are you?") #=> "IGOMQXQUMFIQZCUFBPW"
```
> 2 - Even if we had a new `Key_#[letter]` for each of the 26 letters, our code would be VERY long

This is all great, but how can we tell our program to know that `A = rotate(0)` or `B = rotate(1)` without having to make a new line for each letter/rotation? Think back to the last post, what did we create near the end? We made a Monoalphabetic Cipher where letters pointed to a number! Let's zip up an uppercase alphabet with the numbers 0 to 25:
```ruby
Alphabet = ("A".."Z").to_a
Key_to_num = Hash[ Alphabet.zip( (0..25).to_a ) ]
#=> {"A"=>0, "B"=>1, "C"=>2, "D"=>3, "E"=>4, etc }
```

Why all this work? You'll notice that even though we turned something like `Key_B[letter]` into `rotation(1)[letter]` we'd still need to have a new line for each `when` in our case statement. Let's fix that with our `Key_#[letter]` trick:
```ruby
rotation(1)[letter]
# We can turn the 1 in this to the Key_to_num[letter] right?
Key_to_num["B"] = 1
# therefore

rotation(        1        )[letter]
rotation( Key_to_num["B"] )[letter]
```
Putting it together:
```ruby
def rotation(x)
    Hash[ alphabet.zip( Alphabet.rotate(x) ) ]
end

def vigenere(sentence)
    sentence.upcase.chars.map.with_index do |letter, index|
        case index % 3
            when 0; rotation(Key_to_num["B"])[letter]
            when 1; rotation(Key_to_num["C"])[letter]
            when 2; rotation(Key_to_num["D"])[letter]
        end
    end.join.upcase
end
```
There's still some repetition here though and it's getting a bit messy, so let's move our `Key_to_num` object into our `rotation(x)` helper method, and finally make those objects lowercase (it's generally not good to make your own uppercase objects since they can mistakenly overwrite existing ones like `Hash` or if you have a bigger program they can overwrite other ones you wrote, same thing with global variables, just don't do it).
```ruby
def rotation(x)
    alphabet = ("A".."Z").to_a
    key_to_num = Hash[ alphabet.zip( (0..25).to_a ) ]
    Hash[ alphabet.zip( alphabet.rotate( key_to_num[x] ) ) ]
end

def vigenere(sentence)
    sentence.upcase.chars.map.with_index do |letter, index|
        case index % 3
            when 0; rotation("B")[letter]
            when 1; rotation("C")[letter]
            when 2; rotation("D")[letter]
        end
    end.join.upcase
end
```
Hey we're back to having a letter being taken into our rotation method! Funny how that worked right? This is important for a reason which you'll see shortly.
> 3 - Is a case statement really the best way to do this if we start iterating?

We're almost there! This is a good question, and the answer is ***NO!*** When we start iterating we no longer need to use a case statement! It technically still works but there ends up not being a need for it. Let's think about it this way:
```ruby
rotation("B")[letter] # first do this
rotation("C")[letter] # then do this
rotation("D")[letter] # lastly do this
# and repeat until you reach the end of the sentence
```
We keep talking about our **key** of "BCD" but all we've been doing so far is hard-coding in our "B" then "C" then "D". Let's actually make an object `key = "BCD"` and iterate over it! We'd  like this:
```ruby
key = "BCD"
index = 0
# convert key[0] (which is "B")
rotation( key[index] )[letter] # which is
rotation(     "B"    )[letter]
# then add 1 to the index
rotation( key[index] )[letter] # which is
rotation(     "C"    )[letter]
# and add another one to the index (2), when you get to 3 reset it to 0
```
A neat trick for making our iteration repeat from 0-2, 0-2, etc. is to once again use the modulo operator:
```ruby
index = -1
index = (index + 1) % 3 #=> 0 % 3 becomes 0
index = (index + 1) % 3 #=> 1 % 3 becomes 1
index = (index + 1) % 3 #=> 2 % 3 becomes 2
index = (index + 1) % 3 #=> 3 % 3 becomes 0
```
Notice we start at -1 so the first time we trigger the modulo equation it becomes 0 (you'll see why we don't start at 0 shortly). So with this information in our hands, let's take down points 2 and 3!
```ruby
def rotation(x)
    alphabet = ("A".."Z").to_a
    key_to_num = Hash[ alphabet.zip( (0..25).to_a ) ]
    Hash[ alphabet.zip( alphabet.rotate( key_to_num[x] ) ) ]
end

def vigenere(sentence)
    key = "BCD"
    index = -1
    sentence.upcase.chars.map do |letter|
        index = (index + 1) % 3
        rotation(key[index])[letter]
    end.join
end

vigenere("hello world how are you?") #=> "IGOMQXQUMFIQZCUFBPW"
```
Still works! By the way when you use **map** it will output the last line in the iteration, hence why we have our `index = (index + 1) % 3` starting at -1 since we need to trigger it *before* the rotation method.
> 4 - What's the best way for us to define a key?

These last two steps are actually the easiest and shortest! Right now we have "BCD" defined as our key inside our vigenere method, but why don't we have the user put in the key just like they put in the sentence? That way it's the user telling us what key they want to use:
```ruby
def vigenere(sentence, key)
    index = -1
    sentence.upcase.chars.map do |letter|

        index = (index + 1) % 3
        rotation(key[index])[letter]

    end.join
end
vigenere("hello world how are you?", "BCD") #=> "IGOMQXQUMFIQZCUFBPW"
vigenere("hello world how are you?", "HEY") #=> "OIJSSDSPSHOSUEPLWVY"
vigenere("hello world how are you?", "KEY") #=> "RIJVSGSPVHRSUEPOWYY"
```
> 5 - Our code isn’t modular for any key length (it only works for 3 letter keys)

Last step! It's great that I now have the user input their own key, but as the 5th question states: it only works for 3 letter keys, so how do we change our code? Well where's the only place there's a 3? That's right the index modulo part! Now that `key` is an instance the user puts in, we'll just change this:
```ruby
index = (index + 1) % 3
# to
index = (index + 1) % key.size
```
All together:
```ruby
def rotation(x)
    alphabet = ("A".."Z").to_a
    key_to_num = Hash[ alphabet.zip( (0..25).to_a ) ]
    Hash[ alphabet.zip( alphabet.rotate( key_to_num[x] ) ) ]
end

def vigenere(sentence, key)
    index = -1
    sentence.upcase.chars.map do |letter|
        index = (index + 1) % key.size
        rotation(key[index])[letter]
    end.join
end
vigenere("hello world how are you?", "AMAZING") #=> "HQLKWCODLCUUWAQMEOG"
```
One quick thing before we continue, we only want letters to be encrypted and decrypted right? So let's switch out `chars` for a simple regular expression (regex) to only iterate over letters:
```ruby
sentence.upcase.chars.map do |letter|
# becomes
sentence.upcase.scan(/[A-Z]/).map do |letter|
```
This will prevent some mishaps from happening, especially when we try decrypting this message. Anyways hooray we completed our Vigenère Cipher!
# Decrypting our Vigenère Cipher
---
Obviously it's not as simple to write our code to decrypt a Polyalphabetic Cipher as it is a Monoalphabetic one. Just kidding, we just have to change one thing from the code we already wrote. Before I reveal it though think about this:

We can't simply invert our hash, or our key, we have to invert *each* key's letter once at a time. If we do we'll get even more of a jumble, so how do we do that? Let's think about this:
* forwards:
  * plaintext = "hey"
  * key = "B" #=> { "a"=>"b", "b"=>"c" etc. }
  * ciphertext = "ifz"
* reverse:
  * ciphertext = "ifz"
  * key = "B" inverted #=> { "a"=>"z", "b"=>"a" etc. }
  * plaintext = "hey"

So let's go to those two Hashes we used in our `rotation(x)` method, specifically at the `key_to_num` object. Why? Normally if our key is "B" we'd be shifting a letter up by one, but if we're deciphering we'll be shifting the letter ***down*** by one. There are multiple ways to do this but I'll go through two of them. The first is easier to understand, but the second is what we'll actually use.

#### Method 1:
Basically, instead of going from 0 up to 25 which we have as our `(0..25)` range also known as `(0.upto(25))`:
```ruby
Hash[ alphabet.zip( (0..25).to_a ) ]
# also done with "upto" as
Hash[ alphabet.zip( (0.upto(25)).to_a ) ]
{ "A" => 0, "B" => 1, "C" => 2, "D" => 3 etc.}
```
We'll instead go from 0 **down to** -25:
```ruby
Hash[ alphabet.zip( (0.downto(-25)).to_a ) ]
{ "A" => 0, "B" => -1, "C" => -2, "D" => -3 etc.}
```
Changing this code we'll get:
```ruby
def reverse_rotation(x)
    alphabet = ("A".."Z").to_a
    key_to_num = Hash[ alphabet.zip( (0.downto(-25)).to_a ) ]
    Hash[ alphabet.zip( alphabet.rotate( key_to_num[x] ) ) ]
end
```
#### Method 2:
This time we'll work off of the second Hash. When we zip our numbers we'll simply negate them! This works by just making our rotations negative instead of positive:
```ruby
Hash[ alphabet.zip( alphabet.rotate( key_to_num[x] ) ) ]
{ "A" => 0, "B" => 1, "C" => 2, "D" => 3 etc.}
# reverse with one simple trick!
Hash[ alphabet.zip( alphabet.rotate( key_to_num[x] * -1 ) ) ]
{ "A" => 0, "B" => -1, "C" => -2, "D" => -3 etc.}
```
Changing this code we'll get:
```ruby
def reverse_rotation(x)
    alphabet = ("A".."Z").to_a
    key_to_num = Hash[ alphabet.zip( (0.upto(25)).to_a ) ]
    Hash[ alphabet.zip( alphabet.rotate( key_to_num[x] * -1 ) ) ]
end
```
And putting it all together:

```ruby
ciphertext = vigenere("hello world how are you?", "AMAZING") #=> "HQLKWCODLCUUWAQMEOG"

def reverse_rotation(x)
    alphabet = ("A".."Z").to_a
    key_to_num = Hash[ alphabet.zip( (0.upto(25)).to_a ) ]
    Hash[ alphabet.zip( alphabet.rotate( key_to_num[x] * -1 ) ) ]
end

def decrypt_vigenere(sentence, key)
    index = -1
    sentence.upcase.scan(/[A-Z]/).map do |letter|
        index = (index + 1) % key.size
        reverse_rotation(key[index])[letter]
    end.join
end

decrypt_vigenere(ciphertext, "AMAZING") #=> "HELLOWORLDHOWAREYOU"
```
Easy enough!
# That's a lot of methods...
---
I'm not satisfied though, there's so much repeated code between encryption and decryption with the four separate methods, so let's change our vigenere method around to do both at once! Basically what we want to is four things here:
1) Merge our `vigenere` and `decrypt vigenere` methods
2) Merge our `rotation` and `reverse_rotation` methods

Let's do this quickly; I already have over 3000 words for this post.
>1 - Merge our `vigenere` and `decrypt vigenere` methods

Simple fix: in addition to having our vigenere method take in a sentence and key, we'll also have it take in an encryption type, or `type` for short, then choose to do a rot:
```ruby
def vigenere(sentence, key, type)
    index = -1
    sentence.upcase.scan(/[A-Z]/).map do |letter|
        index = (index + 1) % key.size
        rotation(key[index])[letter]
    end.join
end
```
Note that we *could* make an if statement for the rotation based on encryption type (if "encrypt" then rotation, elsif "decrypt" then r_rotation), but we'll fix that with the next step and actually USE the `type` instance we added:
>2 - Merge our `rotation` and `reverse_rotation` methods

Method 1: rotation vs. reverse_rotation
```ruby
key_to_num = Hash[ alphabet.zip( (0.upto(25)).to_a ) ]
key_to_num = Hash[ alphabet.zip( (0.downto(-25)).to_a ) ]
```

Look at method 1 above, what's the difference there? `(0.upto(25))` and `0.downto(-25)`. That's *two* things to change, the up/down and the +/- 25, and making the upto and downto flexible isn't as straightforward as what's next:

Method 2: rotation vs. reverse_rotation
```ruby
Hash[ alphabet.zip( alphabet.rotate( key_to_num[x] ) ) ]
Hash[ alphabet.zip( alphabet.rotate( key_to_num[x] * -1 ) ) ]
```

Look at method 2 above, what's the difference there? Just the `* -1` right? Think about it this way:
```ruby
key_to_num[x] == key_to_num[x] * 1
```
So let's have our rotation method take in the `type` from our vigenere method, and if it's "encrypt" we'll make it positive 1 and if it's negative it'll be negative 1. Let's set an object `sign` to it (think plus or minus sign)
```ruby
if type == "encrypt"
    sign = 1
elsif type == "decrypt
    sign = -1
end
```
That's a bit sloppy so I'll use a ternary operator instead. Also since our rotation method is now `def rotation(x, type)` we'll finally add the `type` to our vigenere method:
```ruby
rotation( key[index]       )[letter] # becomes
rotation( key[index], type )[letter]
```
Bringing it all together:
```ruby
def rotation(x, type)
    alphabet = ("A".."Z").to_a
    key_to_num = Hash[ alphabet.zip( (0.upto(25)).to_a ) ]
    sign = (type == "encrypt" ? 1 : -1)
    Hash[ alphabet.zip( alphabet.rotate( key_to_num[x] * sign ) ) ]
end

def vigenere(sentence, key, type)
    index = -1
    sentence.upcase.scan(/[A-Z]/).map do |letter|
        index = (index + 1) % key.size
        rotation(key[index], type)[letter]
    end.join
end

message = vigenere("hello world how are you?", "AMAZING", "encrypt") #=> "HQLKWJURXDGWJGRQYNC"
vigenere(message, "AMAZING", "decrypt") #=> "HELLOWORLDHOWAREYOU"
```
Finally done with our methods! And with that a question, are these methods be best way to do this?

NO!

Not by a long shot. First off we can create a Vigenere Cipher so much cleaner with less code, but also it's a hassle to type in our message each time along with our key and encryption type. The fix:
```ruby
class Cipher
```
Which I'll cover next time.
# Takeaways
---
In addition to a Polyalphabetic Cipher being MUCH more secure than a Monoalphabetic Cipher, we saw that there a few more techniques to making a message more secure, including removing all spaces and punctuation. Even in a Monoalphabetic Cipher these techniques will help:

```ruby
def to_caesar(sentence)
    sentence.chars.map { |letter| Ceaser_cipher[letter] }.join(" ")
end

to_caesar(“Here is a, sentence?”) #=> "IFSFJTBTFOUFODF"
```

But they all fall weakness to something called Frequency Analysis, coming up in the next blog post!

As always let me know if you have any questions. Happy encrypting!

Code on.

Mike Merin
