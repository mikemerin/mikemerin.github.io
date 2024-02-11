---
layout: post
title: "Make a Dynamically Generated Quiz"
subtitle: "creating the question object"
date:   2017-06-13 11:54:14 -0400
tags: Ruby, JavaScript
series: Anatomy of a Quiz Generator
summary: Code along for a quiz made by and for programmers
---
There are plenty of quizzes online, however if you take it again you'll already know the answers and will get 100%. Sometimes the quiz will randomize the order of the questions, but you'll still know them. Sometimes the quiz have a larger question bank to choose from, but after taking the quiz enough times you'll know all their answers as well.

When it comes to learning new skills through quizzes, this obviously is a problem as you'll end up learning the answers and not actually mastering the subject. The more questions the better, but there's only so many questions someone will manually add before it gets tiring.

With that being said, how was I able to add 200,000 possible questions to a test in only 2 days? No it wasn't from impossibly fast typing. In order to do this I wrote a program that would dynamically generate a question on the spot that could be one of 200,000 possible combinations. The quiz type? If my previous blog posts and projects were any indication of the types of programs I've written so far, of course it would be a programming education quiz.

Feel free to code along!

# Programming Languages
---
I started with the first language I learned: Ruby, with an eye on moving to Javascript afterward. The value of the generator was that eventually you'd be able to use it with any number of programming languages, and the first thing you learn in a new language are methods. These are the building blocks and are key to getting data do what you want, and is extremely pivotal in code challenges or interviews.

I looked for the methods that would be most helpful to master using. The initial list was:

Methods |
---|---
select | reject | find | detect
delete_if | keep_if | pop | shift
push | unshift | insert|

In addition, I wanted there to be three different ways a question could be asked: **Multiple Choice**, **True or False**, and **Enter the Correct Answer**.

I could create separate quizzes for each of these methods, and sure sure it would be good to randomly choose one of these methods and output a question, but this once again comes back to the first problem of making sure each of these questions were different from each other and not having to manually make each of them. Not only that but what if I wanted to do multiple choice? Would I have to create every single wrong choice?

Taking a look at what would need to be done to make a large number of different questions, I had to think about what I'd be calling the methods **on**. Arrays are a good way to teach about selection, manipulation, and iterating, so what if the arrays we used changed every single time we generated a new question?

# Array Generation
---
Dynamically creating arrays would automatically increase the questions asked as it would apply to every single method on the list above, and any new ones added to it. I could easily create an array from 1-6, 2-7, 3-8, and 4-9. They'd look like:
```ruby
[1, 2, 3, 4, 5, 6]
[2, 3, 4, 5, 6, 7]
[3, 4, 5, 6, 7, 8]
[4, 5, 6, 7, 8, 9]
```
Great that's 4 possibilities right off the bat. To actually choose one of these randomly though without having to actually save them I dynamically generated them by choosing a random number from 1-4, then creating an incrementing array with 6 elements:
```ruby
random = rand(1..4)
# start array at this number
array = Array.new(6) { |x| x + random }
# create a 6-element incrementing array
```
***possible questions = 4***

Now that we had our arrays, we could do some really fun stuff with them. How about half of the time we reverse the arrays? Using the `.sample` method along with a ternary operator I randomly (50/50) chose true or false to reverse the array or not:
```ruby
array = [true,false].sample ? array.reverse : array
```
***possible questions = 8***

It may not seem like much, but multiplying the possibilities by 8 right off the bat means any other changes we do will already have a large start.

# Comparisons
---
The first 6 methods on the list use one of 6 comparisons like less than `<`, greater than or equal to `>=`, or not equal to `!=`. I decided not to choose equal or not equal since if I used multiple choice I'd sometimes generate the same answers, which obviously would be a problem. I put all the comparisons in an array then chose one at random.

```ruby
comparisons = ["<",">",">=","<="]
comparison_selection = comparisons.sample
```
***possible questions = 32***

I'll be changing the comparison script further down the line, but wait a second, if I'm calling a comparison on an array, I'll need a number as well. After all if I have an array of numbers between 1 and 6 and I want a number less than `x`, what's `x`? Well I'll just choose one of the six numbers in the array!

```ruby
array_selection = array.sample
```
***possible questions = 192***

Just like that we have almost 200 different combinations *JUST* from making different arrays and comparisons! See, if we didn't start out with that number 8 before we'd only be at 24 by this point. Putting this to the test we have:

