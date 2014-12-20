---
title: "'Tis not the season"
layout: post
tags: 
  - D3.js
  - interactive
  - line chart
  - Arsenal
published: true
---

I am a big fan of the English soccer team Arsenal and have thus in dismay seen the season so far play out. Inspired by [this great example](http://thestoryoftheseason.com/) I decided to make my own chart for comparison of this Arsenal season to previous ones in the Premier League since its inauguration in 1992. Admittedly, this might not be the most effective visualization for this kinda of data, but I could not think of another one...and it gave me a good opportunity to experiment with various D3 features. A few thing I learned from putting this together is to minimize the hard-coding of anything but the dimensions of your chart and to be careful which program, if any, you manipulate your data with, since it can ruin the [utf-8](http://en.wikipedia.org/wiki/UTF-8) encoding. Also, it's way easier to embed your D3.js viz using an [iframe](http://www.biovisualize.com/2012/07/embedding-d3js-in-blog-post.html). Note that during two seasons, delimited by the dashed lines, the Premier League consisted of 22 teams. 

<!-- <link rel="stylesheet" type="text/css" href="../../../../css/arsenal-history.css"> -->
<div id='arsenal-chart'></div>
<script type="text/javascript" src="http://d3js.org/d3.v3.min.js"></script>

<!-- Embed Gist result from Bl.ocks -->
<iframe frameborder="0" height="400" marginheight="0" marginwidth="0" scrolling="no" src="http://bl.ocks.org/kpjonsson/raw/56d5640242389414dc3e/" width="800"></iframe>

<span style="font-size: 75%; text-align: right;">Source: [Premier League](http://www.premierleague.com/en-gb.html)
<br>
[Bl.ock](http://bl.ocks.org/kpjonsson/56d5640242389414dc3e)
</span>

* * *