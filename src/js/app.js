/*
 *  APP.JS
 *  -----------------------
 *  Author: Erika Deal
 *  Contact: edeal@uw.edu
 *  Date: August 2015
 *  -----------------------
 *  Initializes the site JavaScript including
 *  dashboard and search plugins.
 */

var Search = require('./search/Search.js');
var Dashboard = require('./dashboard/Dashboard.js');

var App = (function() {

  /**
   * @function init
   *
   * Initializes Materialize, dashboard and search plugins, then adjusts
   * page-specific UI components
   */
  function init() {
     // Init Materialize plugins we're using on the site
    $('.button-collapse').sideNav();
    $('.parallax').parallax();

    // Next initialize our components
    initSearch();
    initDashboard();

    // If the current page is in the main nav, highlight that item
    var pageArr = window.location.href.split('/');
    var page = pageArr[3];
    
    $('#nav-mobile li a').each(function() {
      if($(this).attr('href').indexOf(page) > -1) {
        $(this).addClass('current');
      }
    });

    // Finally, if we are on the browse page, make the list and filters visible.
    // They are initially set to hidden to avoid visible UI changes as the tabs 
    // initialize and the list is sorted
    $('.browse .filters').css('visibility', 'visible');
    $('#visualizations').css('visibility', 'visible');
  }

  /**
   * @function initSearch
   *
   * Builds options for and initializes the search module
   */
  function initSearch() {
    // Pass in options to the search module. Doing it this way so that changes only
    // need to occur at the top level, before initialization, rather than in the module
    // itself.
    var options = {
       baseURL: window.location,
       browseURL: 'browse', // The relative path of the search page
       list: 'visualizations', // The id of the list to be searched
       searchVals: ['title', 'tag', 'type','keyword'], // All of the searchable metadata fields
       vocabs: ['tag', 'type'] // Fields that will be exposed as clickable filters
    };

    Search.init(options);
  }

  /**
   * @function initDashboard
   *
   * Initializes dashboard if we are on the home page, then adds handlers for click
   * events and mobile view.
   */
  function initDashboard() {
    // Only initialize if we're on the home page and pass in
    // the element to be initialized first as well as the 
    // path to the JSON file with data we want to use
    if($('body').hasClass('home')) {
      Dashboard.init('#dash1', '/content-data/data/dashboard/dashboard.json');
      mobilizeTabs();

       $('.tab').click(function() {
          var el = $(this).children('a').attr('href');
          Dashboard.changeTabs(el);
      });
    }

  }


  /**
   * @function mobilizeTabs
   *
   * Checks if the current view is greater than 992px. If not, adjust the width of the
   * tabs and their container, then add touch events for moving between tabs.
   */
  function mobilizeTabs() {
    // Checks media query for the large breakpoint size defined by Materialize
    var isDesktop = window.matchMedia("screen and (min-width: 992px)");

    if(isDesktop.matches === false) {
        $('#dashboard .tabs').tabs();
        // Set the tabs container to be wider than the page and then set the
        // tab width for later use
        var numTabs = $('#dashboard .tab').length;
        $('#dashboard .tabs').attr('style', 'width: ' + (100 * numTabs) + '%;');

        // Generate a style event to re-change the width if we need to
        var ev = new $.Event('style'),
          orig = $.fn.css;
        $.fn.css = function(){
          $( this ).trigger( ev );
          return orig.apply( this, arguments );
        }

        // If materialize tries to change the width, we need to change it back
        $('#dashboard .tabs' ).on('style', function(event){
          $('#dashboard .tabs').attr('style', 'width: ' + (100 * numTabs) + '%;');
        });

        // Bind swipe events
        $('#dashboard .tabs').on('swipeleft swiperight click', function(event) {
          event.preventDefault();

          var delta = 1;
          if( event.type === 'swiperight' ){
            delta = -1;
          }

          // Note: determining the next tab is currently handled with the assumption that
          // the tabs are numbered with the number at the end (i.e. dash1, dash2, etc)
          var activeTab = $('.tabs .tab a.active');
          var activeTabNum = parseInt(activeTab.attr('href').slice(-1));
          var newTabNum = activeTabNum + delta;
          var wrap = false;
          if( newTabNum < 1 ){
            newTabNum  = numTabs;
            wrap = true;
          } else if( newTabNum > numTabs ){
            newTabNum = 1;
            wrap = true;
          }

          var newTab = '#dash' + newTabNum;
          switchTabs(activeTabNum, newTabNum, wrap);

          // Change the dashboard to the new tab
          Dashboard.changeTabs(newTab);

        });
      }
  };

  /**
   * @function switchTabs
   *
   * Checks active tab, then advances to the next tab to the right and activates the new tab body.
   */
  function switchTabs(activeTabNum, newTabNum,wrap){
      var activeTabName = '#dash'+activeTabNum;
      var newTabName    = '#dash'+newTabNum;

      //var animateLeft = (newTab === '#dash1') ? '0' : '-=100%';
      var animateProp;
      if( newTabNum < activeTabNum ){
        if( wrap ){
          animateProp = {'left':0};
        } else {
          animateProp = {'left':'+=100%'};
        }

      } else {
        if( wrap ){
          var pct = (newTabNum-1)*100;
          animateProp = {'left':'-'+pct+'%'};
        } else {
          animateProp = {'left':'-=100%'};
        }
      }

      $('.tab a[href=' + activeTabName + ']').removeClass('active');
      $('.tab a[href=' + newTabName + ']').addClass('active');

      // Move tabs and display new tab
      $('#dashboard .tabs').animate(animateProp, 300);
      $(activeTabName).attr('style', 'display: none;');
      $(newTabName).attr('style', 'display: block;');
  }

  return {
    init: init
  };
})();

App.init();