```ruby
random = rand(1..4)
# 4
array = Array.new(6) { |x| x + random }
# [4, 5, 6, 7, 8, 9]
array = [true,false].sample ? array.reverse : array
# true => [9, 8, 7, 6, 5, 4]
array_selection = array.sample
# 6
comparisons = ["<",">",">=","<="]
comparison_selection = comparisons.sample
# <
```
If we were using select, we'd get:

```ruby
method = "select"
array.method{ |x| x comparison_selection array_selection}
# this becomes
[4, 5, 6, 7, 8, 9].select{ |x| x < 6 }
```
Obviously the above wouldn't actually work when inputted into Ruby, so let's write something that does, if only to get something showing up.

# Creating a Question and Its Answer
---
What's the answer to the above question? I'll say it shortly so you have a change to guess, however it begs the question: how do I make all of this into workable code to even ask the question? The short and easy answer is "turn it all into a string and output it." To do that we can do something that's a bit messy but it'll serve our purposes just fine:
```ruby
"#{array}.#{method} { |x| x #{comparison_selection} #{array_selection} }"
# which becomes
"[4, 5, 6, 7, 8, 9].select{ |x| x < 6 }"
```
The good thing about this is, our "method" object can be changed to reject, find, detect, keep_if, or delete_if at a moment's notice!
```ruby
method = find
"#{array}.#{method} { |x| x #{comparison_selection} #{array_selection} }"
#=>
"[4, 5, 6, 7, 8, 9].find{ |x| x < 6 }"

method = delete_if
#=>
"[4, 5, 6, 7, 8, 9].delete_if { |x| x < 6 }"
```
And so on for each of those 6 types. So with 8 arrays, 6 methods, 4 comparison selections, and 6 array selections we now have:

***possible questions = 1,152***

What's cool about this as well is even though this is a string, we can get the answer by using `eval`!

```ruby
eval("[4, 5, 6, 7, 8, 9].select { |x| x < 6 }") #=> [4, 5]
eval("[4, 5, 6, 7, 8, 9].find { |x| x < 6 }") #=> 5
eval("[4, 5, 6, 7, 8, 9].delete_if { |x| x < 6 }") #=> [6, 7, 8, 9]
```

Not bad, but of course we can go even farther. We're hard-coding our question but there's some extreme limitations, including the fact that after we ask a question it only exists printed out and the program will never remember it, and therefore we can't use it again down the line. Also there's 5 more methods to go through, and of course these are just the questions without any answers. Actually before we continue, since we have a lot of methods and there are plenty more to come, let's organize them.

# Object Orientation
---
It makes perfect sense to make this program object oriented, as we can then make each question an object, set its attributes like array, method, etc., and then call a quiz type on it. If that question is storing all that information then we can expand it even further to even more types of quizzes or call other methods on it. Let's put everything into a class named `Question`. I'm also going to do a few more things, and I'll explain it as I go along

```ruby
class Question

  # name those four above attributes
  # I only want to be able to manually directly change the method
  # the rest I want read, but only changed through our instance methods
  attr_accessor :method
  attr_reader :array, :array_selection, :comparison_selection

  # we'll start with a chosen method
  # since the four comparison types don't change, we'll also start with them
  def initialize(method)
    @method = method
    @comparisons = ["<",">",">=","<="]
  end

  # put all array creation scripts into one method
  def createArray
    random = rand(1..4)                            # start array at this number
    @array = Array.new(6) { |x| x + random }       # create a 6-element incrementing array
    @array = [true,false].sample ? @array.reverse : @array # 50/50 chance reversing array
    @array_selection = @array.sample                # select one of those elements
  end

  def chooseComparison
    @comparison_selection = @comparison.sample      # choose one comparison
  end

end
```
Now we can create a question by doing `new_question = Question.new("reject")` and the `new_question` object will have all this information stored in it waiting to be used! Let's try that out and see what happens:

