// set dimensions
var margin = {top: 20, right: 50, bottom: 20, left: 20},
	width = 500 - margin.left - margin.right,
	height = 300 - margin.top - margin.bottom;

// set ranges
var x = d3.scale.linear().range([0, width - margin.right]);
var y = d3.scale.linear().range([0, height]);

// set color scale
var color = d3.scale.category10();

// define axes
var x_rounds = d3.svg.axis()
	.scale(x)
	.orient('bottom');

var y_position = d3.svg.axis()
	.scale(y)
	.ticks(22)
	.orient('left');

// define line 
var line = d3.svg.line()
	.defined(function(d) { return d.position !== 0; })
	.x(function(d) { return x(d.round); })
	.y(function(d) { return y(d.position); })
	.interpolate('linear');

// add svg element
var arsenal = d3.select("div#arsenal-chart")
	.append('svg')
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
	.append('g')
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// read data
d3.csv('../../../../data/arsenal-history-2.csv', function(error, data) {

	vars = d3.keys(data[0]).filter(function(key) { return key !== 'round'; });
	color.domain(vars);

	var seasons = vars.map(function(name) {
		return {
			name: name,
			values: data.map(function(d) {
				return { round: +d.round, position: +d[name] };
			})
		};
	});

	// determine ranges of input data (N.B. x hard-coded)
	x.domain([1, 42]);
	y.domain([1,
		d3.max(seasons, function(c) { return d3.max(c.values, function(v) {
			return v.position; }); })
		]);

	arsenal.append('g')
		.attr('class', 'x axis')
		.attr('transform', 'translate(0,' + height + ')')
			.call(x_rounds);

	arsenal.append('g')
		.attr('class', 'y axis')
		.call(y_position);	

	// label for x-axis
	arsenal.append('text')
		.attr('text-anchor', 'middle')
		.attr('x', margin.right)
		.attr('y', height)
		.attr('dy', '.9em')
		.attr('dx', '-1.75em')
		.text('Round:');

	// add dashed lines
	arsenal.append('line')
	    .attr('x1', 0)
	    .attr('y1', y(20))
	    .attr('x2', width - margin.right)
	    .attr('y2', y(20))
	    .attr('stroke-weight', '2px')
	    .style("stroke-dasharray", ("1, 3"))
	    .style('stroke', '#000');

	arsenal.append('line')
	    .attr('x1', x(38))
	    .attr('y1', 0)
	    .attr('x2', x(38))
	    .attr('y2', height)
	    .attr('stroke-weight', '2px')
	    .style("stroke-dasharray", ("1, 3"))
	    .style('stroke', '#000');

	var season = arsenal.selectAll('.season')
		.data(seasons)
		.enter().append('g')
		.attr('class', 'seasons');

	function highlight(d, index, object) {
		if (object.classList.contains('active')) {
			d3.selectAll('.season' + index).classed('active', false);
		} else {
			d3.selectAll('.season' + index).classed('active', true);
			d3.selectAll('.season' + index + '.line')
				.append('circle')
				.style('fill', 'black')
				.attr('x', 100)
				.attr('y', 100)
				.attr('r', 30);
		}
	};

	var lines = season.append('path')
		.attr("class", function(d, i) { return "season" + i + " line"; })
		.style('stroke', function(d) { return color(d.name); })
		.on('click', function(d,i) { highlight(d, i, this); });

	// animate drawing of lines
	//var total_length = lines.node().getTotalLength();
	// lines
	// 	.attr('stroke-dasharray', total_length + ' ' + total_length)
	// 	.attr('stroke-dashoffset', total_length)
	// 	.transition()
	// 		.duration(5000)
	// 		.ease('linear')
	// 		.attr('stroke-dashoffset', 0);

	// add final position label
	season
		.append('text')
		.datum(function(d) {
			var j = d.values.length - 1;
			while (d.values[j].position == 0 && j > 0) { j--; }
			return { name: d.name, value: d.values[j] };
		})
		.attr("transform", function(d) { return "translate(" + x(d.value.round) + "," + y(d.value.position) + ")"; })
		.attr('dy', '.30em')
		.attr('dx', '.35em')
		.attr('class', function(d, i) { return 'season' + i + ' label'; })
		//.attr('opacity', 0)
		.text(function(d) { return d.value.position; })

	season.append('circle')
		.datum(function(d) {
			var j = d.values.length - 1;
			while (d.values[j].position == 0 && j > 0) { j--; }
			return { name: d.name, value: d.values[j] };
		})
		.attr('cx', function(d) { return x(d.value.round); })
		.attr('cy', function(d) { return y(d.value.position); })
		.style('fill', function(d, i) { return color(d.name) })
		.attr('class', function(d, i) { return 'season' + i + ' point'; })
		//.attr('opacity', 0)
		.attr('r', 3);

	// alternative for rolling back animation
	// svg.on('click', function() {
	// 	lines
	// 		.transition()
	// 		.duration(2000)
	// 		.ease('linear')
	// 		.attr('stroke-dashoffset', total_length);
	// })

	var box_dim = 5;

	var legend = arsenal.selectAll('.legend')
		.data(vars.slice())
		.enter().append('g')
		.attr("class", function(d, i) { return "season" + i + " legend"; })
		.attr("transform", function (d, i) { return "translate(0," + i * (box_dim + 5) + ")"; })
		.on('click', function(d,i) { highlight(d, i, this); });

	legend.append('rect')
		.attr('x', width)
		.attr('y', function(d) { return height - (seasons.length * box_dim * 1.5); })
		.attr('width', box_dim)
		.attr('height', box_dim)
		.style('fill', color);

	legend.append('text')
		.attr('x', width)
		.attr('y', function(d) { return height - (seasons.length * box_dim * 1.5); })
		.attr('dy', 8.5)
		.attr('dx', -2)
		.style('text-anchor', 'end')
		.text(function(d) { return d; });

	arsenal.append('text')
		.attr('x', width)
		.attr('y', 5)
		.attr('dx', 10)
		.attr('dy', 4)
		.style('font-weight', 'bold')
		.style('text-anchor', 'end')
		.text('Season');

	// reduce opacity of all lines but current season
	arsenal.selectAll('.line:not(.season22)')
		.attr('opacity', .10);
	arsenal.selectAll('.point:not(.season22)')
		.attr('opacity', 0);
	arsenal.selectAll('.label:not(.season22)')
		.attr('opacity', 0);
	arsenal.selectAll('.legend:not(.season22)')
		.attr('opacity', .1);

	// add 'clear' button
	arsenal.append('text')
		.attr('x', x(38))
		.attr('y', y(20))
		.attr('dy', '-.2em')
		.attr('dx', '-.2em')
		.attr('font-size', '12px')
		.attr('text-anchor', 'end')
		.attr('class', 'button')
		.text('Clear selection')
		.on('click', function() {
			for (var i = 0; i <= 23; i++) {
				arsenal.selectAll('.season' + i).classed('active', false);
			}
		});
	});
