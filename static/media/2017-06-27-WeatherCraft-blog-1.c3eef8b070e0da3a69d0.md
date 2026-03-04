---
layout: post
title: "ActiveRecord and SQL with Big Data"
subtitle: "WeatherCraft blog part 1: how to scrape data quickly"
date: 2017-06-27 13:59:03 -0400
tags: Ruby, Rails, SQL, ActiveRecord
series: WeatherCraft Blog
projects: WeatherCraft
summary: Making the most out of Rails to get big data easily
---
What should you do when building an application that requires you to scrape a large amount of data? The answer is as big as the data.

In my [first project](https://github.com/mikemerin/WeatherCraftAPI) concerning big data I had a lot to learn especially from an efficiency standpoint. I've scraped data before and have created my own databases but nothing on this large of a scale. The files I downloaded totaled 60 gigabytes, yes 60, and that's pure text. How much text do you ask? One of the files was 600MB, had 50 columns of data, and 4.6 million rows. That was just one of 125 similar files between 400MB and 600MB big, and I needed to be able to scrape all that data within a short amount of time. My initial script would have taken around **5.6 months** to finish scraping that much data. By then end I got this down to **1.4 days**, around **120 times faster**. So how did I fix it? Here's my journey:

# Phase 0 - Generating ActiveRecord Resources
### (pre-scraping)
---
My project involved past weather data over a course of 10 years, including weather station data, monthly breakdowns, daily breakdowns, and hourly breakdowns. When you work with large amounts of data you want to start off small and then scale it up once it works. My station data was only 223KB so I started with that.

Let's take a look at a small section of that station data:

WBAN|WMO|CallSign|ClimateDivisionCode|ClimateDivisionStateCode|ClimateDivisionStationCode|Name|State|Location|Latitude|Longitude|GroundHeight|StationHeight|Barometer|TimeZone
---|---|---
14732|72503|LGA|04|30|5811|NEW YORK|NY|LA GUARDIA AIRPORT|40.7792|-73.88|11|31|39|-5
23234|72494|SFO|04|04|7769|SAN FRANCISCO|CA|SAN FRANCISCO INTERNATIONAL AIRPORT|37.6197|-122.3647|8|18|89|-8
93738|72403|IAD|04|44|8903|WASHINGTON|VA|WASHINGTON DULLES INTERNATIONAL AP|38.9349|-77.4473|290|323|309|-5
94728|72506|NYC|04|30|5801|NEW YORK|NY|CENTRAL PARK|40.7889|-73.9669|130|156|161|-5
94789|74486|JFK|04|30|5803|NEW YORK|NY|JOHN F KENNEDY INTERNATIONAL AIRPORT|40.6386|-73.7622|11|22|32|-5
94823|72520|PIT|09|36|6993|PITTSBURGH|PA|PITTSBURGH INTERNATIONAL AIRPORT|40.4846|-80.2144|1203|1203|1175|-5

That's already quite a few columns, and I don't need to use all of them. When I generated my `station` model I used a Rails generator:

`rails g resource station wban name callsign state location latitude longitude groundHeight stationHeight`

Which created a `/db/migrate/[20170626211645]_create_stations.rb` file that looked like

```ruby
class CreateStations < ActiveRecord::Migration[5.1]
  def change
    create_table :stations do |t|
      t.string :wban
      t.string :name
      t.string :callsign
      t.string :state
      t.string :location
      t.string :latitude
      t.string :longitude
      t.string :groundHeight
      t.string :stationHeight

      t.timestamps
    end
  end
end
```

And I made my stations_controller, which controls the RESTful conventions. Here's just the create and strong params used:

```ruby
class StationsController < ApplicationController

  def create
    @station = Station.create(station_params)
  end

  private

  def station_params
    params.require(:station).permit(
        :wban,
        :name,
        :callsign,
        :state,
        :location,
        :latitude,
        :longitude,
        :groundHeight,
        :stationHeight
        )
  end

end
```

Finally to prevent duplicate data I added this to my Station model:

```ruby
class Station < ApplicationRecord
  validates :wban, presence: true, uniqueness: true
end

```

So with that in mind I went to creating the scraper!

# Phase 1 - How to Scrape

I figured I could tap into the RESTful routes script and create a new database row using the create method:

```ruby
def create
  station = Station.new(wban: "94728", name: "NEW YORK", callsign: "NYC", ... )
  station.save
end

# or simply

def create
  Station.create(wban: "94728", name: "NEW YORK", callsign: "NYC", ... )
end
```

If you're in a rails console you can create a new database entry this way if you have the correct parameters, and then test it out by calling on our `Station` table

```ruby
Station.all.count #=> 0
Station.create(wban: "94728", name: "NEW YORK", callsign: "NYC", ... )
Station.all.count #=> 1
Station.first #=> <Station id: 1, wban: "94728", name: "NEW YORK", callsign: "NYC", ... >
```

So looking at the data above, how can we call on it? First we need the file path. You can either get the URL path, or like me if you downloaded the text file, you can get the file path by dragging the physical file into your terminal. To use that file we type in:

```ruby
file = "/Users/flatironschool/Downloads/QCLCD_Gathered/201706station.txt"
File.foreach(file)
#=> <Enumerator: File:foreach("/Users/flatironschool/Downloads/QCLCD_Gathered/201706station.txt")>
```
Now that it's an enumerator we can start pulling information from it!

I know I listed the data above as a table, but from a raw data standpoint it looks like this:

```bash
WBAN|WMO|CallSign|ClimateDivisionCode|ClimateDivisionStateCode|ClimateDivisionStationCode|Name|State|Location|Latitude|Longitude|GroundHeight|StationHeight|Barometer|TimeZone
14732|72503|LGA|04|30|5811|NEW YORK|NY|LA GUARDIA AIRPORT|40.7792|-73.88|11|31|39|-5
23234|72494|SFO|04|04|7769|SAN FRANCISCO|CA|SAN FRANCISCO INTERNATIONAL AIRPORT|37.6197|-122.3647|8|18|89|-8
93738|72403|IAD|04|44|8903|WASHINGTON|VA|WASHINGTON DULLES INTERNATIONAL AP|38.9349|-77.4473|290|323|309|-5
94728|72506|NYC|04|30|5801|NEW YORK|NY|CENTRAL PARK|40.7889|-73.9669|130|156|161|-5
94789|74486|JFK|04|30|5803|NEW YORK|NY|JOHN F KENNEDY INTERNATIONAL AIRPORT|40.6386|-73.7622|11|22|32|-5
94823|72520|PIT|09|36|6993|PITTSBURGH|PA|PITTSBURGH INTERNATIONAL AIRPORT|40.4846|-80.2144|1203|1203|1175|-5
94846|72530|ORD|02|11|1549|CHICAGO|IL|CHICAGO O’HARE INTERNATIONAL AIRPORT|41.995|-87.9336|662|674|658|-6
```

While from a human standpoint we'd call this ugly, this is what we call in the coding business: perfect. The data is cleanly separated by a pipe `\` which will make separating out the data a breeze. Sometimes they're unfortunately separated by commonly used punctuation like a comma or a dash, in that case you'd have to use regular expressions to prevent errors (like `(^|,)` if data is separated by commas and there are commas in the actual column data). We can split up a row's data by using `split("|")`. If we used our enumerator for iteration we'd get:

```ruby
file = "/Users/flatironschool/Downloads/QCLCD_Gathered/201706station.txt"
File.foreach(file) do |row|

  split_row = row.split("|")
  split_row #=> header ["WBAN", "WMO", "CallSign", "ClimateDivisionCode", "ClimateDivisionStateCode", ... ]
  split_row #=> next   ["14732", "72503", "LGA", "04", "30", "5811", "NEW YORK", "NY", ... ]

end
```
Now that we have our columns neatly split up, we can assign them to their variables:

```ruby
wban = split_row[0]
wmo = split_row[1]
callsign = split_row[2]
climateDivisionCode = split_row[3]
...
```

That'll get tiring real fast, so let's just use mass assignment instead:

```ruby
wban, wmo, callsign, climateDivisionCode, ... = split_row
```

And finally we'll create a Station from those variables using the RESTful script from before, assigning only the values we want to take from it:

```ruby
Station.create(wban: wban, callsign: callsign, name: name, state: state, ... )
```

Bringing it all together:

```ruby
file = "/Users/flatironschool/Downloads/QCLCD_Gathered/201706station.txt"
File.foreach(file) do |row|

  split_row = row.split("|")
  wban, wmo, callsign, climateDivisionCode, climateDivisionStateCode, climateDivisionStationcode, name, state, location, latitude, longitude, groundHeight, stationHeight, barometer, timezone = split_row
  Station.create(wban: wban, callsign: callsign, name: name, state: state, location: location, latitude: latitude, longitude: longitude, groundHeight: groundHeight, stationHeight: stationHeight)

end
```

However the first line is the header (`WBAN|WMO|CallSign`) and we don't want that added into the database. We'll just add a line that says "ignore the first line"

```ruby
file = "/Users/flatironschool/Downloads/QCLCD_Gathered/201706station.txt"
File.foreach(file) do |row|

  if row != File.foreach(file).first
    wban, wmo, callsign, climateDivisionCode, climateDivisionStateCode, climateDivisionStationcode, name, state, location, latitude, longitude, groundHeight, stationHeight, barometer, timezone = split_row
    Station.create(wban: wban, callsign: callsign, name: name, state: state, location: location, latitude: latitude, longitude: longitude, groundHeight: groundHeight, stationHeight: stationHeight)
  end

end
```

Voila, a scraper that works!

# Phase 2 - Rakefile and Benchmarks
---

Although the scraper works it's still a hassle to have to either open up the rails console and paste it in, or put it in our normal files to call on, so why don't we use a `rake` command that will do it for us? After all we have `rake db:drop` to drop tables, `rake db:migrate` to migrate our tables, and so on, let's just make something called `rake data:scrape_stations` that will let us do it just as easily!

Let's first make our script into a method called `scrape_stations`, which will let us use the script easily as well as call from different files:

```ruby
def scrape_stations(file)

  File.foreach(file) do |row|

    split_row = row.split("|")

    if row != File.foreach(file).first
      wban, wmo, callsign, climateDivisionCode, climateDivisionStateCode, climateDivisionStationcode, name, state, location, latitude, longitude, groundHeight, stationHeight, barometer, timezone = split_row
      Station.create(wban: wban, callsign: callsign, name: name, state: state, location: location, latitude: latitude, longitude: longitude, groundHeight: groundHeight, stationHeight: stationHeight)
    end
  end

end

scrape_stations("/Users/flatironschool/Downloads/QCLCD_Gathered/201706station.txt")
scrape_stations("/Users/flatironschool/Downloads/QCLCD_Gathered/200705station.txt")
```

Then in our `Rakefile` we'll add the following

```ruby
namespace :data do

  desc "scrape stations"
  task :scrape_stations => :environment do
    scrape_stations("/Users/flatironschool/Downloads/QCLCD_Gathered/201706station.txt")
    scrape_stations("/Users/flatironschool/Downloads/QCLCD_Gathered/200705station.txt")
  end
end
```

Now we can call `rake data:scrape_stations` in the terminal and it will perform our scraping method! Let's take it one step further though and add some timestamps to our code so we can see how long it will take for us to perform our tasks using `Time.now` to log the time:

```ruby
def scrape_stations(file)

  File.foreach(file) do |row|
    unless row[0] == "|"
      split_row = row.split("|")

      if row != File.foreach(file).first
        wban, wmo, callsign, climateDivisionCode, climateDivisionStateCode, climateDivisionStationcode, name, state, location, latitude, longitude, groundHeight, stationHeight, barometer, timezone = split_row
        Station.create(wban: wban, callsign: callsign, name: name, state: state, location: location, latitude: latitude, longitude: longitude, groundHeight: groundHeight, stationHeight: stationHeight)
      end
    end
  end
end

namespace :data do

  desc "scrape stations"
  task :scrape_stations => :environment do
    t = Time.now
    puts "\nMigration starting at #{t}"

    scrape_stations("/Users/flatironschool/Downloads/QCLCD_Gathered/201706station.txt")
    scrape_stations("/Users/flatironschool/Downloads/QCLCD_Gathered/200705station.txt")

    t2 = Time.now

    puts "\nMigration ended at #{Time.now} and took #{(t2 - t) / 60} minutes #{(t2 - t) % 60} seconds)."
    puts "There are now #{Station.all.count} stations."
  end
end
```

This will output:

```bash
Migration starting at 2017-06-28 22:56:58 -0400

Migration ended at 2017-06-28 22:57:26 -0400 and took 0.4614648833333333 minutes 27.687893 seconds).
There are now 2837 stations.
```

Not bad, but we can go even further. After all we only see the start and end times, not actually seeing the progress in between. Let's modify our method to:

1. take in the time for us to keep track of
2. add a counter that goes up each time an entry is added
3. output a notification for every 500 entries, including the time

```ruby
def scrape_stations(file, t)

  count = 0
  puts "\n#{file} migration starting at #{t}"
  puts "---------"

  File.foreach(file) do |row|

    split_row = row.split("|")

    if row != File.foreach(file).first
      wban, wmo, callsign, climateDivisionCode, climateDivisionStateCode, climateDivisionStationcode, name, state, location, latitude, longitude, groundHeight, stationHeight, barometer, timezone = split_row
      Station.create(wban: wban, callsign: callsign, name: name, state: state, location: location, latitude: latitude, longitude: longitude, groundHeight: groundHeight, stationHeight: stationHeight)
    end

    count += 1
    puts "#{Time.now - t} s: #{count} entries added" if count % 500 == 0

  end

  puts "---------"
  puts "#{count} total entries added."

end

# Rakefile

namespace :data do

  desc "scrape stations"
  task :scrape_stations => :environment do
    t = Time.now

    scrape_stations("/Users/flatironschool/Downloads/QCLCD_Gathered/201706station.txt", t)
    scrape_stations("/Users/flatironschool/Downloads/QCLCD_Gathered/200705station.txt", t)

    t2 = Time.now
    puts "\nMigration ended at #{Time.now} and took #{(t2 - t) / 60} minutes #{(t2 - t) % 60} seconds)."
    puts "There are now #{Station.all.count} stations."
  end
end
```
This now outputs much more information and also makes the process of scraping not as boring as we can see some movement on the screen every once in a while.

```bash
/Users/flatironschool/Downloads/QCLCD_Gathered/201706station.txt migration starting at 2017-06-28 23:02:48 -0400
---------
3.771182 s: 500 entries added
7.477357 s: 1000 entries added
11.520816 s: 1500 entries added
15.643081 s: 2000 entries added
19.623183 s: 2500 entries added
---------
2559 total entries added.

/Users/flatironschool/Downloads/QCLCD_Gathered/200705station.txt migration starting at 2017-06-28 23:02:48 -0400
---------
21.234295 s: 500 entries added
22.577552 s: 1000 entries added
24.129251 s: 1500 entries added
25.467219 s: 2000 entries added
---------
2280 total entries added.

Migration ended at 2017-06-28 23:03:15 -0400 and took 0.44117138333333333 minutes 26.470283 seconds).
There are now 2837 stations.
```

By the way the reason why you see 2,559 stations and then 2,280 stations added from the different files but only 2,837 total stations in the end added is because of the validation I have in my model of `validates :wban, presence: true, uniqueness: true` which prevents duplicate stations from being added, looking at the `wban` column to make sure. We'll come back to this later.

# Phase 3 - Bulk Creation

As I said initially, this is one of the smallest of the files I worked with, and it's still taking 26 seconds to populate our database. Why? Well each time we do `Station.create` it fires off a SQL query of:

```sql
INSERT INTO stations (wban, callsign, ...) VALUES (?, ?, ...)
```

In the small scale it may only take around .01 seconds every time we send that query from our API to the database, but when we're dealing with 2,837 different rows that adds up quite a bit. Just imagine what happens when I move to my file with 77,000 rows. I did, and I tried it out (it took 12 minutes). So I went to try and find a way to limit the SQL calls.

After a while of tinkering around, I tried to add all the columns as a hash into an array and then do a single `Station.create(array)` from there:

```ruby
def scrape_stations(file, t)

  count = 0
  array = []
  puts "\n#{file} migration starting at #{t}"
  puts "---------"

  File.foreach(file) do |row|

    split_row = row.split("|")

    if row != File.foreach(file).first
      wban, wmo, callsign, climateDivisionCode, climateDivisionStateCode, climateDivisionStationcode, name, state, location, latitude, longitude, groundHeight, stationHeight, barometer, timezone = split_row
      array << { wban: wban, callsign: callsign, name: name, state: state, location: location, latitude: latitude, longitude: longitude, groundHeight: groundHeight, stationHeight: stationHeight }
    end


    count += 1
    puts "#{Time.now - t} s: #{count} entries added" if count % 500 == 0

  end

  Station.create(array)

  puts "---------"
  puts "#{count} total entries added."

end
```

But unfortunately that didn't work because the program would still look at each individual hash in our `Station.create` and fire off SQL for each one.

Fair warning, this is the point in where hours passed by trying to find a way to directly fire off SQL from my Rails script. I'll save you the time though of the many lines of code in the rails console I tried out, scripts within my Rakefile, and all different tunnels of the internet and stackoverflow and cut to how I finally found the answer.

# Phase 4 - Manual SQL

Using SQL in a program like Postgres or SQLite isn't too bad at its core. We can ideally insert a new entry into our database the way I said before:

```sql
INSERT INTO stations (wban, callsign, ...) VALUES (?, ?, ...)
```

BUT I kept getting this error:

`ActiveRecord::NotNullViolation: SQLite3::ConstraintException: NOT NULL constraint failed:`

This plagued me for a while since my stations table had a lot of other things going on, including four has_many / belongs_to relationships, full RESTful routes, and more. The answer to this though lied in my schema, specifically these two lines:

```ruby
create_table "stations", force: :cascade do |t|
  t.string "wban"
  t.string "name"
  t.string "callsign"
  t.string "state"
  t.string "location"
  t.string "latitude"
  t.string "longitude"
  t.string "groundHeight"
  t.string "stationHeight"
  t.datetime "created_at", null: false # <----
  t.datetime "updated_at", null: false # <----
end
```

Those `null: false` columns were created as timestamps, and I wasn't including them in my manual SQL script because ActiveRecord usually does that for us. SO, I needed to modify my `INSERT INTO` script to include `created_at, updated_at` in the column names and have a time added as their values. That was problem 1. Just kidding in my journey that was problem 14 at this point.

In order to get this script to fire in my program I needed to use something called `ActiveRecord::Base.connection.execute(sql)` to fire off a custom SQL command. The final product needed to look like this:

```sql
INSERT INTO stations (wban, name, callsign, state, location, latitude, longitude, groundHeight, stationHeight, created_at, updated_at)
VALUES ( "14732", "72503", "LGA", "04", "30", "5811", "NEW YORK", "NY", "LA GUARDIA AIRPORT", "40.7792", "-73.88", "11", "31", "39", "-5", "Time", "Time" )

INSERT INTO stations (wban, name, callsign, state, location, latitude, longitude, groundHeight, stationHeight, created_at, updated_at)
VALUES ( "98486", "72530", "ORD", "02", "11", "1549", "CHICAGO", "IL", "CHICAGO O'HARE INTERNATIONAL AIRPORT", ... )
```

Except that these are individual SQL that fire off, so with the same header we can separate multiple values by a comma:

```sql
INSERT INTO stations (wban, name, callsign, state, location, latitude, longitude, groundHeight, stationHeight, created_at, updated_at)
VALUES
    ( "14732", "72503", "LGA", "04", "30", "5811", "NEW YORK", "NY", "LA GUARDIA AIRPORT", "40.7792", "-73.88", "11", "31", "39", "-5", "Time", "Time" ),
    ( "98486", "72530", "ORD", "02", "11", "1549", "CHICAGO", "IL", "CHICAGO O'HARE INTERNATIONAL AIRPORT", "41.995", "-87.9336", "662", "674", "658", "-6", "Time", "Time" )
```

Which fires off just once. Perfect! To get this added dynamically added we can make an array, and each row push in a string that looks the same as what's above, then join them together by a comma:

```ruby
array = []
sql = "INSERT INTO stations (wban, name, ...) VALUES " + array.join(", ")
ActiveRecord::Base.connection.execute(sql)
```

To actually do this we'll change this in our existing code:

```ruby
array << { wban: wban, callsign: callsign, name: name, state: state, location: location, latitude: latitude, longitude: longitude, groundHeight: groundHeight, stationHeight: stationHeight }

# to a string

array << "('#{wban}', '#{callsign}', '#{name}', '#{state}', '#{location}', '#{latitude}', '#{longitude}', '#{groundHeight}', '#{stationHeight}', '#{Time.now}', '#{Time.now}')"

# and our sql firing

Station.create(array)

# to our new SQL string

sql = "INSERT INTO stations (wban, name, callsign, state, location, latitude, longitude, groundHeight, stationHeight, created_at, updated_at) VALUES " + array.join(", ")
ActiveRecord::Base.connection.execute(sql)
```

Which put together looks like:

```ruby
def scrape_stations(file, t)

  count = 0
  array = []
  puts "\n#{file} migration starting at #{t}"
  puts "---------"

  File.foreach(file) do |row|
    unless row[0] == "|"
      split_row = row.split("|")

      if row != File.foreach(file).first
        wban, wmo, callsign, climateDivisionCode, climateDivisionStateCode, climateDivisionStationcode, name, state, location, latitude, longitude, groundHeight, stationHeight, barometer, timezone = split_row
        array << "('#{wban}', '#{callsign}', '#{name}', '#{state}', '#{location}', '#{latitude}', '#{longitude}', '#{groundHeight}', '#{stationHeight}', '#{Time.now}', '#{Time.now}')"
      end
    end

    count += 1
    puts "#{Time.now - t} s: #{count} entries added" if count % 500 == 0

  end

  sql = "INSERT INTO stations (wban, name, callsign, state, location, latitude, longitude, groundHeight, stationHeight, created_at, updated_at) VALUES " + array.join(", ")
  ActiveRecord::Base.connection.execute(sql)

  puts "---------"
  puts "#{count} total entries added."

end
```

Now we have a script that gathers all of the rows for us then fires off a **single** SQL query which should cut down majorly on time! I'd run the benchmark test to see how long it would take, but there's a major problem that will prevent this script from even running in the first place in certain commonly occurring conditions...

# Phase 5 - Sanitizing Our Data

This is a major problem that `ActiveRecord` took care of for us with **strong params**, which was our `params.require(:station).permit(:wban, :callsign, ...)` line in our controller. What does sanitizing that mean?

![XKCD 237](https://imgs.xkcd.com/comics/exploits_of_a_mom.png)

Let's take a look at our string and the Chicago airport line:

```ruby
"('#{wban}', '#{callsign}', '#{name}', '#{state}', '#{location}', '#{latitude}', '#{longitude}', '#{groundHeight}', '#{stationHeight}', '#{Time.now}', '#{Time.now}')"
# becomes
"('98486', '72530', 'ORD', '02', '11', '1549', 'CHICAGO', 'IL', 'CHICAGO O'HARE INTERNATIONAL AIRPORT', '41.995', '-87.9336', '662', '674', '658', '-6', '2017-06-29 00:20:32 -0400', '2017-06-29 00:20:32 -0400')"
```

See the problem? If there is a quotation mark `'`/`"` somewhere, or a colon `:` it will break our string, or if there is something malicious by mistake like `DROP TABLE stations` somewhere like in the XKCD comic above it would ruin everything. We can't simply change our outer bounds to a single quote `'` instead of double `"` because we then can't interpolate `#{objects}`. Rails and ActiveRecord uses strong params to do this, and the answer to our problems is `ActiveRecord::Base.connection.quote('string')` that will do this for us! (in older versions this was known as `ActiveRecord::Base:sanitize('string')`)

```ruby
string = "Hey what's up? It's #{Time.now}"
string #=> "Hey what's up? It's 2017-06-29 09:01:36 -0400"
ActiveRecord::Base.connection.quote(string)
#=> "'Hey what''s up? It''s 2017-06-29 09:02:23 -0400'"
```

See how it takes care of the quotes for us? This makes sure we never break our string, and in turn never run something that's sitting in the broken part of the string (and break our program in the process). We can't simply sanitize the entire string before we insert it into our array by doing `array << ActiveRecord::Base.connection.quote("(#{wban}, #{callsign}, #{name}, ...)` as it wouldn't apply to the interpolated objects. We *can* however sanitize each column in the row before we do our mass assignment:

```ruby
split_row = row.split("|")
split_row.map! { |x| ActiveRecord::Base.connection.quote(x) }
```

Now each column's values including ones like "O'HARE" will be able to work. Also we should also sanitize each row's `time` that inserts into our `created_at` and `updated_at` columns so those colons don't cause a problem:

```ruby
time = ActiveRecord::Base.connection.quote(Time.now)
```

Putting this all together:

```ruby
def scrape_stations(file, t)

  count = 0
  array = []
  puts "\n#{file} migration starting at #{t}"
  puts "---------"

  File.foreach(file) do |row|
    unless row[0] == "|"
      split_row = row.split("|")
      split_row.map! { |x| ActiveRecord::Base.connection.quote(x) }

      if row != File.foreach(file).first
        wban, wmo, callsign, climateDivisionCode, climateDivisionStateCode, climateDivisionStationcode, name, state, location, latitude, longitude, groundHeight, stationHeight, barometer, timezone = split_row
        time = ActiveRecord::Base.connection.quote(Time.now)
        array << "(#{wban}, #{callsign}, #{name}, #{state}, #{location}, #{latitude}, #{longitude}, #{groundHeight}, #{stationHeight}, #{time}, #{time})"
      end
    end

    count += 1
    puts "#{Time.now - t} s: #{count} entries added" if count % 500 == 0

  end

  sql = "INSERT INTO stations (wban, name, callsign, state, location, latitude, longitude, groundHeight, stationHeight, created_at, updated_at) VALUES " + array.join(", ")
  ActiveRecord::Base.connection.execute(sql)

  puts "---------"
  puts "#{count} total entries added."

end
```
 Now for the moment of truth: how much faster are we populating our database? We were previously at:

 ```bash
 Migration ended at 2017-06-28 23:03:15 -0400 and took 0.44117138333333333 minutes 26.470283 seconds).
 There are now 2837 stations.
 ```

Running our new program we're at:

```bash
/Users/flatironschool/Downloads/QCLCD_Gathered/201706station.txt migration starting at 2017-06-29 00:54:31 -0400
---------
0.211752 s: 500 entries added
0.283182 s: 1000 entries added
0.371189 s: 1500 entries added
0.442112 s: 2000 entries added
0.509279 s: 2500 entries added
---------
2559 total entries added.

/Users/flatironschool/Downloads/QCLCD_Gathered/200705station.txt migration starting at 2017-06-29 00:54:31 -0400
---------
0.678407 s: 500 entries added
0.749073 s: 1000 entries added
0.81953 s: 1500 entries added
0.898837 s: 2000 entries added
---------
2280 total entries added.

Migration ended at 2017-06-29 00:54:32 -0400 and took 0.016682166666666668 minutes 1.00093 seconds).
There are now 2837 stations.
```

We went from 26 seconds to just **one** second! That's a 26 times increase and that's only with 2837 stations.

# Conclusion, and Big Data Implications
---
We see the **gigantic** benefit of writing our own SQL and firing off a single query instead. It may only take around .01 seconds to send a request from our API to the database, but with only 3000 queries we're already taking 30 seconds to run our scraper. If we limit this to one big SQL query we no longer spend time on the back and forth, but on collecting the data into a string and then waiting for the database to render it into rows.

Speaking of which if we look at our final script, the actual Rails part of the script before we even fired off SQL took .5 seconds for the first file and .35 seconds for the second file meaning the SQL firing only took .15 seconds. What does this mean for big data?

I first tried our old individual method with a different file containing 70,000 rows of data and it took 700 seconds, or 11.5 minutes. With the new grouped up method it took only **26 seconds** which is a 2650% increase in efficiency, or 26.5 times faster!

I went even bigger though and tried a file with **4.6 million rows** which took only **13 minutes** to complete. If we assumed a group method takes 26.5 times as long (it would actually be even longer on this larger scale) this would take 344 minutes, or **5 hours 45 minutes** to complete. And by the way this is only 480 MB of the 60 GB of data I need in my project, so per the data:

lines | individual time | group time
--- | --- | ---
3000 | 26.5 s | 1 s
70,000 | 11.5 m (690 s)| 26 s
4.6 m | 5 h 45 m (345 m) | 13 m
575 m | 30 days | 1 day 3 h

I choose the latter.

Code on.

Mike Merin