```ruby
new_question = Question.new("reject")
#=> <Question:0x007f9ddd926f08 @method="reject", @comparisons=["<", ">", ">=", "<="]>
# initializes with @method of "reject and the @comparisons, nothing else"

new_question.createArray
new_question #=>
# <Question:0x007f9ddd926f08 @method="reject", @comparisons=["<", ">", ">=", "<="],
# @array=[2, 3, 4, 5, 6, 7], @array_selection=3>
# we now have our @array and an @array_selection

new_question.chooseComparison
new_question #=>
# <Question:0x007f9ddd926f08 @method="reject", @comparisons=["<", ">", ">=", "<="],
# @array=[2, 3, 4, 5, 6, 7], @array_selection=3 @comparison_selection="<">
# and now a comparison
```
This info is now all stored in the `new_question` object and can be called at any time, and if we really wanted to we could run the `.createArray` and `.chooseComparison` instance methods on it again to make it into a new question. This would get tedious though so let's create a new method that does this for us, and then let's bring it together by putting it into a string just like before:
```ruby
def createQuestion
  createArray; chooseComparison
  @question = "#{@array}.#{@method} { |x| x #{@comparison_selection} #{@array_selection} }"
end
```
Now we can just use `new_question.createQuestion` and it'll do the above for us. You can see that using object oriented code makes it incredibly easy to add methods to our class and have them be accessible from the start.

# Creating Answers
---
Even though I have the framework for creating a question, I need to make sure there are multiple answers. This is where we're going to REALLY step it up. Our code which has 1,152 possibilities. We can use the prior `eval(string)` trick to create an answer, so let's also add that to our prior code:

```ruby
class Question

  attr_accessor :method
  attr_reader :array, :array_selection, :comparison_selection, :question, :answer

  def initialize(method)
    @method = method
    @comparisons = ["<",">",">=","<="]
  end

  def createArray
    random = rand(1..4)
    @array = Array.new(6) { |x| x + random }
    @array = [true,false].sample ? @array.reverse : @array
    @array_selection = @array.sample
  end

  def chooseComparison
    @comparison_selection = @comparisons.sample
  end

  def createQuestion
    createArray; chooseComparison
    @question = "#{@array}.#{@method} { |x| x #{@comparison_selection} #{@array_selection} }"
  end

  def createAnswer
    @answer = eval(@question)
  end

end

question = Question.new("select")
#=> <Question:0x007f9ddd98c470 @method="select", @comparisons=["<", ">", ">=", "<="]>

question.createQuestion
#=> <Question:0x007f9ddd98c470 @method="select", @comparisons=["<", ">", ">=", "<="],
#    @array=[9, 8, 7, 6, 5, 4], @array_selection=6, @comparison_selection=">=",
#    @question="[9, 8, 7, 6, 5, 4].select { |x| x >= 6 }">

question.createAnswer #=> @answer=[9, 8, 7, 6]
```
Our object now has a question and answer, and notice I have still have them as `attr_reader` not `attr_accessor` as I don't want them to be able to be manually changed, only read.

We also need to prepare for needing a wrong answer for true/false or 3 wrong answers for multiple choice.

Let's tackle how we can get four answers for multiple choice, and two answers for true/false (I'll explain why in a bit). Since we need 4 answers for multiple choice, I looked at what also had 4 things to choose from: our comparisons. Since we selected one with `@comparison_selection` why not use the others to generate wrong answers?

If I made a `@mc_answers` array to call on, I could populate it by iterating over the `@comparisons` array and push each answer into it, then shuffle up the choices to give us one of 24 combinations. Basically:
```ruby
  @choices << (eval "#{@array}.#{@method} { |x| x < #{@array_selection} }")
  @choices << (eval "#{@array}.#{@method} { |x| x > #{@array_selection} }")
  @choices << (eval "#{@array}.#{@method} { |x| x >= #{@array_selection} }")
  @choices << (eval "#{@array}.#{@method} { |x| x <= #{@array_selection} }")
  @choices.shuffle!
```
Or more simply:
```ruby
@mc_answers = []
@comparisons.each do |comparison|
    @mc_answers << (eval "#{@array}.#{@method} { |x| x #{comparison} #{@array_selection} }")
end
@mc_answers.shuffle!
```

And we can make this even shorter by doing:

```ruby
@mc_answers = []
@comparisons.each { |comparison| @mc_answers << (eval "#{@array}.#{@method} { |x| x #{comparison} #{@array_selection} }") }
@mc_answers.shuffle!
```
And even shorter by using `.map`:

```ruby
@mc_answers = @comparisons.map { |comparison| (eval "#{@array}.#{@method} { |x| x #{comparison} #{@array_selection} }") }
@mc_answers.shuffle!
```

