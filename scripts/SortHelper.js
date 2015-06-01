var _ = require('underscore');

var SortMethods = {
  sortDate: function(data,sortColumn,sortAscending) {

      var sortedData = data.sort(function(object,other) {
          var objectDateDefined  =  object.hasOwnProperty(sortColumn);
          var otherDateDefined  =   other.hasOwnProperty(sortColumn);

          if(objectDateDefined && otherDateDefined) {
            if(sortAscending)
              return new Date(object[sortColumn]) - new Date(other[sortColumn]);
            else
              return new Date(other[sortColumn]) - new Date(object[sortColumn]);
          }
          else if(objectDateDefined)
            return -1;
          else if(otherDateDefined)
            return 1;
          else
            return 0;
      });
      return sortedData;
  }
}
module.exports = SortMethods;
