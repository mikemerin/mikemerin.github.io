---
layout: post
title:  "Add More Complexity, but Not Work"
subtitle: "expanding the question object"
date:   2017-06-23 16:53:18 -0400
tags: Ruby, JavaScript
series: Anatomy of a Quiz Generator
summary: Code along for even more dynamic question generation
---
##### Please note this is a work in progress. I have noted where I will continue working below
***

In my last post, I showed you how to create a question object that stores enough information to produce 31 thousand possible questions in under 40 lines of code. Let's expand on that even more to get that number into 6 figures. Last we left off we had:

***possible questions = 31,104***

Made from:

* Arrays: 192 configurations
  * 4x starting numbers
  * 2x reverse the array or not
  * 6x choose one of the 6 elements
  * 4x comparisons
* Asking Questions: 27 ways
  * Multiple Choice: 24 configurations
  * True or False: 2 ways
  * Enter the Right Answer: 1 way
* `.select`, `.reject`, `.find`, `.detect`, `.keep_if`, `delete_if`: 192 configurations each
* 6 * 192 * 27 = 31,104

Our code currently looks like this:

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
```

Which can be called like this and then contain the following information:

```ruby
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

When I made this generator originally, I had each method as its own class that inherited the `Question` class so it didn't get messy. We have gone as far as we can using the above `Question` class because the next 5 methods: pop, shift, push, unshift, and insert, do not use comparisons. Therefore we're going to start splitting apart our program.

# Quick refactoring and class inheritence
---
Class inheritence just means that if I have a class, I can inherit things from another one. Here's an example:

```ruby
class Animal

  attr_accessor :name, :breed

  def initialize(name, breed)
    @name = name
    @breed = breed
  end

  def snore
    puts "zzzzz"
  end

end
```

The `Animal` class initializes with a name and a breed, nothing else. I can inherit these properties and then make my own after:

```ruby
class Dog < Animal

  def bark
    puts "Woof!"
  end

end

class Cat < Animal

  def purr
    puts "Meow!"
  end

end
```

Here's how the information is shared between them:

```ruby
animal = Animal.new("Mike", "Human")
#=> <Animal:0x007fe4c006d220 @name="animal", @breed="general">
a.snore #=> zzzzz
a.bark #=> NoMethodError: undefined method `bark'
a.purr #=> NoMethodError: undefined method `purr'

dog = Dog.new("Lily", "Pit Mix")
#=> <Dog:0x007fe4be928420 @name="Lily", @breed="Pit Mix">
a.snore #=> zzzzz
a.bark #=> Woof!
a.purr #=> NoMethodError: undefined method `purr'

cat = Cat.new("Lira", "Chartreux")
#=> <Cat:0x007fe4be884488 @name="Lira", @breed="Chartreux">
a.snore #=> zzzzz
a.bark #=> NoMethodError: undefined method `bark'
a.purr #=> Meow!
```

As you can see, both the cat and dog inherit snoring, but only the dog can bark and only the cat can meow. We can use this to our advantage and only keep certain

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

  def generateQuestion
    createArray; chooseComparison; createQuestion; createAnswers
  end

end

class ComparisonQuestion < Question

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

end

q = ComparisonQuestion.new("reject")
q.generateQuestion
#=> <ComparisonQuestion:0x007fe4bea7be80 @method="reject", @comparisons=[">", ">=", "<", "<="],
#   @array=[3, 4, 5, 6, 7, 8], @array_selection=3, @comparison_selection=">",
#   @question="[3, 4, 5, 6, 7, 8].reject { |x| x > 3 }", @answer=[3],
#   @mc_answers=[[3, 4, 5, 6, 7, 8], [], [3], [4, 5, 6, 7, 8]], @wrong_answer=[]>
```

As you can see, `ComparisonQuestion` inherited everything in our `Question` class and does everything it does PLUS its own methods, so when we make that new question as a `ComparisonQuestion` class it works just like before! `Question` creates our array and handles the final order of question generating, but the `ComparisonQuestion` handles the actual question and answer creation along with checking for four answers. Let's add the next 5 methods in a similar way.

# `.pop` and `.shift`
---
These two methods remove elements from an array, with `.pop` removing it from the end and `.shift` from the beginning. Also, using `.pop`/`.shift` will *return the removed element*, not the modified array. This means that for a single array we can give 4 answers like this:

```ruby
array = [1, 2, 3, 4, 5, 6]
array.pop #=> 6 (returns the element popped off)
array #=> [1, 2, 3, 4, 5] (what the array looks like after)

array = [1, 2, 3, 4, 5, 6]
array.shift #=> 1 (returns the element shifted off)
array #=> [2, 3, 4, 5, 6] (what the array looks like after)
```

It makes sense to generate a question that has all of these four answers with 1 right and 3 wrong. We need to first make our `createQuestion` method. We have two sets of items to randomly choose from:

```ruby
pop_or_shift = ["pop", "shift"].sample
return_or_array = ["return", "array"].sample
```

Since we're evaluating strings, and there's no way to actually return a destructively changed array without physically recreating the array each time (which would be a pain), we'll use a trick called `slice` to simply choose the first 5 elements in an array for `.pop` or the last 5 elements in an array for `.shift`. I can do this one of two ways:

slice(index, how_many_positions_out)
or
slice(range)

```ruby
array = [1, 2, 3, 4, 5, 6]

array.slice(0, 5) #=> [1, 2, 3, 4, 5]
array.slice(0..4) #=> [1, 2, 3, 4, 5]

array.slice(1, 5) #=> [1, 2, 3, 4, 6]
array.slice(1..5) #=> [1, 2, 3, 4, 6]
```

So let's write out how we'd handle something like `[1, 2, 3, 4, 5, 6].pop #=> ?`. Remember, here's what methods we need to create and which attributes we need to create from them:

```ruby
createQuestion #=> @question
pop_or_shift = ["pop", "shift"].sample

def createQuestion
  @question = "#{@array}.#{pop_or_shift}"
end
```

Seems simple enough at first glance, call `.shift` or `.pop` on it, however we also need to be able to ask about what the method returns half of the time and what the array looks like the other half. Before we had:

```ruby
pop_or_shift = ["pop", "shift"].sample
return_or_array = ["return", "array"].sample

if return_or_array == "return"
  @question2 = "returns #=> ?"
else
  @question2 = "array #=> ?"
end

# shorten this with a ternary operator to:
@question2 = "#{return_or_array == 'return' ? 'returns' : 'array'} #=> ?"
```

We now have our second part of the question that can be called for clarification. Next up is creating our answers.

```ruby
createAnswers #=> @answer, @mc_answers, @wrong_answer, @dummy_array
# (we have @dummy_array here instead of in our check, you'll see why)

def createAnswers
  @answer = eval "#{@question}"
  @mc_answers << (eval "#{@array}.pop")
  @mc_answers << (eval "#{@array}.slice(0,5)")
  @mc_answers << (eval "#{@array}.shift")
  @mc_answers << (eval "#{@array}.slice(1,5)")
  @mc_answers.shuffle!
end

```

# WIP below
***

pop_shift = ["pop", "slice(0, 5)", "shift", "slice(1, 5)"]



```ruby

class PopShift < Question

  def createQuestion
    @question = "#{@array}.#{pop_or_shift}"
    @question2 = "#{return_or_array == 'return' ? 'returns' : 'array'} #=> ?"
  end

end


class ComparisonQuestion < Question

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

end
```

Code on.

Mike Merin