While we're working our the comparisons, let's redo our `chooseComparison` method. Right now it just picks a random comparison using `@comparison.sample`, but we need to think about how we'll do true/false. It'd be useless if we only gave users a right answer every time as they'd just click true and move on, so we'll also need to give them a wrong answer as well half of the time. If we simply choose a second comparison we'd require a check to make sure it's not the same random sample as before (like using `.include?`) but that would add more lines of code and make it messier. Instead we can simply choose the first comparison as the correct one and the second one as the wrong one! We'll also shuffle our comparisons first to make sure it's not the same every time.

```ruby
def chooseComparison
    @comparison_selection = @comparisons.shuffle![0]  # select correct comparison
    @comparison_rejection = @comparisons[1]          # select wrong comparison
end
```
Yes I'm being cheeky here and using the method names `select` and `reject` as my naming scheme instead of right/wrong. Now that we have a `@comparison_rejection` we can use that to make a false answer:

```ruby
@false_answer = eval "#{@array}.#{@method} { |x| x #{@comparison_rejection} #{@array_selection} }"
```

We'll organize it by adding id to our `createAnswer` instance method. I'm also going to make a method called `generateQuestion` which will run these methods for us. With that, how does our code look now put together?

```ruby
class Question

  attr_accessor :method
  attr_reader :array, :array_selection, :comparison_selection, :comparison_rejection, :question, :answer, :wrong_answer, :mc_answers

  def initialize(method)
    @method = method
    @comparisons = ["<",">",">=","<="]
  end

  def createArray
    random = rand(1..4)
    @array = Array.new(6) { |x| x + random }
    @array = [true,false].sample ? @array.reverse : @array
    @array_selection = @array.sample
  end

  def chooseComparison
    @comparison_selection = @comparisons.shuffle![0]  # select correct comparison
    @comparison_rejection = @comparisons[1]          # select wrong comparison
  end

  def createQuestion
    @question = "#{@array}.#{@method} { |x| x #{@comparison_selection} #{@array_selection} }"
  end

  def createAnswers
    @answer = eval(@question)
    @wrong_answer = eval "#{@array}.#{@method} { |x| x #{@comparison_rejection} #{@array_selection} }"
    @mc_answers = @comparisons.map { |comparison| (eval "#{@array}.#{@method} { |x| x #{comparison} #{@array_selection} }") }
    @mc_answers.shuffle!
  end

  def generateQuestion
    createArray; chooseComparison; createQuestion; createAnswers
  end

end

question = Question.new("select")
question.generateQuestion
#=> <Question:0x007f9ddd90fe70 @method="select", @array=[1, 2, 3, 4, 5, 6],
#   @comparisons=["<", ">", ">=", "<="],
#   @array_selection=3, @comparison_selection=">",
#   @question="[1, 2, 3, 4, 5, 6].select { |x| x > 3 }",
#   @answer=[4, 5, 6], @comparison_rejection=">", @wrong_answer=[4, 5, 6],
#   @mc_answers=[[3, 4, 5, 6], [4, 5, 6], [1, 2, 3], [1, 2]]>
```

# `.find` and `.detect`
---
Now we have a LOT of information stored in our question object, and this works great for select/reject, however there's a problem if we try to use `.find` or `.detect` (which by the way are the same thing), and another major problem if we try to use `.keep_if` or `.delete_if`. Here's a problem that will happen with the former:

```ruby
question = Question.new("find")
question.generateQuestion
#=> <Question:0x007f9ddd8f5778 @method="find", @array=[2, 3, 4, 5, 6, 7],
#   @comparisons=["<", ">", ">=", "<="],
#   @array_selection=4, @comparison_selection="<=",
#   @question="[2, 3, 4, 5, 6, 7].find { |x| x <= 4 }",
#   @answer=2, @comparison_rejection=">", @wrong_answer=5,
#   @mc_answers=[2, 5, 4, 2]>
```
See the issue? Look at the `@mc_answers`. Here's the issue we tried to avoid before when we were talking about comparison selection: we have two answers that are the same. Why? `.find` and `.detect` will find the first number that's valid, so going through all the comparisons:

