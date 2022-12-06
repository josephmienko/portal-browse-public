/**
 * Table
 */

var Events = require('./Events.js');

var Table = (function() {

   function appendTable(data) {
      var el = '#' + data.id;
      var tableData = data.data;
      var columns = Object.keys(tableData[0]);
      // Need to find a dynamic way to do this.
      var colLabels = ['Race/Ethnicity', 'Rate per 1,000'];

      // We don't need the raw data, so remove from the columns array
      var raw = columns.indexOf('raw_data');
      if(raw != -1) {
         columns.splice(raw, 1);
      }

      // Append a table element
      var table = d3.select(el).append('table');
      var thead = table.append('thead');
      var tbody = table.append('tbody');

      // Append the table columns
      thead.append('tr')
            .selectAll('th')
            .data(colLabels)
            .enter()
            .append('th')
            .text(function(column) { return column; });

      // Create one row for each data object
      var rows = tbody.selectAll('tr')
                        .data(tableData)
                        .enter()
                        .append('tr');

      // Now fill the rows with data
      rows.selectAll('td')
            .data(function(row) {
               return columns.map(function(column) {
                  return {column: column, value: row[column]};
               });
            })
            .enter()
            .append('td')
            .text(function(d) { return d.value; });
   }

   return {
      init: function() {
         Events.subscribe('table loaded', function(data) {
            appendTable(data);
         });
      }
   };
})();

module.exports = Table;