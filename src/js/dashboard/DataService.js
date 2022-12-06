/**
 * DATA SERVICE
 */

var Events = require('./Events.js');

var DataService = (function() {

   // Declare dataset variable to be used within the scope
   // of the data service module.
   var dataset;

   function loadData(path, el) {
      d3.json(path, function(error, data) {
         if(error) return console.warn(error);
         dataset = data;

         Events.publish('Data loaded', {
            data: dataset
         });
         // Needs to happen inside the d3.json callback
         // because of the way d3 handles loading data
         getCurrentData(el);
      });
   }
   /**
    * @function getCurrentData
    *
    * Based on currently selected dashboard, select
    * the appropriate subset of the data.
    */
   function getCurrentData(el){
      var jsonObj = el.replace('#', '');
      var currData;
      var currDash;

      for(var i = 0; i < dataset.length; i++) {
         if(typeof dataset[i][jsonObj] != 'undefined') {
            currDash = Object.keys(dataset[i]); // The selector for this dashboard
            currData =  dataset[i][jsonObj]; // The dataset for this dashboard
            distributeData(el, currData, currDash); // Parse the data, create widgets and broadcast
         }
      }
   }

   /**
    * @function distributeData
    *
    * Takes parsed results of the current dataset and
    * distributes them to the appropriate visualization
    * modules
    */
   function distributeData(el, data, dashboard) {
      var dashboardData = data.dashboard;
      var keys = Object.keys(dashboardData);
      var colNum = 12 / keys.length; // How many columns (width) should this be on larger screens?
      var widgetArr, widgetData, widgetType, widgetID, widgetTitle, widgetMeta, msg;

      for(var i = 0; i < keys.length; i++) {
         widgetID = dashboard + '-' + keys[i];
         widgetArr = dashboardData[keys[i]];
         widgetType = widgetArr.type;
         widgetTitle = widgetArr.title;
         widgetMeta = widgetArr.meta;
         widgetData = widgetArr.data;
         msg = widgetType + ' loaded';

         // Append a wrapper and title for the new widget
         $(el).append('<div class="dashboard-widget" id="' + widgetID + '"></div>');
         $('#' + widgetID).addClass('col s12 l' + colNum).append('<h4>' + widgetTitle + '</h4>');

         if(typeof widgetMeta != 'undefined') {
            $('#' + widgetID).append('<h5 class="subtitle">' + widgetMeta + '</h5>');
         }

         // Publish type and availability to kick off
         // visualization creation
         Events.publish(msg, {
            id: widgetID,
            el: el,
            data: widgetData
         });
      } 
   }

   /**
    * return public methods
    */
   return {
      init: function() {
         // Listen for initial data load
         Events.subscribe('Load data', function(data) {
            var path = data.filepath;
            var el = data.element;

            $(el).addClass('loaded');
            loadData(path, el);
         });

         // Listen for new dashboard initialization. This depends
         // on the event handlers determined outside the plugin.
         Events.subscribe('New dashboard', function(data){
            var el = data.element;
            var isLoaded = $(el).hasClass('loaded');

            // Only load new visualizations if they have not yet
            // been created
            if(isLoaded === false) {
               $(el).addClass('loaded');
               getCurrentData(el);
            }
         });
      }
   };
})();

module.exports = DataService;