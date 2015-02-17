var _ = require('underscore'); 

var ColumnProperties = function(allColumns = [], filteredColumns=[], childrenColumnName="children", columnMetadata=[], metadataColumns=[]){

  var setColumns = function(columns){
    filteredColumns = _.isArray(columns) ? columns : [columns];
  }

  var getMetadataColumns = function(){
    var meta = _.map(_.where(columnMetadata, {visible: false}), function(item){ return item.columnName});
      if(meta.indexOf(childrenColumnName) < 0){
         meta.push(childrenColumnName);
      }
      return meta.concat(metadataColumns); 
  }

  var getVisibleColumnCount = function(){
    return this.getColumns().length;
  }

  var getColumnMetadataByName = function(name){
    return _.findWhere(columnMetadata, {columnName: name}); 
  }

  var hasColumnMetadata = function(){
   return columnMetadata !== null && columnMetadata.length > 0  
  }

  var isColumnSortable = function(name){
    var meta = getColumnMetadataByName(name);

    //allow sort if meta isn't there
    if(typeof meta === "undefined" || meta === null) 
      return true; 

    return meta.hasOwnProperty("sortable") ? meta.sortable : true; 
  }

  var getColumns = function(){
    var ORDER_MAX = 100;
    //if we didn't set default or filter
    var columns = filteredColumns.length === 0 ? allColumns : filteredColumns; 

    columns = _.difference(columns, metadataColumns); 

    columns = _.sortBy(columns, (item) => {
        var metaItem = _.findWhere(columnMetadata, {columnName: item});

        if (typeof metaItem === 'undefined' || metaItem === null || isNaN(metaItem.order)){
            return ORDER_MAX;
        }

        return metaItem.order;
    });

    return columns;
  }

  return Object.freeze({
    getMetadataColumns, 
    getVisibleColumnCount,
    getColumnMetadataByName,
    hasColumnMetadata,
    isColumnSortable,
    getColumns,
    setColumns
  });
}

module.exports = ColumnProperties; 