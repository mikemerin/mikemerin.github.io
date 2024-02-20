---
layout: post
title: "SCSS Iteration and Dynamic Class Creation"
date: 2021-08-16 19:52:01 -0400
tags: SCSS
summary: Get started with Rails APIs and get past a major pain point
---
`@each` loops can be used with lists/maps to create classes rather than manually creating each one

```scss
$colors: ( red, orange, yellow, green, blue, indigo, purple );
@each $color in $colors { .text-#{$color} { color: $color } }

// this compiles to:

.text-red { color: red; }
.text-orange {color: orange; }
.text-yellow {color: yellow; }
.text-green {color: green; }
.text-blue {color: blue; }
.text-indigo {color: indigo; }
.text-purple {color: purple; }
```

Code on.

Mike Merin
