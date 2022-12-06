/**
 * FILTER
 *
 * Provides functionality for filtering a list of content
 * based on selected tags.
 */

var Filter = (function() {

      /**
       * @var activeTags {Object} - A dictionary of the vocabularies that will be filtered on
       * @var vocabs {Array} - The list of vocabularies
       */

	   var activeTags = {};
	   var listLength;

	   /**
	    * @function init
	    * 
	    * Based on the current vocabularies in use, builds a dictionary of active terms
	    */
	   function init(options, list) {	   	
	   	// Iterate over the options and create a dictionary called 'activeTags'
	   	for (var i = 0; i < options.length; i++) {
	   		activeTags[options[i]] = [];
	   	}

	   	var listItems = list.matchingItems;
	   	listLength = listItems.length;
	   }

      /**
       * @function filter 
       *
       * Checks to see if the current query matches an element that is highlighted
       * and either adds or removes the filter as necessary
       */
	   function filter(query, list) {
	   	  var el = '.filter[data-value="' + query + '"]';
	   	  var isActive = $(el).hasClass('active');
	   	  var taxonomy = $(el).attr('data-filters');

	        if(isActive) {
	            $(el).removeClass('active');
	            var vocab = activeTags[taxonomy];
	            vocab.splice(vocab.indexOf(query), 1);
	            filterList(list);
	        }
	        else {
	            $(el).addClass('active');
	            activeTags[taxonomy].push(query);
	            filterList(list);
	        }

	        updateResultsCounter(list.matchingItems);
	   }

      /**
       * @function filterList
       *
       * Uses List.js filter methods to iterate over all of the items being searched and determine
       * whether they match the current search criteria (boolean).
       */
		function filterList(list) {
     	  // Apply filters to each item in the list
        list.filter(function(item){
            var vocabItems = item.values();
 	
 				// Iterate over each vocabulary in the activeTags dictionary
            for(var vocab in activeTags) {
            	if(activeTags.hasOwnProperty(vocab)) {
	            	// Iterate over each item in the current vocabulary
	            	for(var i = 0, len = activeTags[vocab].length; i < len; i++) {
	            		
	            		// Check if the current item's vocabulary contains the
	            		// same values. If not, move on to the next item in the list.
	                  if (vocabItems[vocab].indexOf(activeTags[vocab][i]) === -1) {
	                    return false;
	                  }
	               }
	            }
            }
            return true;
        });

        // Update the results counter
        var currList = list.matchingItems;
        updateResultsCounter(currList);
		}

      /**
       * @function resetFilters 
       *
       * Clears current selections and returns the list to its unfiltered state. List.js handles
       * this by simply calling the filter method with no parameters.
       */
		function resetFilters(list) {
	    	$('.filter').each(function() {
	    		$(this).removeClass('active');
	    	});

	    	var input = document.getElementById('keyword-search');
	    	input.value = '';
	    	$(input).blur();

	      $('#results').text('All Results');
	    	list.filter();
	      list.search();

	      // Remove all values from each vocabulary
	      for(var vocab in activeTags) {
	      	if(activeTags.hasOwnProperty(vocab)) {
	      		activeTags[vocab] = [];
	      	}
	      }
		}

      /**
       * @function updateResultsCounter
       *
       * Logic for displaying the current number of results after filtering (displayed just above
       * the list) or "All" if no filters are selected.
       */
		function updateResultsCounter(currList) {
	        var currListLength = currList.length;
	        
	        if(currListLength > 1 && currListLength != listLength) {
	            $('#results').text(currListLength + ' results');
	     	  }
	     	  else if (currListLength === 1) {
	     	  		$('#results').text(currListLength + ' result');
	     	  }
	     	  else if ( currListLength === 0) {
	     	  		$('#results').text('No Results');
	     	  }
	     	  else {
	     	  	   $('#results').text('All Results');
	     	  }
		}

		return {
			init: init,
			filter: filter,
			resetFilters: resetFilters
		};
})();

module.exports = Filter;