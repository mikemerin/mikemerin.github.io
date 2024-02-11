---
layout: post
title:  "Ambiguous SQL Column Names"
subtitle: "Too many Mikes? Be More Specific"
date:   2021-03-02 13:27:04 -0400
tags: SQL
summary: Handle multiple tables that have the same column names
---
When working with column names in multiple SQL tables, if multiple tables have the same field name then you will have to reference that table name to avoid an error, specifically the error **ambiguous column name**.

A working example here is: **table_name.column_name**

Otherwise if the name is unique to that table, you don't need to do that and can just do **column_name**

Use [http://sqlfiddle.com/](http://sqlfiddle.com/) to try out the following examples!

```sql
CREATE TABLE dog (name varchar(255), breed varchar(255));
CREATE TABLE person (name varchar(255), age int, pet_name varchar(255));

INSERT INTO dog VALUES
('Lily', 'Pitbull'),
('Charlie', 'Cavachon');

INSERT INTO person VALUES
('Mike', 34, 'Lily'),
('Trevor', 27, 'Charlie');

/* test 1: using table names for all columns */
SELECT dog.name, dog.breed, person.name, person.age
FROM dog
JOIN person ON dog.name = person.pet_name;

/* test 2: not using table names for the unique columns */
SELECT dog.name, breed, person.name, age
FROM dog
JOIN person ON dog.name = person.pet_name;

/* test 3: same, but also works with the join! */
SELECT dog.name, breed, person.name, age
FROM dog
JOIN person ON dog.name = pet_name;

/* test 4: however we can't do it with name since it exists in both tables  */
SELECT dog.name, breed, person.name, age
FROM dog
JOIN person ON name = pet_name;
```

Code on.

-Mike Merin
