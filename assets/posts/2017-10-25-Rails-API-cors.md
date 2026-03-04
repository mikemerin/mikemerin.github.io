---
layout: post
title: "Creating a Rails API and fixing CORS issues"
subtitle: "Easy databases, easy back end"
date: 2017-10-25 13:58:14 -0400
tags: Ruby, Rails, API, ActiveRecord
summary: Get started with Rails APIs and get past a major pain point
---
I recently tried to recreate an API for one of my applications. I ran into the infamous CORS issue `No 'Access-Control-Allow-Origin' header is present on the requested resource.` It took a litle while to find the fix again so I figure I'd go through the simple steps of how to create a rails API from scratch and fix the issue as I go.

If you're just interested in how to fix a CORS issue you can skip ahead to [here](https://mikemerin.github.io/Rails-API-cors#cors).

# Tools

Ruby: There are a few ways to get Ruby installed on your computer but many roads lead [here](https://www.ruby-lang.org/en/documentation/installation/)

Rails: Connecting Ruby to the online world. You can find the guide to installing Rails [here](http://installrails.com/)

Database: Since you're creating an API you'll need to have a database program on your computer. You can use the clean and useful [DB Browser for SQLite](http://sqlitebrowser.org/), or my preferred [postgresql](https://www.postgresql.org/) which is much faster and advanced.

IDE: a way to view your files. IDE stands for "integrated development environment" and it's what developers use to create and edit their files, in fact I'm using one right now for this blog post! My favorite is [Atom](https://atom.io/), others like [Sublime](https://www.sublimetext.com/).

# Creating the application

Rails makes it incredibly easy to create a basic application from scratch. No needing to manually configure the little things like you need to with Sinatra, just type in the terminal commands and you're good to go. We're going to create a new API called `test_api`. The easiest way to do this is type in:

`rails new test_api --api`

or if like me you like Postgresql better you can instead type in:

`rails new test_api --api --database=postgresql -T`

Once the flurry of text finishes, you'll notice a new folder called `test_api`. If you `cd test_api` to go into the folder you'll see it contains files like a Gemfile, Rakefile, config, readme, etc. I won't go into detail about what each of them do right now, but technically you just made an API! Grats, now to get it working correctly.

# MVC

A quick note about the framework that Rails uses before we continue: MVC stands for "model, view, controller":

* Models: the data of your app, objects where you can store and retrieve information
* Views: as the name says, this is what a user will see and interact with
* Controllers: the logic that dictates how your app will behave

Since this is an API we won't be working with views. After all we're just after data and don't need to build a website for a user to interact with. That can either be later down the line, or more preferrably handled in a separate app on the front end.

# Model generation

We're going to make a little music API that has artists and songs. Rails once again makes this part easy for us. We can type in the terminal the following to create our two models:

`rails generate resource Artist _________`

or the shorter

`rails g resource Artist _________`

We can generate many things this way: a migration, a model, a controller, etc., but we use `resource` in this case since it will create the model, controller, and the routes we need to connect to. We'll want our Artist to contain certain information like the artist's name, origin, and its genre. We'll also want the songs to have a name, artist_id (since we have an artist model to link it to), album name, and length. Here's how we'll generate our models:

`rails g resource Artist name origin genre`
`rails g resource Song name artist_id:integer album length`

If you noticed our `artist_id` has an integer attached to it. All of these attributes will default to a string, but if we wanted to we can make them into other data types like an integer like the `artist_id:integer` above, or a boolean `active:boolean`.

Once you type these in you'll get another bit of text, including invoking active_record, controller, and routes along with creating the necessary files which I'll cover shortly. A quick note that **ActiveRecord** is very important in making your API work and you'll see its name pop up quite a bit in your program, but getting into that will take a much longer time so I'll leave that for another post.

If you'd like to see where this model generation occurs, look at the `create    db/migrate/20171025192202_create_artists.rb` line. The `/db/migrate` folder contains files with a string of numbers (the date and time you did your `rails g` model generation), create, and then the model you made. Opening up the artists file:

```ruby
class CreateArtists < ActiveRecord::Migration[5.1]
  def change
    create_table :artists do |t|
      t.string :name
      t.string :origin
      t.string :genre

      t.timestamps
    end
  end
end
```

you'll see the class `CreateArtists` that inherits an Active Record migration. Inside this class is a change method, then the artists table creation which includes your name origin and genre strings as the columns to your table, along with some timestamps which give you info about the creation time and last modified time of any row you add to your table.

You now have your models!

# Model relationships

Onto the `create    app/models/artist.rb` line. Here is where we can add some logic to the models such as validations, keys, aliases, or what we'll be focusing on: relationships. Relationships are ways that you can make different tables interact with one another in a variety of ways.

Opening up the `app/models` folder there will be an `application_record.rb` which we don't need to worry about, just to keep in mind that it connects to Active Record once again, this time to the base to handle how the tables behave. If you open up `artist.rb` and `song.rb` you'll see:

```ruby
# app/models/artist.rb
class Artist < ApplicationRecord
end

# app/models/song.rb
class Song < ApplicationRecord
end
```

Here's where we'll add in some relationships. Thinking about it logically, an artist can have many songs, which means that songs belong to an artist. This is known appropriately as a **has-many belongs-to** relationship, and it's easy enough to put into our models:

```ruby
# app/models/artist.rb
class Artist < ApplicationRecord
  has_many :songs
end

# app/models/song.rb
class Song < ApplicationRecord
  belongs_to :artist
end
```

Other relationships include many-to-many, one-to-one, etc., examples which you can find [here](https://code.tutsplus.com/articles/sql-for-beginners-part-3-database-relationships--net-8561). The thing to keep in mind is that if you have many of something then the table name will be plural, like `has_many :songs` above, and if there's only one thing it will be singular like `belongs_to :artist` above or `has_one :artist`.

I'll cover how we can use these relationships later on, but bascially this allows us to say "give me an artist's songs", or "give me the artist this song belongs to". I mentioned before when talking about **artist_id** that we had the artist model to link it to. We just made that link using relationships so an artist with an ID of 1 and a song with an artist_id of 1 will automatically be linked together!

# Migrating your models into tables

We have our models set up but no actual tables are made. We have to run a few commands to actually make your table but again it's very simple to do. The `rake` commands will help us through the process and handle everything for us. Here are the strings of commands to type in:

`rake db:create` (creates the basic databases)

```bash
Created database 'test_api_development'
Created database 'test_api_test'
```

`rake db:migrate` (puts the models you generated into the database)

```bash
== 20171025192202 CreateArtists: migrating ====================================
-- create_table(:artists)
   -> 0.0337s
== 20171025192202 CreateArtists: migrated (0.0338s) ===========================

== 20171025192209 CreateSongs: migrating ======================================
-- create_table(:songs)
   -> 0.0111s
== 20171025192209 CreateSongs: migrated (0.0112s) =============================
```

`rake db:migrate RAILS_ENV=development` (same thing, but migrates into the dev database)

Now you can load up your Rails console by typing in `rails c` and see your database and models! Type in `Artist` or `Song` to see your tables (you may have to do Artist.connection first to connect to the database)

```ruby
# Artist
Artist(id: integer, name: string, origin: string, genre: string, created_at: datetime, updated_at: datetime)

# Song
Song(id: integer, name: string, artist_id: integer, album: string, length: string, created_at: datetime, updated_at: datetime)
```

FYI it's our friend Active Record that's allowing us to simply type in Artist or Song to tap into the database.

For the many rake commands above, it's a hassle to always type them in especially if you have to change tables, seed new data, etc., so here's a shortcut that allows you to type in one command. If you go into your `Rakefile` you can copy and paste this at the bottom:

```ruby
namespace :db do

  desc "reload and prep for scraping"
  task :reload => :environment do
    system("rake db:drop")
    system("rake db:create")
    system("rake db:migrate")
    system("rake db:migrate RAILS_ENV=development")
    puts 'Database Ready'
  end

end
```

Namespace lets us say "type `db` first" then the task of `:reload` is what it acts on. Put together in your terminal you can simply type in `rake db:reload` and it will first drop your database then do all the commands above for you!

# RESTful routes

In our rails console we can manage our database by viewing rows, creating new rows, editing existing rows, or deleting rows. These are part of what's known as the 7 RESTful routes which from the standpoint of our artists table are:

route | explanation
---|---
index | display a list of all artists
new | HTML form for creating a new artist
create | create a new artist
show | display a specific artist
edit | return an HTML form for editing a artist
update | update a specific artist
destroy | delete a specific artist

You can visit [this site](http://restfulrouting.com/#introduction) for an intro to RESTful routes, and I also made a [cheat sheet](https://docs.google.com/spreadsheets/d/1YWPb6BsZjMorn4XGMA5o7qGKvgYNLJTgtrbhoceZvkw/edit?usp=sharing) with controller actions, usage, SQL, and more. In fact let's add the SQL to the table above:

route | explanation | SQL
---|---|---
index | display a list of all artists | SELECT * FROM song
new | HTML form for creating a new artist | N/A
create | create a new artist | INSERT INTO song (column) VALUES (?)
show | display a specific artist | SELECT * FROM song WHERE id = ?
edit | return an HTML form for editing a artist | SELECT * FROM song WHERE id = ?
update | update a specific artist | UPDATE song SET column = ? WHERE id = ?
destroy | delete a specific artist | DELETE FROM song WHERE id = ?

So how do we actually use these RESTful routes? Once again we have our favorite recurring theme of this post: using Active Record to help us out. Open up your Rails console again, and just like before when we typed in Artist or Song to see the tables, we can type in `Artist.all` or `Song.all` to get a list of all songs (they're empty for now but they're there)

```ruby
# Artist.all
Artist Load (2.6ms)  SELECT  "artists".* FROM "artists" LIMIT $1  [["LIMIT", 11]]
=> #<ActiveRecord::Relation []>

# Song.all
Song Load (2.7ms)  SELECT  "songs".* FROM "songs" LIMIT $1  [["LIMIT", 11]]
=> #<ActiveRecord::Relation []>
```

Notice something on the return? It's giving us the SQL that `Artist.all` points to, specifically `SELECT * FROM artists`. With that knowledge, let's add Active Record to the table above:

route | AR | SQL
---|---|---
index | Artist.all | SELECT * FROM song
new | Artist.new(params) | N/A
create | @artist.save | INSERT INTO song (column) VALUES (?)
show | Artist.find(id) | SELECT * FROM song WHERE id = ?
edit | Artist.find(id) | SELECT * FROM song WHERE id = ?
update | @artist.save / update | UPDATE song SET column = ? WHERE id = ?
destroy | @artist.destroy / delete | DELETE FROM song WHERE id = ?

`@artist` is an object that has an artist's data. With your console still open let's tackle the **new** RESTful route and make a new entry:

```ruby
@artist = Artist.new
@artist #=> <Artist id: nil, name: nil, origin: nil, genre: nil, created_at: nil, updated_at: nil>
```

Note we did not put the artist into the database yet, just created an object with an Artist's attributes hence why no SQL was fired off. Let's add some info to the attributes:

```ruby
@artist.name = "Queen"
@artist.origin = "London, England"
@artist.genre = "Rock"
@artist #=> <Artist id: nil, name: "Queen", origin: "London, England", genre: "Rock", created_at: nil, updated_at: nil>
```

We don't touch the id, created_at, or updated_at since they'll automatically be populated when we save the artist to our database, which is what we'll do now with our **create** RESTful route:

```sql
@artist.save
   (2.1ms)  BEGIN
  SQL (25.9ms)  INSERT INTO "artists" ("name", "origin", "genre", "created_at", "updated_at")
  VALUES ($1, $2, $3, $4, $5) RETURNING "id"  [["name", "Queen"], ["origin", "London, England"],
  ["genre", "Rock"], ["created_at", "2017-10-25 22:04:29.052588"], ["updated_at", "2017-10-25 22:04:29.052588"]]
   (4.4ms)  COMMIT
=> true
```

We can do the attribute population all at once:

```ruby
@artist = Artist.new(name: "Rush", origin: "Ontario, Canada", genre: "Rock")
#=> <Artist id: nil, name: "Rush", origin: "Ontario, Canada", genre: "Rock", created_at: nil, updated_at: nil>
@artist.save
(1.9ms)  BEGIN
  SQL (15.8ms)  INSERT INTO "artists" ("name", "origin", "genre", "created_at", "updated_at")
  VALUES ($1, $2, $3, $4, $5) RETURNING "id"  [["name", "Rush"], ["origin", "Ontario, Canada"],
  ["genre", "Rock"], ["created_at", "2017-10-25 22:06:01.996880"], ["updated_at", "2017-10-25 22:06:01.996880"]]
(2.3ms)  COMMIT
=> true
```

Since we're doing it directly we can skip the **new** process altogether and go right to the **create**:

```ruby
Artist.create(name: "Metallica", origin: "Los Angeles, California", genre: "Metal")
(1.6ms)  BEGIN
  SQL (12.5ms)  INSERT INTO "artists" ("name", "origin", "genre", "created_at", "updated_at") VALUES ($1, $2, $3, $4, $5) RETURNING "id"  [["name", "Metallica"], ["origin", "Los Angeles, California"], ["genre", "Metal"], ["created_at", "2017-10-25 22:11:51.499988"], ["updated_at", "2017-10-25 22:11:51.499988"]]
(3.6ms)  COMMIT
#=> <Artist id: 3, name: "Metallica", origin: "Los Angeles, California", genre: "Metal", created_at: "2017-10-25 22:07:51", updated_at: "2017-10-25 22:07:51">
```

Now that we some artists, let's create some songs that belong to those artists. Our current artists are:

ID 1 - Queen
ID 2 - Rush
ID 3 - Metallica

```ruby
Song.create(name: "Don't Stop Me Now", artist_id: 1, album: "Jazz", length: "3:29")
Song.create(name: "Somebody To Love", artist_id: 1, album: "A Day at the Races", length: "4:57")
Song.create(name: "Princes of the Universe", artist_id: 1, album: "A Kind of Magic", length: "3:32")

Song.create(name: "Subdivisions", artist_id: 2, album: "Signals", length: "5:34")
Song.create(name: "Red Barchetta", artist_id: 2, album: "Moving Pictures", length: "6:06")
Song.create(name: "Far Cry", artist_id: 2, album: "Snakes & Arrows", length: "5:21")

Song.create(name: "For Whom the Bell Tolls", artist_id: 3, album: "Ride the Lightning", length: "5:09")
Song.create(name: "Battery", artist_id: 3, album: "Master of Puppets", length: "5:12")
Song.create(name: "One", artist_id: 3, album: "...And Justice for All", length: "7:24")
```

Now we have 9 songs at our disposal and can type in our **index** RESTful route of `Artist.all` or `Song.all` to see them, and because of our models and their relationships we can see an artist's songs or a song's artist:

```ruby
Artist.first
# Artist Load (0.6ms)  SELECT  "artists".* FROM "artists" ORDER BY "artists"."id" ASC LIMIT $1  [["LIMIT", 1]]
# or
Artist.find(1)
Artist.find_by(id: 1)
# Artist Load (0.6ms)  SELECT  "artists".* FROM "artists" WHERE "artists"."id" = $1 LIMIT $2  [["id", 1], ["LIMIT", 1]]

# all return
#=> <Artist id: 1, name: "Queen", origin: "London, England", genre: "Rock" ... >

Artist.find_by(id: 1).songs
# Artist Load (0.6ms)  SELECT  "artists".* FROM "artists" WHERE "artists"."id" = $1 LIMIT $2  [["id", 1], ["LIMIT", 1]]
# Song Load (0.6ms)  SELECT  "songs".* FROM "songs" WHERE "songs"."artist_id" = $1 LIMIT $2  [["artist_id", 1], ["LIMIT", 11]]

#=> <ActiveRecord::Associations::CollectionProxy [
  #<Song id: 1, name: "Don't Stop Me Now", artist_id: 1, album: "Jazz", length: "3:29", ... >,
  #<Song id: 2, name: "Somebody To Love", artist_id: 1, album: "A Day at the Races", length: "4:57", ... >,
  #<Song id: 3, name: "Princes of the Universe", artist_id: 1, album: "A Kind of Magic", length: "3:32", ... ]>

Song.find_by(id: 1)
# Song Load (0.7ms)  SELECT  "songs".* FROM "songs" WHERE "songs"."id" = $1 LIMIT $2  [["id", 1], ["LIMIT", 1]]

#=> #<Song id: 1, name: "Don't Stop Me Now", artist_id: 1, album: "Jazz", length: "3:29", ... >

Song.find_by(id: 1).artist
# Song Load (0.8ms)  SELECT  "songs".* FROM "songs" WHERE "songs"."id" = $1 LIMIT $2  [["id", 1], ["LIMIT", 1]]
# Artist Load (0.4ms)  SELECT  "artists".* FROM "artists" WHERE "artists"."id" = $1 LIMIT $2  [["id", 1], ["LIMIT", 1]]

#=> #<Artist id: 1, name: "Queen", origin: "London, England", genre: "Rock", ... >
```

Everything works as normal!

# Seeding this data

This is great that we can use the Rails console for all this work but if we ever reset the database we'd have to do it all over again. This is where seeding our data comes into play. If you open up `db/migrate/seeds.rb` you can put EVERYTHING we just did in there:

```ruby
Artist.create(name: "Queen", origin: "London, England", genre: "Rock")
Artist.create(name: "Rush", origin: "Ontario, Canada", genre: "Rock")
Artist.create(name: "Metallica", origin: "Los Angeles, California", genre: "Metal")

Song.create(name: "Don't Stop Me Now", artist_id: 1, album: "Jazz", length: "3:29")
Song.create(name: "Somebody To Love", artist_id: 1, album: "A Day at the Races", length: "4:57")
Song.create(name: "Princes of the Universe", artist_id: 1, album: "A Kind of Magic", length: "3:32")

Song.create(name: "Subdivisions", artist_id: 2, album: "Signals", length: "5:34")
Song.create(name: "Red Barchetta", artist_id: 2, album: "Moving Pictures", length: "6:06")
Song.create(name: "Far Cry", artist_id: 2, album: "Snakes & Arrows", length: "5:21")

Song.create(name: "For Whom the Bell Tolls", artist_id: 3, album: "Ride the Lightning", length: "5:09")
Song.create(name: "Battery", artist_id: 3, album: "Master of Puppets", length: "5:12")
Song.create(name: "One", artist_id: 3, album: "...And Justice for All", length: "7:24")
```

Reload the database by typing in that Rakefile command we added: `rake db:reload`. Open up the rails console and you'll see nothing's there if you type in `Artist.all` or `Song.all`. Exit back out to the main terminal and type in `rake db:seed`. After a short period of time the next line will appear as if nothing happened, buf if you go back into your rails console and look for the artists and songs everything's there!

# Controller setup and the Rails server

So it's great we can manipulate these RESTful routes in the console or seed the data but right now we can't to do this via our app. Onto the `invoke  controller` and `create    app/controllers/artists_controller.rb` lines.

As I mentioned before the controller is the logic to our API. Let's look again at the Active Record commands:

route | explanation | AR
---|---|---
index | display a list of all artists | Artist.all
new | HTML form for creating a new artist | Artist.new(params)
create | create a new artist | @artist.save
show | display a specific artist | Artist.find(id)
edit | return an HTML form for editing a artist | Artist.find(id)
update | update a specific artist | @artist.save / update
destroy | delete a specific artist |  @artist.destroy / delete

In this specific app we're only going to using the **index** and **show** routes. Open up `app/controllers/artists_controller.rb` and you'll see:

```ruby
class ArtistsController < ApplicationController
end
```

It's here that we can add in commands similar to what we used in the rails console. Referencing the table above we know that **index** is `Artist.all` and **show** is `Artist.find(id)` or `Artist.find_by(id: id)`. Let's tackle our index method first. The first step is defining our index method:

```ruby
class ArtistsController < ApplicationController

  def index
  end

end
```

We'll then insert our command inside of it:

```ruby
class ArtistsController < ApplicationController

  def index
    Artist.all
  end

end
```

Save your work and let's start up our rails server by typing into your terminal `rails s`. Once your server is running you'll see a line `* Listening on tcp://0.0.0.0:3000` which means you can go to http://localhost:3000/ and see that your server is up and running with the default "Yay! You’re on Rails!" welcome screen.

We can access our artist model by visiting http://localhost:3000/artists - but nothing happens when you do. Go back to your mac terminal and you'll see the following message:

```bash
Started GET "/artists" for 127.0.0.1 at 2017-10-25 22:19:54 -0400
Processing by ArtistsController#index as HTML
Completed 204 No Content in 2ms (ActiveRecord: 0.0ms)
```

This is because we returned `Artist.all` but we're not rendering any content. We can render out our result as HTML by doing:

```ruby
class ArtistsController < ApplicationController

  def index
    render html: Artist.all
  end

end
```

And get back the enumerator `#<Artist::ActiveRecord_Relation:0x007fc9751ad100>` but that isn't helpful for looking at an API. Instead we can render as JSON:

```ruby
class ArtistsController < ApplicationController

  def index
    render json: Artist.all
  end

end
```

And voila we can see loads of data!

```ruby
[
  {
    id: 1,
    name: "Queen",
    origin: "London, England",
    genre: "Rock",
    created_at: "2017-10-26T02:39:48.053Z",
    updated_at: "2017-10-26T02:39:48.053Z"
  },
  {
    id: 2,
    name: "Rush",
    origin: "Ontario, Canada",
    genre: "Rock",
    created_at: "2017-10-26T02:39:48.064Z",
    updated_at: "2017-10-26T02:39:48.064Z"
  },
  {
    id: 3,
    name: "Metallica",
    origin: "Los Angeles, California",
    genre: "Metal",
    created_at: "2017-10-26T02:39:48.069Z",
    updated_at: "2017-10-26T02:39:48.069Z"
  }
]
```

And in our terminal we now see that the correct SQL fired off:

```bash
Started GET "/artists" for 127.0.0.1 at 2017-10-25 22:21:26 -0400
Processing by ArtistsController#index as HTML
  Artist Load (0.6ms)  SELECT "artists".* FROM "artists"
Completed 200 OK in 7ms (Views: 5.9ms | ActiveRecord: 0.6ms)
```

Now let's try adding the **show** route:

```ruby
class ArtistsController < ApplicationController

  def index
    render json: Artist.all
  end

  def show
    render json: Artist.find(id)
  end

end
```

And we can show a specific artist with the id of 1 by going to http://localhost:3000/artists/1 - but we get the following error:

`NameError in ArtistsController#show
undefined local variable or method 'id' for #<ArtistsController:0x007fc974cceb70>`

Our **show** method doesn't know what an 'id' is. Let's quickly debug this and learn something very important in the process. Put `byebug` at the beginning of our show method:

```ruby
class ArtistsController < ApplicationController

  def index
    render json: Artist.all
  end

  def show
    byebug
    render json: Artist.find(id)
  end

end
```

Reload http://localhost:3000/artists/1 and go to your terminal to see that your program stops at the byebug and allows you to type commands in as if you were inside your application. Typing in `id` get you the NameError Exception, so where is our id located? Introducing **parameters**, how Active Record handles table attributes. If you type in `params` you'll get back:

`<ActionController::Parameters {"controller"=>"artists", "action"=>"show", "id"=>"1"} permitted: false>`

You'll notice this is a hash that has the controller, action, and id, so we can type in `params[:id]` to access the id and get back "1". All we need to do is substitute `id` for `params[:id]` in our method and it should work:

```ruby
class ArtistsController < ApplicationController

  def index
    render json: Artist.all
  end

  def show
    render json: Artist.find(params[:id])
  end

end
```

In your terminal type in `exit` to exit the byebug instance, then reload http://localhost:3000/artists/1 and success!

```ruby
{
  id: 1,
  name: "Queen",
  origin: "London, England",
  genre: "Rock",
  created_at: "2017-10-26T02:39:48.053Z",
  updated_at: "2017-10-26T02:39:48.053Z"
}
```

Try doing the same thing for the songs controller on your own. Once you're done your two controllers should look like this:

```ruby
class ArtistsController < ApplicationController

  def index
    render json: Artist.all
  end

  def show
    render json: Artist.find(params[:id])
  end

end


class SongsController < ApplicationController

  def index
    render json: Song.all
  end

  def show
    render json: Song.find(params[:id])
  end

end
```

# Routes

There's one very important thing that Rails did for you automatically when you generated your resource and that's the resources themselves. This is the final piece of the generated pieces: `invoke  resource_route` and `route    resources :artists`. If you go into `config/routes.rb` you'll notice the following:

```ruby
Rails.application.routes.draw do
  resources :songs
  resources :artists
end
```

What this file does is allow us to use the 7 RESTful routes in our URL like we just did. Try deleting the `resources` lines and reloading http://localhost:3000/artists or http://localhost:3000/artists/1 and you'll get an error:

`Routing Error
No route matches [GET] "/artists"

Routing Error
No route matches [GET] "/artists/1"`

These `resources` lines automatically redirect the URL to the appropriate controller RESTful action. Examples of what it looks like to have the **index** or **show** routes are:

```ruby
get '/artists', to:'artists#index'
get '/artists/:id', to:'artists#show'
```

and the `resources` handle all 7 routes. In the case of our application we only want to route to the **index*** or **show** routes, and we can easily do that by tweaking our code:

```ruby
Rails.application.routes.draw do
  resources :songs, only: [:index, :show]
  resources :artists, only: [:index, :show]
end
```

Now we limited our resources to only these two routes! We can use `exclude: [:new, :create, :etc]` as well if we wanted to.

# CORS

At this point we have a finished API! We can pat ourselves on the backs but there's one major issue: external apps can't access the application at all. If we try we'll get an error:

`Failed to load http://localhost:3000/artist: No 'Access-Control-Allow-Origin' header is present on the requested resource. Origin 'null' is therefore not allowed access.`

This appears because Rails has a security feature to prevent external applications from accessing the database, which is very useful if someone say wants to access your **destroy** route and remove all entries in your database. Thankfully there's something called CORS that comes to the rescue and allows us to either bypass this security feature or set restrictions on it.

Go into your `Gemfile` and on lines 25-26 you'll see the `Rack CORS` gem. As line 25 says:

`Use Rack CORS for handling Cross-Origin Resource Sharing (CORS), making cross-origin AJAX possible`

First uncomment line 26's `gem 'rack-cors'`, save the file, then run `bundle install` in your terminal.

After that open up `config/application.rb` to where your `module TestApi` is located. Copy and paste this over that module:

```ruby
module TestApi
  class Application < Rails::Application
    config.load_defaults 5.1

    config.api_only = true
    Rails.application.config.middleware.insert_before 0, Rack::Cors do
      allow do
        origins '*'
        resource '*',
          headers: '*',
          methods: [:get, :post, :put, :patch, :delete, :options, :head]
      end
    end
  end
end
```

These two steps of putting `gem 'rack-cors'` in your `Gemfile` and adding the `Rack::Cors` config in your `config/application.rb` are the fix!

A quick and **very important** note though: doing `origins '*'` is extremely risky as the `*` is a wildcard character meaning ANYONE can access your API now. For purposes of our test application that doesn't matter since we only have **index** and **show** as our routes, but if you have **edit** **update** or **destroy** routes then others can take advantage of it and easily mess with your API and database. In that case you can change the line to `origins 'http://www.your-site-here.com'` to only allow your specific external site to access the API. You can also (or alternatively) consense the `methods` line to `:methods => [:get]` to limit routes to only receive data.

# Better practices

### API versions

Because APIs can sometimes change over time, it's important to have versions of your API. You can do the following to add this to your API in a simple three-step process:

1) move your controllers into `app/controllers/api/V1/`

2) change your controller classes to

```ruby
class Api::V1::ArtistsController < ApplicationController

  def index
    render json: Artist.all
  end

  def show
    render json: Artist.find(params[:id])
  end

end


class Api::V1::SongsController < ApplicationController

  def index
    render json: Song.all
  end

  def show
    render json: Song.find(params[:id])
  end

end
```

3) change your `config/routes.rb` to

```ruby
Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do

      resources :songs, only: [:index, :show]
      resources :artists, only: [:index, :show]

    end
  end
end
```

### Using @ in the controllers

You'll notice in the tables:

route | explanation | AR
---|---|---
index | display a list of all artists | Artist.all
new | HTML form for creating a new artist | Artist.new(params)
create | create a new artist | @artist.save
show | display a specific artist | Artist.find(id)
edit | return an HTML form for editing a artist | Artist.find(id)
update | update a specific artist | @artist.save / update
destroy | delete a specific artist |  @artist.destroy / delete

there's `@artist`. This is a class object and it's more proper to create these in each of your RESTful routes, especially since you'll create the object once (useful for if you have to fire off SQL to do so) and then can work on it. If you're conditionally rendering HTML or JSON based on use for a website vs. just viewing the tables directly it will help even more. Here's an example of the 7 restful routes:

```ruby
class ArtistsController < ApplicationController

  def index
    @artists = Artist.all
    render json: @artists
  end

  def new
    @artist = Artist.new
    render json: @artist
  end

  def create
    @artist = Artist.new(name: params[:name], origin: params[:origin], genre: params[:genre])
    # make sure it correctly saves, otherwise it will error
    if @artist.save
      render json: @artist
    end
  end

  def show
    @artist = Artist.find(params[:id])
    render json: @artist
  end

  def edit
    @artist = Artist.find(params[:id])
    render json: @artist
  end

  def update
    @artist = Artist.find(params[:id])
    # make sure it correctly updates, otherwise it will error
    if @artist.update(name: params[:name], origin: params[:origin], genre: params[:genre])
      render json: @artist
    end
  end

  def destroy
    @artist = Artist.find(params[:id])
    @artist.destroy
    # redirect back to index once done
    render json: Artist.all
  end

end
```

### Strong params

If your API has writing capabilities (POST methods) like **create** or **update** you'll want to make sure the information being added to your database is correct. Strong params will prevent your database from updating unless the info is valid. Taking a look at the **create** route above:

```ruby
def create
  @artist = Artist.new(name: params[:name], origin: params[:origin], genre: params[:genre])
  # make sure it correctly saves, otherwise it will error
  if @artist.save
    render json: @artist
  end
end
```

the params are `:name, :origin, :genre` which we can simplify to `artist_params` which will be a method we'll create shortly:

```ruby
def create
  @artist = Artist.new(artist_params)
  # make sure it correctly saves, otherwise it will error
  if @artist.save
    render json: @artist
  end
end
```

That method will be added to the controller. We'll get all parameters using `params`, then require it to be from the `:artist` model, and permit the `:name, :origin, :genre` to be accepted and validated. Putting it all together we get:

```ruby
def artist_params
  params.require(:artist).permit(:name, :origin, :genre)
end
```

And finally since we don't want anyone other than the application itself to mess with this data we can make the method private by simply putting in the line `private` in our controller and inserting the `artist_params` below it:


```ruby
class ArtistsController < ApplicationController

  def index
    @artists = Artist.all
    render json: @artists
  end

  def new
    @artist = Artist.new
    render json: @artist
  end

  def create
    @artist = Artist.new(artist_params)
    # make sure it correctly saves, otherwise it will error
    if @artist.save
      render json: @artist
    end
  end

  def show
    @artist = Artist.find(params[:id])
    render json: @artist
  end

  def edit
    @artist = Artist.find(params[:id])
    render json: @artist
  end

  def update
    @artist = Artist.find(params[:id])
    # make sure it correctly updates, otherwise it will error
    if @artist.update(artist_params)
      render json: @artist
    end
  end

  def destroy
    @artist = Artist.find(params[:id])
    @artist.destroy
    # redirect back to index once done
    render json: Artist.all
  end

  private

  def artist_params
    params.require(:artist).permit(:name, :origin, :genre)
  end

end
```

---

There you have it, a working API! You can either add to this API by adding views and making it an application, or do what I do and make a separate application with JavaScript / React / etc. that can tap into this API. Try out the other relationship types between methods, or adding the other RESTful routes to your program. There's so much you can do so get to it!

Code on.

Mike Merin
