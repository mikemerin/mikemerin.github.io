---
layout: post
title:  "Custom Routes, Endpoints, and SQL"
subtitle: "WeatherCraft blog part 2: letting the back end do work for you"
date: 2017-07-24 20:28:08 -0400
tags: Ruby, Rails, SQL, ActiveRecord
series: WeatherCraft Blog
projects: WeatherCraft
summary: Creating an API that works best for your front end
---
Your back end API is set up, your database is seeded, your RESTful routes and endpoints are available, what's next? Well a whole, whole lot.

While RESTful routes can show single points of data or all of it, when you have an enormous amount of data at your fingertips that's just the tip of the iceberg. The beauty of big data lies in the almost endless ways you can use any part of it.

When it first rolled out, my [WeatherCraft API](https://github.com/mikemerin/WeatherCraftAPI) had 4.6 million rows in its database (it originally had 500 million rows but my tiny little laptop couldn't handle the load). The three tables were station data, their monthly data, and their daily data. Sure I could pull out any single row to display that data but with this **much** data at my fingertips I could do **so** much more with it.

In [part 1](https://mikemerin.github.io/WeatherCraft-blog-1/) of this series of posts I talked about how to scrape all of this data. Let's go through how I set up my routes, starting off with the basics and ending with some more fancy stuff.

---

# Overview
---

Just to quickly go over what I'm working with, here's what my schema/table looks like for my Rails API:

```ruby
class CreateDailies < ActiveRecord::Migration[5.1]
  def change
    create_table :dailies do |t|
      t.string :wban
      t.string :year_month_day
      t.string :tmax
      t.string :tmin
      t.string :tavg
      t.string :depart
      t.string :dew_point
      t.string :sunrise
      t.string :sunset
      t.string :code_sum
      t.string :depth
      t.string :snow_fall
      t.string :precip_total
      t.string :avg_speed
      t.string :max5_speed
      t.string :max5_dir
      t.string :max2_speed
      t.string :max2_dir

      t.timestamps
    end
  end
end

```
Here are my models. I link everything by a station's `wban` which is its unique ID. This is important and I'll come back to this in the next section. By setting up my table relationships and linking the primary/foreign keys by `wban` we get:

```ruby
class Station < ApplicationRecord
  has_many :hourlies, primary_key: "wban", foreign_key: "wban"
  has_many :dailies, primary_key: "wban", foreign_key: "wban"
  has_many :monthlies, primary_key: "wban", foreign_key: "wban"
end

class Monthly < ApplicationRecord
  belongs_to :station, primary_key: "wban", foreign_key: "wban"
end

class Daily < ApplicationRecord
  belongs_to :station, primary_key: "wban", foreign_key: "wban"
end
```

And finally my controllers. I'll just go over my `dailies` controller as the others are very similar in their basic forms. I'm only using the `index` and `show` routes here, though I have strong params in case I want to expand to use `create` or `update` in the future. For my routes I render out the json needed for it:

```ruby
class Api::V1::DailiesController < ApplicationController

  def index
    @dailies = Daily.all
    render json: @dailies
  end

  def show
    @dailies = Daily.where(wban: params[:id])
    render json: @dailies
  end

  private

  def daily_params
    params.require(:daily).permit(
      :wban, :year_month_day,
      :tmax, :tmin, :tavg, :depart, :dew_point,
      :sunrise, :sunset, :code_sum,
      :depth, :snow_fall, :precip_total,
      :result_speed, :result_dir, :avg_speed,
      :max5_speed, :max5_dir, :max2_speed, :max2_dir
      )
  end

end
```

And notice that I have my controller as `Api::V1::DailiesController` because this file is in `controllers/api/v1` just in case I change the way the API works in the future.

# Basic Routes
---

Normally you can do something simple with routes using `resources`. For example if I want to restrict only showing the `index` and `show` routes I'd do:

```ruby
Rails.application.routes.draw do

  namespace :api do
    namespace :v1 do

      resources :monthlies, only: [:index, :show]
      resources :dailies, only: [:index, :show]
      resources :stations, only: [:index, :show]

    end
  end

end
```

Side-note: the `namespace` is important here because my controller is in `controller/api/v1` as I mentioned before.

As I said before though I'm not showing these by their normal `INTEGER PRIMARY KEY` but rather their `wban` ID. This is easy enough to do in our models by using a `get` script. In this case we'll designate the URL route as a `wban` and redirect it to our controller's `show` method.

```ruby
Rails.application.routes.draw do

  namespace :api do
    namespace :v1 do

      resources :monthlies, only: [:index, :show]
      resources :dailies, only: [:index, :show]
      resources :stations, only: [:index, :show]

      get '/monthlies/:wban', to: 'stations#show'
      get '/dailies/:wban', to: 'stations#show'
      get '/stations/:wban', to: 'stations#show'

    end
  end

end
```

Great now we can load up our API by typing in `rails s` and going to `http://localhost:3000/api/v1/monthlies` to see all station data, or `http://localhost:3000/api/v1/stations/94728` for example to see the station with the `wban` of 94728 which is Central Park. For the stations I also use a gem called "friendly_id" so I can use the callsign in my URL, in the case above `http://localhost:3000/api/v1/stations/NYC` for Central Park. This is how it looks when I type it into my URL:

![Central Park Station](http://imgur.com/RW9IPSb.png)

I can also do `http://localhost:3000/api/v1/dailies/94728` however this would get us ALL daily data from Central Park which in my case is 3,714 different days. How can we get a specific date?

# Nested Route
---

Right now we have the following URL route and function:

```ruby
# URL
'http://localhost:3000/api/v1/dailies/94728'

# which uses the route
get '/dailies/:wban', to: 'stations#show'

# to hit this function in our DailiesController
def show
  @dailies = Daily.where(wban: params[:id])
  render json: @dailies
end
```

We're passing the URL's `94728` as the `:wban` and finding the right entries in our database that match it. We can go one step further and use the table's `year_month_day` column as another nested route, then write a script in our controller that will find that station's specific daily entry. In our `Dailies` table our `year_month_day` column is formatted `YYYYMMDD` so let's use that as our URL and then pass it in as our params:

```ruby
# URL
'http://localhost:3000/api/v1/dailies/94728/20160123'

# which uses the route
get '/dailies/:wban/:year_month_day', to: 'dailies#entry'

# to hit this function in our DailiesController
def entry
  @daily = Daily.find_by(wban: params[:wban], year_month_day: params[:year_month_day])
  render json: [@daily]
end
```

Notice how `@daily` is in square `[]` brackets. This is because we were previously using `Daily.where` which returns an array of results even if only one is found, unlike `Daily.find_by` which only returns the object. We manually add the brackets so our front end can parse the results no matter what. This `Daily.find_by` effectively fires off the SQL:

```sql
SELECT * FROM dailies WHERE wban = '94728' AND year_month_day = '20160123' LIMIT 1
```

Which in Rails and ActiveRecord can be written as:

```ruby
ActiveRecord::Base.connection.execute("SELECT * FROM dailies WHERE wban = '94728' AND year_month_day = '20160123' LIMIT 1")
```

Keep this ActiveRecord trick in mind for later, we'll need it. Anyways using this URL/route/controller function we'll now see the following JSON:

![Central Park on January 23, 2016](http://imgur.com/BK1dZCW.png)

Now that we have all of this information at our fingertips, we can fetch it from our front end and make it more eye-friendly. I'll get to how to do the actual fetching and converting in the next part of this blog, but here's a pre-final version of what it will look like:

![KNYC 20160123 Front End](http://imgur.com/APiZxP0.png)

# Nesting Another Route - Weekly
---

Hold on, while the top part has data from January 23rd 2016, the bottom has **weekly** information. How did we get that? In this project we can get information 5 days before and after the chosen date. Although the solution looks fairly simple, this wasn't as trivial to do with our database as you may think so let's break it down.

Starting off with the URL we want to use, let's just tack on "adjacent" to the end:

```ruby
# URL
'http://localhost:3000/api/v1/dailies/94728/20160123/adjacent'
```

And let's just call our new controller method "entry_adjacent", then define that as our new route:

```ruby
# which uses the route
get '/dailies/:wban/:year_month_day/adjacent', to: 'dailies#entry_adjacent'
```

As for writing our new script to get the entries from our database, as I mentioned in [part 1](https://mikemerin.github.io/WeatherCraft-blog-1/) of this series of posts we want to limit the amount of times we communicate with our database, as the more queries we send to it the longer it will take especially when the size of our database grows. Let's do the worst case and then turn it around with a nice trick.

We need to get specific records in order to make this work. In our example we need:

wban | date | adjacent
- | - | -
94728 | 20160118 | -5
94728 | 20160119 | -4
94728 | 20160120 | -3
94728 | 20160121 | -2
94728 | 20160122 | -1
94728 | 20160123 | 0
94728 | 20160124 | +1
94728 | 20160125 | +2
94728 | 20160126 | +3
94728 | 20160127 | +4
94728 | 20160128 | +5

Now we can simply write a script that finds the five dates ahead or behind the date that matches the station's wban number, but that would cause two issues. See if you can spot them:

```ruby
def entry_adjacent
  @dailies = []
  (-5..5).to_a.each { |x| @dailies << Daily.find_by(wban: params[:wban], year_month_day: (params[:year_month_day]) + x ) ) }
  render json: @dailies
end
```

While this script happens to work for the example station/date we've been working with, the first problem is that this script would need validations of it being a valid date which gets messy (30 days for June vs 31 for July, switching the year if after 1231). The second is that we'd have to send a query for every single date which again, is frowned upon.

A fix for the first problem lies in how our data is laid out. Our dailies table when seeded went in order by station and day. This means that as long as the wban matches, if we go down a row we'll get data for the next day and up a row for the previous day. We can find the id of the row for the chosen station/date first:

```ruby
day = Daily.find_by(wban: params[:wban], year_month_day: params[:year_month_day])[:id]
```

And then execute some manual ActiveRecord SQL to go down a row (add one to the id number) or up a row (subtract one) to get the correct data while also making sure the wban matches:

```ruby
def entry_adjacent
  day = Daily.find_by(wban: params[:wban], year_month_day: params[:year_month_day])[:id]
  @dailies = []
  (-5..5).to_a.each do |x|
    @dailies << ActiveRecord::Base.connection.execute("SELECT * FROM dailies where id = #{day + x} and wban = '#{params[:wban]}'")
  end
  render json: @dailies
end
```

This works great but we still have the problem of making a separate query for each item. We can make this three queries instead: one for the id, one for 5 rows above, and one for 5 rows below. We can use `ORDER BY id` we'll be able to group the data for our purposes, and use the `<` and `>=` operators to go above and below the row of the id while using `LIMIT` accordingly. Hard coding this into SQL we'd get:

```sql
-- get the 5 before, use DESC to order them from oldest entry to newest (5 days before to 1 day before)
SELECT * FROM dailies WHERE id < 3764704 AND wban = 94728 ORDER BY id DESC LIMIT 5

-- get the day itself and the 5 after
SELECT * FROM dailies WHERE id >= 3764704 AND wban = 94728 ORDER BY id LIMIT 6
```

We have everything selected, all that's left to do is add each one to our `@dailies` array and render it out!

```ruby
def entry_adjacent
  day = Daily.find_by(wban: params[:wban], year_month_day: params[:year_month_day])[:id]
  @dailies = []
  ActiveRecord::Base.connection.execute("SELECT * FROM dailies where id < #{day} and wban = '#{params[:wban]}' ORDER BY id DESC LIMIT 5").reverse_each { |x| @dailies << x }
  ActiveRecord::Base.connection.execute("SELECT * FROM dailies where id >= #{day} and wban = '#{params[:wban]}' ORDER BY id LIMIT 6").each { |x| @dailies << x }
  render json: @dailies
end
```

# Nesting Another Route - Historical
---

You may have also noticed there's another tab in our picture for "historical". This finds every piece of data from the this station from every year's *January 23rd*. Here's what it looks like when processed in the front end:

![KNYC 20160123 Front End Historical](http://imgur.com/FwLXU9X.png)

This is actually easier to do than the prior "adjacent" route, however you'll soon see there's unfortunately no way to actually lower the number of queries to make it work. As usually we'll start off with the URL we want to use, this time we'll tack on "historical" to the end:

```ruby
# URL
'http://localhost:3000/api/v1/dailies/94728/20160123/historical'
```

And we'll call our new controller method "entry_historical", then define that as our new route:

```ruby
# which uses the route
get '/dailies/:wban/:year_month_day/historical', to: 'dailies#entry_historical'
```

We'll be using a trick to pull the date out of the our `year_month_day` which usually looks like "20160123". By using the `.slice` method we'll just grab the last 4 digits:

```ruby
date = params[:year_month_day].slice(4,4)
```

Now we have a date of "0123" with the years ready to be added to the start of it. Our program uses data from May 2007 to June 2017, so we can create an array of each year and then add the date onto the end

```ruby
# create an array ["2007", "2008", "2009", ... "2017"]
years = ("2007".."2017").to_a
# attach the date onto each one
years.map! { |year| year + date }
#=> ["20070123", "20080123", "20090123", "20100123", "20110123", "20120123", "20130123", "20140123", "20150123", "20160123", "20170123"]
```

Now that we have our years array with the appropriate date, we just need to remove any dates that are before May 2007 or after June 2017:

```ruby
years.delete_if { |year| year < "20070501" || year > "20170630" }
#=> ["20080123", "20090123", "20100123", "20110123", "20120123", "20130123", "20140123", "20150123", "20160123", "20170123"]
```

In our example we removed "20070123" from our array. Now that we have the years in the form of `year_month_day` that we want to use, we'll just simply `.map!` them as their entries:

```ruby
years.map! { |entry| Daily.find_by(wban: params[:wban], year_month_day: entry) }
```

Now our `years` array contains our database rows. Putting it all together and then returning it we get:

```ruby
def entry_historical
  date = params[:year_month_day].slice(4,4)
  years = ("2007".."2017").to_a
  years.map! { |year| year + date }
  years.delete_if { |year| year < "20070501" || year > "20170630" }
  years.map! { |entry| Daily.find_by(wban: params[:wban], year_month_day: entry) }
  render json: years
end
```

As I stated before: there's unfortunately no way to actually lower the number of queries to make it work. We can use regular expressions to simply find any entry that ends in "0123" by using `LIKE` in a manual SQL query:

```ruby
def entry_historical
  date = params[:year_month_day].slice(4,4)
  @dailies = ActiveRecord::Base.connection.execute("SELECT * FROM dailies where wban = '#{params[:wban]}' AND year_month_day LIKE '%#{date}' ORDER BY year_month_day")
  render json: @dailies
end
```

But even though this is a single query instead of 10-11 separate ones, this actually takes longer to do. Why? There's no limit, and since we're using `WHERE` that means we have to search through our **ENTIRE** database which means our efficiency is worse. `.find_by` stops as soon as it finds the right thing, so best case will, with the exception of if we ask for the absolute last entry in our database, will always be faster.

---

So we covered our Rakefile/database in part 1, our API/routes in this part 2, part 3 will involve showing off this data.

Code on.

Mike Merin
