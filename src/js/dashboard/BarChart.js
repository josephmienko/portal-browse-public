/**
 *  BAR GRAPH
 */

var Events = require('./Events.js');

var BarChart = (function() {

   function drawBarChart(data) {
      var isDesktop = window.matchMedia("only screen and (min-width: 992px)");
      var baseWidth = (isDesktop.matches === true) ? 500 : 400;
      var el = '#' + data.id;
      var chartData = data.data;

      // Set chart options
      var color = '#3a6f8f';
      var margin = {top: 20, right: 50, bottom: 0, left: 100};
      var width = baseWidth - margin.left - margin.right;
      var height = 360 - margin.top - margin.bottom;

      var max = getMax(chartData);

      var scale = d3.scale.linear()
                    .domain([0, max])
                    .range([10, width - margin.left - margin.right - 10]);

      // Append an SVG and translate from the top left. This is necessary because
      // of how SVG handles transforms
      var svg = d3.select(el)
                  .append('svg')
                  .attr('width', width)
                  .attr('height', height)
                  .append('g')
                  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

      // Append one bar per item in the dataset
      svg.selectAll('rect')
         .data(chartData)
         .enter()
         .append('rect')
         .attr('y', function(d, i) {
            return i * 55;
         })
         .attr('x', 0)
         .attr('width', 0)
         .attr('height', 50)
         .attr('fill', color)
         .transition()
          .duration(500)
          .attr('width', function(d) { 
            return scale(d.raw_data);
          });

      // Add text labels
      svg.selectAll('.label')
         .data(chartData)
         .enter()
         .append('text')
         .text(function(d) {
            return d.label;
         })
         .attr("y", function(d, i) {
              return i * 55 + 30;
         })
         .attr("x", -10)
         .style('text-anchor', 'end')
         .style('font-size', '12px');

      // Add number labels
      svg.selectAll('.data')
         .data(chartData)
         .enter()
         .append('text')
         .text(function(d) {
            return d.formatted_data;
         })
         .attr("y", function(d, i) {
              return i * 55 + 30;
         })
         .attr("x", function(d) {
              return scale(formatAsInteger(d.raw_data)) + 5;
         })
         .style('text-anchor', 'start')
         .style('font-size', '15px')
         .style('fill', '#ee6e73');
   }

   /**
    * @function getMinMax
    *
    * Iterates over the dataset to build an array of values, then finds
    * the min and max values and returns them as an array. This allows us
    * to scale the data to the x axis without knowing the specific values.
    */
   function getMax(data) {
      var dataVals = [];
      var datum;

      // d3.min and d3.max only operate on arrays, which is why the 
      // array of all values needs to be built first.
      for(var i = 0; i < data.length; i ++) {
        datum = formatAsInteger(data[i].raw_data);
        dataVals.push(datum);
      }

      return d3.max(dataVals);
   }

   /**
    * @function formatAsInteger
    *
    * Catches instances where data was formatted as a string rather than
    * an integer and returns as an integer so D3 can work its magic.
    */
   function formatAsInteger(datum) {
      var datumInt = datum;

      if(typeof datum === 'string') {
        // First get rid of percent sign if there is one,
        // then parse as an integer
        var str = datum.replace('%', '');
        datumInt = parseInt(str);
      }

      // Return formatted integer or pass right through if it was already ok
      return datumInt;
   }

   return {
       init: function(el) {
         Events.subscribe('bar loaded', function(data) {
            drawBarChart(data);
         });
       }
    };
})();

module.exports = BarChart;