/**
 * DASHBOARD
 */

var Events = require('./Events.js');
var DataService = require('./DataService.js');
var BarChart = require('./BarChart.js');
var DonutChart = require('./DonutChart.js');
var Stats = require('./Stats.js');
var Table = require('./Table.js');

var Dashboard = (function() {

    function appendPageElements(data) {
    	var allData = data.data;

    	for(var i = 0; i < allData.length; i++) {
    		var selector = Object.keys(allData[i]);
    		var currArray = allData[i][selector];
    		var title = currArray.title;
            var subtitle = currArray.subtitle;
    		var meta = currArray.meta;
    		var highlights = currArray.highlights[0];
    		var stat = highlights.formatted_data;
    		var label = highlights.label;

    		// Get selectors for highlights and dashboard container
    		var tab = $('#dashboard .tab a[href="#' + selector + '"]');
    		var dashboard = $('#' + selector);

    		// Append datum, label, title and meta to the dashboard container
    		tab.find('span.stat').text(stat);
    		tab.find('p').text(label);
    		dashboard.append('<h3>' + title + '</h3>');
            dashboard.append('<h5 class="subtitle">' + subtitle + '</h5>');
    		dashboard.append('<p class="meta">' + meta + '</p>');

            // Append 'related visualizations' button and keyword. REPLACE when we get
            // better tagging in place

            var relatedKeyword;

            if(selector[0] === 'dash1') {
                relatedKeyword = 'investigations';
            } else if (selector[0] === 'dash2') {
                relatedKeyword = 'out-of-home-care';
            } else if (selector[0] === 'dash3') {
                relatedKeyword = 'permanency percent';
            } else {
                relatedKeyword = 'outcomes';
            }

            dashboard.append('<div class="btn-row"><a href="/browse?' + relatedKeyword + '" class="btn">Related visualizations</a></div>');
    	}
    }

    return {
        init: function(el, path) {
        	DataService.init();

        	// Initialize listeners for the chart types
        	BarChart.init();
        	DonutChart.init();
        	Stats.init();
        	Table.init();

        	// Publish the file path for data that
        	// has been passed from outside the plugin
        	Events.publish('Load data', {
        		filepath: path,
        		element: el
        	});

        	// Listen for data load
        	Events.subscribe('Data loaded', function(data) {
        		appendPageElements(data);
        	});
        },

        changeTabs: function(el) {
        		Events.publish('New dashboard', {
        			element: el
        		});
        }
    };

})();

module.exports = Dashboard;
