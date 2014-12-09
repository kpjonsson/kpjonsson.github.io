function draw(data) {

  	// set dimensions and variables
  	var margin = {top: 20, right: 10, bottom: 20, left: 20},
  		width = 500 - margin.left - margin.right,
    	height = 400 - margin.top - margin.bottom;
  	
  	var data_max = 150;

  	var groups = ["Alliansen", "S-V-MP-coalition", "Independent"];

  	// filter and summarize data
  	data_filtered = data.filter(function(d) { return d.valtyp == "R"; });

  	var data_sum = d3.nest()
  		.key(function(d) { return d.parti; })
  		.rollup(function(leaves) { return leaves.length; })
  		.entries(data_filtered);

  	var total = d3.sum(data_sum, function(d) { return d.values; });

  	var y = d3.scale.linear()
  		.domain([0, data_max])
  		.range([height - (margin.top + margin.bottom), 0]),
  		x = d3.scale.ordinal()
  		.domain(d3.range(data_sum.length))
  		.rangeBands([margin.left, width - margin.right], 0.2);

  	// construct bar chart
  	var svg = d3.select("#canvas")
  		.append('svg')
  			.attr("width", width + margin.left + margin.right)
  			.attr("height", height + margin.top + margin.bottom)
  		.append('g')
  			.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
  			.attr('id', 'barchart')
  			.attr('class', 'barchart');


	// tooltip
	var bar_tip = d3.tip()
		.attr('class', 'd3-tip')
		.offset([-10, 0])
		.html(function(d) { return d.values + " seats<br>" + d3.format('.1%')(d.values / total); });
		
	svg.call(bar_tip);	

  	// make bars
	svg.selectAll('rect')
		.data(data_sum)
		.enter()
		.append('rect')
		.attr("transform", function(d, i){
			return "translate("+x(i) +", 0)"; })
		.attr('y', function(d) { return y(d.values) - (margin.bottom + margin.top); })
		.attr('width', x.rangeBand())
		.attr('height', function(d) { return height - y(d.values); })
		.style('fill', function(d) {
			if (['M', 'C', 'FP', 'KD'].indexOf(d.key) >= 0) { return 'rgb(173,216,230)'; }
			else if (['S', 'V', 'MP'].indexOf(d.key) >= 0) { return 'rgb(230,150,173)'; }
			else { return 'grey'; } 
		})
		.on('mouseover', bar_tip.show)
		.on('mouseout', bar_tip.hide)
		.attr('class', function(d) {
			if (['M', 'C', 'FP', 'KD'].indexOf(d.key) >= 0) { return groups[0]; }
			else if (['S', 'V', 'MP'].indexOf(d.key) >= 0) { return groups[1]; }
			else { return groups[2]; } 
		});

	// add labels for parties and percentages
	var text = svg.selectAll('text')
		.data(data_sum)
		.enter()
		
	text.append('text')
		.text(function(d) { return d.key; })
		.attr("text-anchor", "middle")
		.attr('x', function(d, i) {return x.range()[i] + x.rangeBand()/2; })
		.attr('y', function(d) { return height - margin.bottom; })
	
	// text.append('text')
	// 	.text(function(d) { return d3.format('.1%')(d.values / total); })
	// 	.attr("text-anchor", "middle")
	// 	.attr('x', function(d, i) {return x.range()[i] + x.rangeBand()/2; })
	// 	.attr('y', function(d) { return y(d.values); });

	text.append('text')
		.text("Total seats: 349")
		.attr('x', margin.left + 5)
		.attr('y', margin.top - 5)
		.attr('text-anchor', 'start');
		
	// axes
	y_axis = d3.svg.axis()
		.scale(y)
		.orient('left')
		.outerTickSize(0);

	svg.append("g")
		.attr('class', 'y axis')
		.attr('transform', 'translate(' + margin.left + ', 0)')
		.call(y_axis);

	// legend
	var legend = svg.append("g")
  		.attr("class", "legend")
		.attr("height", 100)
		.attr("width", 100)
	    .attr('transform', 'translate(50,50)')    

    legend.selectAll('rect')
      .data(groups)
      .enter()
      .append("rect")
	  .attr("x", width - 65)
      .attr("y", function(d, i){ return i *  20;})
	  .attr("width", 15)
	  .attr("height", 15)
	  .style("fill", function(d) {
	  	if (d === 'Alliansen') { return 'rgb(173,216,230)'; }
	  	else if (d === 'S-V-MP-coalition') { return 'rgb(230,150,173)'; }
	  	else { return 'grey';}
	  })
	  .attr('class', function(d, i) { return groups[i]; })
	  .on('mouseover', function(d, i) { svg.selectAll("." + groups[i]).style('opacity', .5); })
	  .on('mouseout', function(d, i) { svg.selectAll('rect').style('opacity', 1); });

	legend.selectAll('text')
		.data(groups)
		.enter()
		.append('text')
		.attr("x", width - 75)
		.attr('text-anchor', 'end')
      	.attr("y", function(d, i){ return i * 20 + 12;})
      	.text(function(d) { return d; });

  }

  // load csv file
d3.csv("../assets/nuvarande_ledamoter_RLK.csv", draw);