```ruby
["<", ">", ">=", "<="]
[2, 3, 4, 5, 6, 7].find { |x| x < 4 } #=> 2
[2, 3, 4, 5, 6, 7].find { |x| x > 4 } #=> 5
[2, 3, 4, 5, 6, 7].find { |x| x >= 4 } #=> 4
[2, 3, 4, 5, 6, 7].find { |x| x <= 4 } #=> 2
```

No matter what array or selection we'll always get duplicate answers. The fix is a simple one, and it goes back to what we wanted to avoid: validation. There's a few ways to do this but I'll use `delete`. Basically, I want to run this if there's only 3 unique answers and I want that 4th one to also be unique. Since `find`/`detect` finds a single number and then `nil` in specific cases like:

```ruby
[2, 3, 4, 5, 6, 7].find { |x| x > 7 }
# no numbers are greater than 7, so it will return nil
```

We will need to create a dummy array starting with `nil` and then the normal array. After that we'll choose one of them at random that isn't a number we have already:

```ruby
# check if there are only three unique answers
if @mc_answers.uniq.size == 3
  # create a dummy array that duplicates the array, start with nil, then shuffle it
  @dummy_array = @array.dup.unshift(nil).shuffle
  # go through each mc answer and delete them from the dummy array
  @mc_answers.each { |x| @dummy_array.delete(x)}
  # add the first answer to the array
  @mc_answers << @dummy_array[0]
  # shuffle them around so the wrong answer isn't always at the end
  @mc_answers.shuffle!
end
```

Great we have 4 answers again! If you're wondering, I can also use `.include?` here:

```ruby
if @mc_answers.uniq.size == 3
  # create a dummy array that duplicates the array, start with nil, then shuffle it
  @dummy_array = @array.dup.unshift(nil).shuffle
  # go through each element in the dummy array
  # add it unless it's already there
  @dummy_array.each do |x|
    unless @dummy_array.include?(x)
      return @mc_answers << x
      break
    end
  end
  # shuffle them around so the wrong answer isn't always at the end
  @mc_answers.shuffle!
end
```

But not only is `.delete` cleaner, I'll also be able to modify it easier to work with other possible duplicate answers down the line rather than just single numbers. I'm going to do one more thing here and that's using `.uniq` when we populate our `@mc_answers` so it's permanent and we don't need to call it twice afterward:

```ruby
@mc_answers = @comparisons.map { |comparison| (eval "#{@array}.#{@method} { |x| x #{comparison} #{@array_selection} }") }.uniq
# this lets us simply say
if @mc_answers.size == 3
```

We still have one more problem though, and that's our `@comparison_rejection` which has a 1 in 3 chance to choose a rejected comparison with the same answer. So, let's remove that entirely and choose a wrong answer from our `@mc_answers`! I was originally going to say to take it from our dummy array since:

1) all answers were shuffled
2) all answers are wrong
3) we can just choose the first one as the wrong answer by doing `@wrong_answer = @dummy_array[0]`.

HOWEVER, if we want this to work for all methods let's think of it this way:

1) we can't do the above because our `@dummy_array` has single numbers, doesn't work for `.select`/`.reject`
2) we already did the hard work of making three wrong answers so:
3) we can modify our previous `createAnswers` method and pick the first wrong one we populate

Let's do that modifying. It looks like this with our `@dummy_array` script:

```ruby
def createAnswers
  @answer = eval(@question)
  @wrong_answer = eval "#{@array}.#{@method} { |x| x #{@comparison_rejection} #{@array_selection} }"
  @mc_answers = @comparisons.map { |comparison| (eval "#{@array}.#{@method} { |x| x #{comparison} #{@array_selection} }") }.uniq
  if @mc_answers.size == 3
    @dummy_array = @array.dup.unshift(nil).shuffle
    @mc_answers.each { |x| @dummy_array.delete(x)}
    @mc_answers << @dummy_array[0]
  end
  @mc_answers.shuffle!
end
```

Since the first comparison is always correct and answers 2-4 added after it are always wrong, let's set our `@wrong_answer` to be the second one, THEN we'll shuffle them:

```ruby
def createAnswers
  @answer = eval(@question)
  # remove the old @wrong_answer
  # @wrong_answer = eval "#{@array}.#{@method} { |x| x #{@comparison_rejection} #{@array_selection} }"
  @mc_answers = @comparisons.map { |comparison| (eval "#{@array}.#{@method} { |x| x #{comparison} #{@array_selection} }") }.uniq
  if @mc_answers.size == 3
    @dummy_array = @array.dup.unshift(nil).shuffle
    @mc_answers.each { |x| @dummy_array.delete(x)}
    @mc_answers << @dummy_array[0]
  end
  # add the new @wrong_answer, change our eval with @comparison_rejection to @mc_answers[1]
  @wrong_answer = @mc_answers[1]
  @mc_answers.shuffle!
end
```

