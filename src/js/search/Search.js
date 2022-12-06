/**
 * SEARCH
 *
 * Initializes site search modules and exposes methods
 * for use in main.js
 *
 * Site search depends on List.js and its FuzzySearch plugin,
 * both of which must be included at the foot of the page before
 * the main.js file that contains this plugin.
 */

var Filter = require('./Filter.js');
var Input = require('./Input.js');

var Search = (function() {

	/**
	 * @var visualizations
	 *
	 * An empty variable that will contain the searchable
	 * list after initialization
	 */
	 var visualizations;

	 /**
	  * @function init
	  *
	  * Initializes search with options and binds search events
	  * to UI elements
	  */
	 function init(options) {
    		// Set the options for use throughout the app
    	   var baseURL = options.baseURL;
    	   var browseURL = options.browseURL;
    	   var searchList = options.list;
    	   var vals = options.searchVals;

    	   initSearchList(searchList, vals);
    		bindUIEvents();

    		// Pass vocabularies to Filter and the list of items
    		// to Input so that they can operate based on user input
    		Filter.init(options.vocabs, visualizations);
    		Input.init(visualizations, browseURL);
    }


	 /**
	  * @function initSearchList
	  *
	  * Initializes a new List.js instance on the list id passed in from app.js
	  * with settings for fuzzy search and the options to be searched.
	  *
	  * @param searchList {string} - the name of the list to be searched that
	  *    corresponds to an id on the page. Refer to the List.js documentation
	  *    for detaails.
	  */
    function initSearchList(searchList, vals) {
    	    // Fuzzy options for the fuzzySearch plugin. This allows us to be less
    	    // precise with text inputs while still returning results. Modify the
    	    // threshhold to adajust the sensitivity of the search (with 1 being an
    	    // exact match).
    	    var fuzzyOptions = {
		      searchClass: "search",
		      location: 0,
		      distance: 100,
		      threshold: 0.4,
		        multiSearch: true
		    };

		    var options = {
		      valueNames: vals,
		      plugins: [
		        ListFuzzySearch()
		      ]
		    };

		   // initialize a new list and assign it to the 'visualizations' variable
			visualizations = new List(searchList, options);

    		// Check if a search query has been sumbitted to the current page
    		// and that the current page has a sortable list. If so, filter the
    		// list based on the search query. Regardless, sort the list A-Z by title.
         var query = window.location.search.replace("?", "");
         var queryStr = query.replace(/-/g, ' ');

         // Check that this is a list page
         if(visualizations.matchingItems.length !== 0) {
	        visualizations.sort('title', { order: "asc" });

	        // If not a tag query, perform a fuzzy search
	        if (queryStr.length !== 0 && queryStr.indexOf('tag') === -1) {
	        		Input.filterOnLoad(queryStr, visualizations);
	        } 
	        // Do a filter search if this is a tag
	        else if (queryStr.length !== 0 && queryStr.indexOf('tag') > -1) {
	            var currQuery = queryStr.split('=')[1];
	            Filter.filter(currQuery, visualizations);
	        }
	    }
    }

    function bindUIEvents() {
		    // Bind search and filter actions to UI events
		    $('#search').click(function() {
		        $(this).find('label').remove();
		    });

		    $('#search').submit(function(e) {
		        Input.submitQuery(e);

		        // Return false so that the page does not simply reload
		        return false;
		    });

		    $('a.tag').click(function(e) {
		        Input.submitQuery(e);
		    });

		   // 'keyword-search' is the id of the search input element
		   // on the browse page.
		   $('#keyword-search').on("keyup", function(e) {
		        Input.filterOnKeyup(e);   
		    });

		   // Filter and reset on click
		   $('.filter').click(function(e) {
		   	  var tag = $(this).attr('data-value');
		   	  Filter.filter(tag, visualizations);
		   });

		   $('#showall').click(function() {
		   	  Filter.resetFilters(visualizations);
		   	  return false;
		   });
    }

    // return public methods
    return {
    	init: init
    };
})();

module.exports = Search;