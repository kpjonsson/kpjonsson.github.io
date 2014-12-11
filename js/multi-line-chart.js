// set up canvas
var margin = {top: 20, right: 50, bottom: 50, left: 50},
width = 500 - margin.left - margin.right,
height = 300 - margin.top - margin.bottom;

// parse dates
var parse_date = d3.time.format("%-m/%-d/%y").parse;

var x = d3.time.scale()
	.range([0, width]);

var y = d3.scale.linear()
	.range([height, 0]);

// set up color scale
var color = d3.scale.category10();

var x_axis = d3.svg.axis()
	.scale(x)
	.orient('bottom');

var y_axis = d3.svg.axis()
	.scale(y)
	.orient('left');

// define line function
var line = d3.svg.line()
  .x(function(d) { return x(d.date); })
  .y(function(d) { return y(d.close); })
  .interpolate('cardinal');

// add svg element
var svg = d3.select('#multi-line-chart')
	.append('svg')
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// read data
d3.csv('../../../../data/stock-table.csv', function(error, data) {

  color.domain(d3.keys(data[0]).filter(function(key) { return key !== 'Date'; }));

  // log data in console to check that it reads correctly
  // console.log('Data', data);

  data.forEach(function(d) {
    d.date = parse_date(d.Date);
  });

  var stocks = color.domain().map(function(name) {
    return {
      name: name,
      values: data.map(function(d) {
        return { date: d.date, close: +d[name] };
      })
    };
  });

  // check if data parsed correctly
  // console.log('Stocks', stocks);

  // determine domain ranges for x/y
  x.domain(d3.extent(data, function(d) { return d.date; }));
  y.domain([
    d3.min(stocks, function(c) { return d3.min(c.values, function(v) { return v.close; }); }),
    d3.max(stocks, function(c) { return d3.max(c.values, function(v) { return v.close; }); })
    ]);

  // add labeled x-axis
  svg.append('g')
    .attr('class', 'x axis')
    .attr("transform", "translate(0," + height + ")")
      .call(x_axis)
    .selectAll('text')
      .attr('dy', '.4em')
      .attr('dx', '-.5em')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end');

  // add labeled y-axis
  svg.append('g')
    .attr('class', 'y axis')
    .call(y_axis)
    .append("text")
      .attr("y", 6)
      .attr("dy", "-1.5em")
      .style("text-anchor", "middle")
      .text("Value at close ($)");

  // draw line
  var stock = svg.selectAll('.stock')
    .data(stocks)
    .enter().append('g')
    .attr('class', 'stock');

  stock.append('path')
    .attr('class', 'line')
    .attr('d', function(d) { return line(d.values); })
    .style("stroke", function(d) { return color(d.name); });

  stock.append("text")
      .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
      .attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.close) + ")"; })
      .attr("x", 3)
      .attr("dy", ".35em")
      .text(function(d) { return d.name; });

});