We can now entirely get rid of the `@comparison_rejection`! So with all that done let's see what we have:

```ruby
class Question

  attr_accessor :method
  attr_reader :array, :array_selection, :comparison_selection, :question, :answer, :wrong_answer, :mc_answers, :dummy_array

  def initialize(method)
    @method = method
    @comparisons = ["<",">",">=","<="]
  end

  def createArray
    random = rand(1..4)
    @array = Array.new(6) { |x| x + random }
    @array = [true,false].sample ? @array.reverse : @array
    @array_selection = @array.sample
  end

  def chooseComparison
    @comparison_selection = @comparisons.shuffle![0]
  end

  def createQuestion
    @question = "#{@array}.#{@method} { |x| x #{@comparison_selection} #{@array_selection} }"
  end

  def createAnswers
    @answer = eval(@question)
    @mc_answers = @comparisons.map { |comparison| (eval "#{@array}.#{@method} { |x| x #{comparison} #{@array_selection} }") }.uniq
    if @mc_answers.size == 3
      @dummy_array = @array.dup.unshift(nil).shuffle
      @mc_answers.each { |x| @dummy_array.delete(x)}
      @mc_answers << @dummy_array[0]
    end
    @wrong_answer = @mc_answers[1]
    @mc_answers.shuffle!
  end

  def generateQuestion
    createArray; chooseComparison; createQuestion; createAnswers
  end

end
```

Our `createAnswers` method is messy though, so let's split it up by removing that check for four answers answers:

```ruby
class Question

  attr_accessor :method
  attr_reader :array, :array_selection, :comparison_selection, :question, :answer, :wrong_answer, :mc_answers, :dummy_array

  def initialize(method)
    @method = method
    @comparisons = ["<",">",">=","<="]
  end

  def createArray
    random = rand(1..4)
    @array = Array.new(6) { |x| x + random }
    @array = [true,false].sample ? @array.reverse : @array
    @array_selection = @array.sample
  end

  def chooseComparison
    @comparison_selection = @comparisons.shuffle![0]
  end

  def createQuestion
    @question = "#{@array}.#{@method} { |x| x #{@comparison_selection} #{@array_selection} }"
  end

  def createAnswers
    @answer = eval(@question)
    @mc_answers = @comparisons.map { |comparison| (eval "#{@array}.#{@method} { |x| x #{comparison} #{@array_selection} }") }.uniq
    hasFourAnswers?
    @wrong_answer = @mc_answers[1]
    @mc_answers.shuffle!
  end

  def hasFourAnswers?
    if @mc_answers.size == 3
      @dummy_array = @array.dup.unshift(nil).shuffle
      @mc_answers.each { |x| @dummy_array.delete(x)}
      @mc_answers << @dummy_array[0]
    end
  end

  def generateQuestion
    createArray; chooseComparison; createQuestion; createAnswers
  end

end

q = Question.new("select")
q.generateQuestion
q
#=> <Question:0x007f9ddd97f680 @method="select", @comparisons=[">", "<=", ">=", "<"],
#   @array=[1, 2, 3, 4, 5, 6], @array_selection=1, @comparison_selection=">",
#   @question="[1, 2, 3, 4, 5, 6].select { |x| x > 1 }", @answer=[2, 3, 4, 5, 6],
#   @mc_answers=[[1], [2, 3, 4, 5, 6], [], [1, 2, 3, 4, 5, 6]], @wrong_answer=[1]>

q = Question.new("detect")
q.generateQuestion
#=> <Question:0x007f9dde865cd0 @method="detect", @@comparisons=[">", "<=", "<", ">="],
#   @array=[7, 6, 5, 4, 3, 2], @array_selection=2, @comparison_selection=">",
#   @question="[7, 6, 5, 4, 3, 2].detect { |x| x > 2 }", @answer=7,
#   @mc_answers=[nil, 7, 2, 3], @wrong_answer=2, @dummy_array=[3, 4, 6, 5]>
```

