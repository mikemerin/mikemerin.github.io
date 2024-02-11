---
layout: post
title:  "The Ease of ChartJS"
subtitle: "WeatherCraft blog part 3: showing off that data"
date: 2017-08-04 12:27:14 -0400
tags: Ruby, Rails, SQL, ActiveRecord, ChartJS, React
series: WeatherCraft Blog
projects: WeatherCraft
summary: Make rewarding animated charts with an amazing library
---
You have all this data at your fingertips but showing text only goes so far. Time to add some charts to your page and make it look snazzy.

Some reference materials:

http://www.chartjs.org/docs/latest/charts/line.html
http://www.chartjs.org/samples/latest/charts/area/line-boundaries.html

---

# Overview
---
In [part 2](https://mikemerin.github.io/WeatherCraft-blog-2/) of this series of posts I talked about how to get my routes set up to work for not just one data point but all of those surrounding it. I'm working with weather data and for the purposes of this post I'll be covering the daily data. Just to quickly go recap what I'm working with, here's what my schema/table looks like for my Rails API:

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
  has_many :dailies, primary_key: "wban", foreign_key: "wban"
end

class Daily < ApplicationRecord
  belongs_to :station, primary_key: "wban", foreign_key: "wban"
end
```

My routes which will give me the endpoints I need:

```ruby
Rails.application.routes.draw do

  namespace :api do
    namespace :v1 do

      resources :dailies, only: [:index, :show]

      get '/dailies/:wban', to: 'stations#show'

      get	'/dailies/:wban/:year_month_day', to: 'dailies#entry'
      get	'/dailies/:wban/:year_month_day/adjacent', to: 'dailies#entry_adjacent'
      get	'/dailies/:wban/:year_month_day/historical', to: 'dailies#entry_historical'

    end
  end

end

```

And finally my controllers. which hit those routes:

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

  def entry
    @daily = Daily.find_by(wban: params[:wban], year_month_day: params[:year_month_day])
    render json: [@daily]
  end

  def entry_adjacent
    day = Daily.find_by(wban: params[:wban], year_month_day: params[:year_month_day])[:id]
    dailies = []
    ActiveRecord::Base.connection.execute("SELECT * FROM dailies where id < #{day} and wban = '#{params[:wban]}' order by id desc limit 5").reverse_each { |x| dailies << x }
    ActiveRecord::Base.connection.execute("SELECT * FROM dailies where id >= #{day} and wban = '#{params[:wban]}' order by id limit 6").each { |x| dailies << x }
    render json: dailies
  end

  def entry_historical
    date = params[:year_month_day].slice(4,4)
    years = ("2007".."2017").to_a
    dailies = []
    years.each { |x| dailies << x+date }
    dailies.delete_if { |x| x < "20070501" || x > "20170630" }
    dailies.map! { |x| Daily.find_by(wban: params[:wban], year_month_day: x) }
    render json: dailies
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

We'll be focusing on `entry_adjacent` for this post, which gets not only the day/entry in question but the 5 surrounding days/entries.

# Using Our Data
---

Right now we have this massive amount of data to use, but we'll just focus on the temperatures in our data. The columns we'll use are `year_month_day`, `tmax`, `tmin`, and `tavg`.

In our app we hit our DailiesAdapter first which does:

```javascript
entry_adjacent(wban, date) {
    return fetch(`${dailies_URL}/${wban}/${date}/adjacent`)
      .then( res => res.json() )
  }
```

This hits our API and JSON stringifies our data. We then can take our data (again just focusing on our temps) and split up each row into their days, the pre-5 days and the post-5 days. There are a few issues that I ran into that you may as well:

Most of my data is parsed as strings. While as humans we can read `"50"` as the number `50`, ChartJS interprets it as `NaN` which of course means it will show as missing data. To fix this, `tmax` and `tmin` are straightforward:

```javascript
const tmax = parseFloat(data[0].tmax)
const tmin = parseFloat(data[0].tmin)
```

Next, while the `tmax` and `tmin` in our data is usually present, the `tavg` is not and again, we don't want missing data. We can simply spoof it to be the average of the day's high and low which while isn't accurate, will at least give us a connected graph. So I'll just add an if statement that says "if `tavg` is `'M'` or for the pre/post values aren't numbers then fix it up.

```javascript
if (isNaN(pre1_tavg)) { pre1_tavg = (pre1_tmax + pre1_tmin) / 2 }
if (tavg === "M") { tavg = (tmax + tmin) / 2 }
```

We'll also take a second to modify the `year_month_day` to only have the month/day to keep the labels clean and be easier to read. Our current `year_month_day` for example looks like `20160123`, however we only need the month and day since the year will be shown elsewhere. First we'll use `slice` to get our MM which in this case is `01` and then use `parseInt` to convert it to an integer to not only remove the leading 0, but something else I'll talk about shortly. We'll also use slice to get the day from DD.

```javascript
const month_day = `${parseInt(pre5_year_month_day.slice(4,6), 10)} ${parseInt(pre5_year_month_day.slice(6,8), 10)}`
```

Onto that second reason I was talking about for the months: I want not just a month's number but to also the name of the month. I made an array called `DateParser`:

```javascript
const DateParser = [ 'Months', 'January', 'February', 'March', 'April', 'May',
  'June', 'July', 'August', 'September', 'October', 'November', 'December' ]
```

Since DateParser is an array, we can do `DateParser[1]` to hit January. That **1** comes from our parseInt we used before. I made index 0 'Months' which would let the month number of 1 hit 'January', 2 hit 'February', etc. With DateParser there let's hit it by doing the following:

```javascript
//before
const month_day = `${parseInt(pre5_year_month_day.slice(4,6), 10)} ${parseInt(pre5_year_month_day.slice(6,8), 10)}`
// adding DateParser
const pre5_month_day = `${DateParser[parseInt(pre5_year_month_day.slice(4,6), 10)]} ${parseInt(pre5_year_month_day.slice(6,8), 10)}`
// we'll take it one step farther and just use the first three letters of the month by slicing January to Jan with .slice0,3
const pre5_month_day = `${DateParser[parseInt(pre5_year_month_day.slice(4,6), 10)].slice(0,3)} ${parseInt(pre5_year_month_day.slice(6,8), 10)}`
```

Putting this all together into our React app we get the following:

```javascript
import React from 'react'

export const Graph = (props) => {

  const DateParser = [ 'Months', 'January', 'February', 'March', 'April', 'May',
    'June', 'July', 'August', 'September', 'October', 'November', 'December' ]

  let { pre5_year_month_day, pre4_year_month_day, pre3_year_month_day,
          pre2_year_month_day, pre1_year_month_day, year_month_day,
          post5_year_month_day, post4_year_month_day, post3_year_month_day,
          post2_year_month_day, post1_year_month_day, tmax, tmin, tavg,
          pre5_tmax, pre5_tmin, pre5_tavg, pre4_tmax, pre4_tmin, pre4_tavg,
          pre3_tmax, pre3_tmin, pre3_tavg, pre2_tmax, pre2_tmin, pre2_tavg,
          pre1_tmax, pre1_tmin, pre1_tavg, post5_tmax, post5_tmin, post5_tavg,
          post4_tmax, post4_tmin, post4_tavg, post3_tmax, post3_tmin, post3_tavg,
          post2_tmax, post2_tmin, post2_tavg, post1_tmax, post1_tmin, post1_tavg } = props.data

    const pre5 = `${DateParser[parseInt(pre5_year_month_day.slice(4,6), 10)].slice(0,3)} ${parseInt(pre5_year_month_day.slice(6,8), 10)}`
    const pre4 = `${DateParser[parseInt(pre4_year_month_day.slice(4,6), 10)].slice(0,3)} ${parseInt(pre4_year_month_day.slice(6,8), 10)}`
    const pre3 = `${DateParser[parseInt(pre3_year_month_day.slice(4,6), 10)].slice(0,3)} ${parseInt(pre3_year_month_day.slice(6,8), 10)}`
    const pre2 = `${DateParser[parseInt(pre2_year_month_day.slice(4,6), 10)].slice(0,3)} ${parseInt(pre2_year_month_day.slice(6,8), 10)}`
    const pre1 = `${DateParser[parseInt(pre1_year_month_day.slice(4,6), 10)].slice(0,3)} ${parseInt(pre1_year_month_day.slice(6,8), 10)}`
    const today = `${DateParser[parseInt(year_month_day.slice(4,6), 10)].slice(0,3)} ${parseInt(year_month_day.slice(6,8), 10)}`
    const post1 = `${DateParser[parseInt(post1_year_month_day.slice(4,6), 10)].slice(0,3)} ${parseInt(post1_year_month_day.slice(6,8), 10)}`
    const post2 = `${DateParser[parseInt(post2_year_month_day.slice(4,6), 10)].slice(0,3)} ${parseInt(post2_year_month_day.slice(6,8), 10)}`
    const post3 = `${DateParser[parseInt(post3_year_month_day.slice(4,6), 10)].slice(0,3)} ${parseInt(post3_year_month_day.slice(6,8), 10)}`
    const post4 = `${DateParser[parseInt(post4_year_month_day.slice(4,6), 10)].slice(0,3)} ${parseInt(post4_year_month_day.slice(6,8), 10)}`
    const post5 = `${DateParser[parseInt(post5_year_month_day.slice(4,6), 10)].slice(0,3)} ${parseInt(post5_year_month_day.slice(6,8), 10)}`


    if (isNaN(pre5_tavg)) { pre5_tavg = (pre5_tmax + pre5_tmin) / 2 }
    if (isNaN(pre4_tavg)) { pre4_tavg = (pre4_tmax + pre4_tmin) / 2 }
    if (isNaN(pre3_tavg)) { pre3_tavg = (pre3_tmax + pre3_tmin) / 2 }
    if (isNaN(pre2_tavg)) { pre2_tavg = (pre2_tmax + pre2_tmin) / 2 }
    if (isNaN(pre1_tavg)) { pre1_tavg = (pre1_tmax + pre1_tmin) / 2 }
    if (tavg === "M") { tavg = (parseInt(tmax, 10) + parseInt(tmin, 10)) / 2 }
    if (isNaN(post1_tavg)) { post1_tavg = (post1_tmax + post1_tmin) / 2 }
    if (isNaN(post2_tavg)) { post2_tavg = (post2_tmax + post2_tmin) / 2 }
    if (isNaN(post3_tavg)) { post3_tavg = (post3_tmax + post3_tmin) / 2 }
    if (isNaN(post4_tavg)) { post4_tavg = (post4_tmax + post4_tmin) / 2 }
    if (isNaN(post5_tavg)) { post5_tavg = (post5_tmax + post5_tmin) / 2 }

    let labels = [pre5, pre4, pre3, pre2, pre1, today, post1, post2, post3, post4, post5]

}
```

# Creating our graph
---

Now's the easy part: putting in our graph. ChartJS makes it easy to separate out the labels, how we can customize our data, and actually put in our data. I'll just throw up what my code looks like and explain things as I go along:

```javascript
// I can do line here, but Bar also allows you to mix together bar and line.
import { Bar } from 'react-chartjs-2'

const data_temps = {
      // takes the Month/Date labels and tells our graph to put it at the bottom of our axis
      labels: labels,
      // here are some of our graph's options. I want some space to the left/right which is padding
      options: {
        layout: {
          padding: {
            left: 100,
            right: 100
          }
        },
        // I also want to make sure my x axis has a small increment of .1
        scales: {
          xAxes: [{
            barThickness: 0.1
          }]
        }
      },
      // here's where I'll put in my data:
      datasets: [
        // first up the high temps
        {
          // what I want this labelled as
          label: 'High Temps',
          // I can choose bar or line here
          type: 'line',
          // how I want this filled. I can do empty/false, start, end, origin, or use numbers to fill to the next line,
          fill: "+1",
          // how curvy/straight you want the line
          lineTension: 0.1,
          // BG color in RBG and alpha (opacity)
          backgroundColor: 'rgba(255,0,77,0.4)',
          // border color in RBG and alpha (opacity)
          borderColor: 'rgba(255,0,77,1)',
          // the type of cap you want
          borderCapStyle: 'butt',
          // if you want the border solid or dashed and what type
          borderDash: [],
          // if dashed, how much space in-between
          borderDashOffset: 0.0,
          // how to join the borders together
          borderJoinStyle: 'miter',
          // the color of that joining in the same RBG/A
          pointBorderColor: 'rgba(255,0,77,1)',
          // the fill for that point
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          // the next three are when you hover over each data point
          pointHoverBackgroundColor: 'rgba(255,0,77,1)',
          pointHoverBorderColor: 'rgba(255,0,77,1)',
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          // finally the data values we'll load into our line
          data: [pre5_tmax, pre4_tmax, pre3_tmax, pre2_tmax, pre1_tmax, tmax, post1_tmax, post2_tmax, post3_tmax, post4_tmax, post5_tmax]
        },
        // rinse and repeat
        {
          label: 'Average Temps',
          type: 'line',
          fill: false,
          lineTension: 0.1,
          backgroundColor: 'rgba(255, 116, 0,0.4)',
          borderColor: 'rgba(255, 116, 0,0.4)',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: 'rgba(255, 116, 0,1)',
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: 'rgba(255, 116, 0,1)',
          pointHoverBorderColor: 'rgba(255, 116, 0,1)',
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: [pre5_tavg, pre4_tavg, pre3_tavg, pre2_tavg, pre1_tavg, tavg, post1_tavg, post2_tavg, post3_tavg, post4_tavg, post5_tavg]
        },
        {
          label: 'Low Temps',
          type: 'line',
          fill: '-1',
          lineTension: 0.1,
          backgroundColor: 'rgba(169, 13, 255,0.4)',
          borderColor: 'rgba(169, 13, 255,1)',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: 'rgba(169, 13, 255,1)',
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: 'rgba(169, 13, 255,1)',
          pointHoverBorderColor: 'rgba(169, 13, 255,1)',
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: [pre5_tmin, pre4_tmin, pre3_tmin, pre2_tmin, pre1_tmin, tmin, post1_tmin, post2_tmin, post3_tmin, post4_tmin, post5_tmin]
        }
      ]
    };
```

With all that said and done I can just simply call it in my return:

```javascript
return (
      <div>
        <h2>Weekly Information</h2>
        <Bar data={data_temps} height={120}/>
      </div>
    );
```

And it will output my graph accordingly!

---

That's it for now. You can view my project to see how this looks visually and the many, many other things I do with my data and graphs.

Code on.

Mike Merin
