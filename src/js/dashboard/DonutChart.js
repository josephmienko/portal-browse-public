/**
 * DONUT CHART
 */

var Events = require('./Events.js');

var DonutChart = (function() {

	// Module-level variables
	var el, chartData;

	// Define style options
	var isDesktop = window.matchMedia("only screen and (min-width: 992px)");
   var width = (isDesktop.matches === true) ? 360 : 250;
   var height = width;
   var radius = Math.min(width, height) / 2;

	// Define the boundaries of the arc
	var arc = d3.svg.arc()
					.innerRadius(radius * 0.6)
					.outerRadius(radius * 0.9);

	/**
	 * @function appendDonutChart
	 *
	 * Appends SVG and paths for a donut chart based on the data provided
	 */
	function appendDonutChart(data) {
      el = '#' + data.id;
      chartData = data.data;

      // Color needs to stay inside appendDonutChart because its range is specific
      // to the current dataset
	   var color = d3.scale.ordinal()
						.range(['#DADFE7', '#B2C3D1', '#7699B0', '#3a6f8f', '#224357']);

      var svg = d3.select(el)
                  .append('svg')
						.attr('width', width)
						.attr('height', height)
						.append('g')
						.attr('class', 'chart')
						.attr('transform', 'translate(' + (width / 2) + ',' + (height / 2 ) + ')');

		// Set the layout
		var pie = d3.layout.pie()
		    			.startAngle(1.1*Math.PI)
    					.endAngle(3.1*Math.PI)
						.value(function(d) { return d.raw_data; })
						.sort(null);

		// Append a slice for each item in the dataset
		var slice = svg.selectAll('.slice')
							.data(pie(chartData))
							.enter()
							.append('g')
							.attr('class', 'slice');

		// Append a path with a load animation
		slice.append('path')
			.attr('d', arc)
			.attr('fill', function(d, i) { 
				return color(d.data.label);
			})
			.transition()
			    .duration(500)
			    .attrTween("d", tween);

		// Append a text elememt with the data. Full labels will go below.
		slice.append('text')
			.attr("transform", function(d) {
		        return "translate(" + arc.centroid(d) + ")";
		    })
		    .attr("dy", ".35em")
		    .style("text-anchor", "middle")
		    .attr("fill", "#fff")
		        .text(function(d,i) { return d.data.formatted_data; });

		 // Once the donut chart is appended, append a legend for each of the
		 // colors in the chart
		 appendLegend(svg, color);
	}

	/**
	 * @function appendLegend
	 *
	 * Appends a set of colored rectangles and text labels for each
	 * slice of the donut chart
	 *
	 * @param svg - The current SVG being operated on
	 * @param color - The current color domain
	 */
	function appendLegend(svg, color) {
		var legendRectSize = 18;
	   var legendSpacing = 4;
	   var legend, legendSVG;

	   // Append the legend to the middle of the donut if we are at a
	   // desktop width or below the donut on mobile
	   if(isDesktop.matches === true) {
	 	   legend = svg.selectAll('.legend')                     
			 .data(color.domain())                                   
			 .enter()                                                
			 .append('g')                                            
			 .attr('class', 'legend')                                
			 .attr('transform', function(d, i) {                     
			   var legendHeight = legendRectSize + legendSpacing;          
			   var offset =  legendHeight * color.domain().length / 2;     
			   var horz = -4 * legendRectSize;                       
			   var vert = i * legendHeight - offset;                       
			   return 'translate(' + horz + ',' + vert + ')';        
			 });  
		}
		else {
			legendSVG = d3.select(el)
									.append('svg')
									.attr('id', 'legendSVG')
									.attr('width', width)
									.attr('height', height / 2);

			legend = legendSVG.selectAll('.legend')                     
			 .data(color.domain())                                   
			 .enter()                                                
			 .append('g')                                            
			 .attr('class', 'legend') 
			 .attr('transform', function(d, i) {                     
			   var legendHeight = legendRectSize + legendSpacing;
			   var horz = 0;                       
			   var vert = i * legendHeight;                       
			   return 'translate(' + horz + ',' + vert + ')';        
			 });  
		}                                                   

		legend.append('rect')                                     
		 .attr('width', legendRectSize)                          
		 .attr('height', legendRectSize)                         
		 .style('fill', color)                                   
		 .style('stroke', color);                                
		 
		legend.append('text')
		 .attr('x', legendRectSize + legendSpacing)
		 .attr('y', legendRectSize - legendSpacing)
		 .attr('style', 'font-size: 12px')
		 .text(function(d) { return d; });
	}

	/**
	 * @function tween
	 *
	 * Uses D3's interpolate method to transition the pie slice from a starting
	 * angle to its final width. See https://github.com/mbostock/d3/wiki/Transitions#attrTween
	 * for more details.
	 *
	 * @param b - The current value
	 */
	function tween(b) {
	  var i = d3.interpolate({startAngle: 1.1*Math.PI, endAngle: 1.1*Math.PI}, b);
	  return function(t) { return arc(i(t)); };
	}

	return {
		init: function() {
			Events.subscribe('donut loaded', function(data) {
				appendDonutChart(data);
			});
		}
	};

})();

module.exports = DonutChart;