Great it works for both questions now! We have our initialize and generating methods, and 5 fairly short instance methods they work off of. You may be wondering why I went through the whole `@comparison_rejection` part before removing it, well that's what happens when you start writing a program; sometimes the ideas you start off with will change as you write your program, so I wanted to show some insight into the process and why things had to change.

By the way, now that we can either do true or false (two possibilities), our multiple choice answers can be shuffled into 1 of 24 configurations, or we can ask them to enter the right answer, those 27 ways of asking a question brings up all the way up to:

***possible questions = 31,104***

Work in Progress is below, I will update this over the next few days.
***


# `.keep_if` and `.delete_if`
---

Lastly in this post we'll cover the latter two problem methods mentioned before. These are the exact same things as `.select`/`.reject` respectively, however they're **destructive methods**, meaning that after we call them, they'll permanently alter the array, not just the output. So before all the edits above to make `.find` and `.detect` work, if we ran our program we'd get:
```ruby
question_keep = Question.new("keep_if")
question_keep.generateQuestion
#=> <Question:0x007f9dde01e400 @method="keep_if", @array=[],
#   @comparisons=["<", ">", ">=", "<="],
#   @array_selection=8, @comparison_selection="<=",
#   @question="[9, 8, 7, 6, 5, 4].keep_if { |x| x <= 8 }",
#   @answer=[8, 7, 6, 5, 4], @comparison_rejection=">",
#   @mc_answers=[[], [], [], []],  @wrong_answer=[]>
```
Even though we got our correct answer, you'll notice that there's nothing in our `@mc_answers` or `@wrong_answer` because whenever we run the destructive method, the array we try to call it on has already been changed once before by that same method. If you look at the `@array`, there's nothing there! We started off with `@question="[9, 8, 7, 6, 5, 4].keep_if { |x| x <= 8 }"`, which shows an array of `[9, 8, 7, 6, 5, 4]`, however running `.keep_if` with say, `>` and then `<` would keep numbers greater than a selected_number, and then try to keep numbers less than a selected_number which don't exist any more, leaving us with an empty array.

HOWEVER, in writing this blog post I changed things around for our `.find` and `.detect` methods, and now if we ran our program we'll get:

```ruby
question_keep = Question.new("keep_if")
question_keep.generateQuestion
#=> <Question:0x007f9dde15d348 @method="keep_if", @comparisons=["<=", ">", ">=", "<"],
#   @array=[6, 5, 4, 3, 2, 1], @array_selection=1, @comparison_selection="<=",
#   @question="[6, 5, 4, 3, 2, 1].keep_if { |x| x <= 1 }", @answer=[1],
#   @mc_answers=[[6, 5, 4, 3, 2, 1], [6, 5, 4, 3, 2], [1], []],  @wrong_answer=[6, 5, 4, 3, 2]>
```

Which is the correct answers to everything. Why? Well I'm ashamed to say this took me a while to figure out, but it all has to do with this line:

```ruby
@comparisons.each { |comparison| @mc_answers << (eval "#{@array}.#{@method} { |x| x #{comparison} #{@array_selection} }") }
```

Before we were evaluating directly against the original `@array`, meaning that the attribute itself would be changed each time. However what we're doing instead now is turning `@array` into a string, then just running that string each time. What do I mean by that?

```ruby
# old way:
array = [1, 2, 3, 4, 5, 6]
answer = array.keep_if { |x| x > 3 }

answer #=> [4, 5, 6]
array #=> [4, 5, 6]
```
We got our answer, BUT the original array has changed as a result of the destructive `.keep_if` method.

```ruby
# new way
array = [1, 2, 3, 4, 5, 6]
answer = eval ("#{array}.keep_if { |x| x > 3 }")

answer #=> [1, 2, 3, 4, 5, 6]
array #=> [4, 5, 6]
```

We first turn the array (and the rest of the script) into a string of `"[1, 2, 3, 4, 5, 6].keep_if { |x| x > 3 }"` and then evaluate that string using `eval` as if it were real. We never actually call the method on the `array` directly, that way we can create as many strings as we need and never have to change our attributes.

---

There are plenty more methods, including the ones I didn't even get to (pop/shift, push/unshift, and insert), but those will require another change to our question object. Right now we have 31,104 possible questions, I'll tackle that in the next post and make that go even higher!

Code on.

Mike Merin
