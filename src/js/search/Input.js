/**
 * INPUT
 *
 * Provides functionality for performing a search from a text input
 */

var Input = (function() {

		var list;
		var browsePath;

		function init(listToSearch, browseURL) {
			list = listToSearch;
			browsePath = browseURL;
		}

		function submitQuery(e) {
			var target = e.target;
			var host = window.location.hostname;
			var searchPath = '/' + browsePath + '?';
			var val;

			// If we're currently operating on a tag, format and submit a tag
			// search query. Otherwise, format and submit a text query.
			if($(target).hasClass('tag')) {
	          val = $(target).text();
	          searchPath += 'tag=';
	          searchPath += val.replace(/\s+/g, '-').toLowerCase();
			}
			else {
				 val = $(target).find('input').val();
				 searchPath += val.replace(/\s+/g, '-').toLowerCase();
			}

			window.location.href = searchPath;
		}

		/** 
		 * @function filterOnText
		 *
		 * Filters the list based on the value of the currently active input.
		 *
		 * @param e {Node} - The search input whose value should be acted on
		 */
		function filterOnKeyup(e) {
		  var target = e.target;
		  var val = $(target).val();

        if(val.length !== 0) {
          //list.fuzzySearch.search(val);
					list.search(val);

          // Update the results counter with query string
	        var currList = list.matchingItems;
	        var currListLength = currList.length;

	        $('#results').text(currListLength + ' results for "' + val + '"');
        }
        else {
        	   list.filter();
        	   list.search();
        	   $('#results').text('All results');
        }
		}

		/**
		 * @function filterOnLoad
		 *
		 * Receives a query string (a set of URL parameters) and filters the list based on
		 * that string. Also adds the search to the keyword search box to make it clear that
		 * a filter is in effect.
		 */
		function filterOnLoad(queryStr, list) {
        list.fuzzySearch.search(queryStr);

         // Add query string to search input on the browse page
         var input = document.getElementById('keyword-search');
         input.value = queryStr;
         $(input).focus();

         // Update the results counter with query string
         var currList = list.matchingItems;
         var currListLength = currList.length;
         $('#results').text(currListLength + ' results for "' + queryStr + '"');
		}

		return {
			init: init,
			submitQuery: submitQuery,
			filterOnKeyup: filterOnKeyup,
			filterOnLoad: filterOnLoad
		};
})();

module.exports = Input;