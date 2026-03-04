---
layout: post
title: "Kotlin through JavaScript"
subtitle: "Learning Kotlin by comparing it to JavaScript"
date: 2025-02-15 10:30:00 -0400
tags: Kotlin, JavaScript, TypeScript, Language Comparison
series: Ruby Dev Learns Other Langauges
summary: A practical comparison of Kotlin and JavaScript, learning Kotlin patterns through JavaScript examples
---

Coming from a JavaScript background, learning Kotlin can feel like learning a statically-typed, more verbose cousin. But there are some beautiful parallels and some important differences that make Kotlin worth understanding. Let's explore how Kotlin relates to JavaScript and why it excels for Android development and backend services.

# Basic Syntax Comparison

## Variables

In JavaScript, we declare variables with `const`, `let`, or `var`. Kotlin uses `val` (immutable) and `var` (mutable):

```ts
// JavaScript
const name = "Mike";  // immutable
let age = 30;         // mutable
```

```kotlin
// Kotlin
val name = "Mike"     // immutable (like const)
var age = 30          // mutable
```

The key difference: Kotlin defaults to immutability with `val`, encouraging functional programming patterns.

## Functions

JavaScript's arrow functions are concise, but Kotlin's lambda expressions and function types provide additional power:

```ts
// JavaScript
const add = (a, b) => a + b;
const numbers = [1, 2, 3].map(n => n * 2);
```

```kotlin
// Kotlin
val add = { a: Int, b: Int -> a + b }
val numbers = listOf(1, 2, 3).map { n -> n * 2 }
```

Kotlin makes the function type explicit and supports type inference, making it cleaner for complex operations.

## Null Safety

JavaScript's `null` and `undefined` are legendary sources of bugs. Kotlin makes null-safety a language feature:

```ts
// JavaScript - risky!
const user = getUser(); // could be null/undefined
const name = user.name; // ❌ Runtime error possible
```

```kotlin
// Kotlin - safe
val user: User? = getUser()
val name = user?.name ?: "Unknown" // ✅ Type-safe
```

# Collections and Iteration

Both languages have powerful collection operations, but Kotlin's syntax is cleaner:

```ts
// JavaScript
const users = [
  { name: "Alice", age: 28 },
  { name: "Bob", age: 32 },
];

users
  .filter(u => u.age > 30)
  .map(u => u.name)
  .forEach(name => console.log(name));
```

```kotlin
// Kotlin
val users = listOf(
  User("Alice", 28),
  User("Bob", 32)
)

users
  .filter { it.age > 30 }
  .map { it.name }
  .forEach { println(it) }
```

# Classes and Objects

Kotlin's classes are more concise than JavaScript's, especially with data classes:

```ts
// JavaScript (using a class or plain object pattern)
class User {
  constructor(name, email) {
    this.name = name;
    this.email = email;
  }
}

const user = new User("Mike", "mike@example.com");
```

```kotlin
// Kotlin - data classes auto-generate equals(), hashCode(), toString()
data class User(val name: String, val email: String)

val user = User("Mike", "mike@example.com")
```

# Coroutines vs Promises

JavaScript uses Promises and async/await. Kotlin uses coroutines, which are lighter weight:

```ts
// JavaScript
async function fetchUser(id) {
  try {
    const response = await fetch(`/api/users/${id}`);
    const user = await response.json();
    return user;
  } catch (error) {
    console.error(error);
  }
}
```

```kotlin
// Kotlin
suspend fun fetchUser(id: Int): User = withContext(Dispatchers.IO) {
  try {
    val response = httpClient.get("/api/users/$id")
    response.body()
  } catch (error: Exception) {
    log.error(error)
  }
}
```

# Extensions are Kotlin's Superpower

While JavaScript has monkey-patching (modifying prototypes), Kotlin has a safer extension function system:

```ts
// JavaScript - modifying prototype
String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

"hello".capitalize(); // "Hello"
```

```kotlin
// Kotlin - extension functions are explicit and non-invasive
fun String.capitalize(): String = this.first().uppercase() + this.drop(1)

"hello".capitalize() // "Hello"
```

# Why Kotlin for JavaScript Devs

1. **Type Safety**: Catch errors at compile time instead of runtime
2. **Null Safety**: No more undefined is not a function errors
3. **Concise Syntax**: Less boilerplate than Java, cleaner than JavaScript
4. **Powerful Standard Library**: Rich collection operations similar to JavaScript
5. **Interoperability**: Can call Java libraries seamlessly
6. **Android Development**: Kotlin is now the recommended language for Android

If you're comfortable with JavaScript's functional style, Kotlin will feel natural. The extra type safety actually helps you write more confident code faster.

-Mike Merin
