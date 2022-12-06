/**
 * Stats
 */

var Events = require('./Events.js');

var Stats = (function() {

	function appendStat(data) {
      var el = '#' + data.id;
      var stat = data.data[0].formatted_data;
      
      $(el).append('<span class="big-stat">' + stat + '</span>');
	}

   return {
       init: function(el) {
         Events.subscribe('stat loaded', function(data) {
            appendStat(data);
         });
       }
    };
})();

module.exports = Stats;