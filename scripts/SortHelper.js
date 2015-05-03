var _ = require('underscore');

var SortMethods = {
  sortDate: function(data,sortColumn,sortAscending) {

      var sortedData = data.sort(function(a,b) {
          var isDateDefined1  =  a.hasOwnProperty(sortColumn);
          var isDateDefined2  =  b.hasOwnProperty(sortColumn);

          if(isDateDefined1 && isDateDefined2) {
            if(sortAscending)
              return new Date(a[sortColumn]) - new Date(b[sortColumn]);
            else
              return new Date(b[sortColumn]) - new Date(a[sortColumn]);
          }
          else if(isDateDefined1)
            return -1;
          else if(isDateDefined2)
            return 1;
          else
            return 0;
      });
      return sortedData;
  },
  sortMonetary: function(data) {

  }
}
module.exports = SortMethods;
