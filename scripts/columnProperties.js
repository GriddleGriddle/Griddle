class ColumnProperties{
  static getMetadataColumns(columnMetadata, childrenColumnName, metadataColumns){
    var meta = _.map(_.where(columnMetadata, {visible: false}), function(item){ return item.columnName});
      if(meta.indexOf(childrenColumnName) < 0){
         meta.push(childrenColumnName);
      }
      return meta.concat(metadataColumns); 
  }

  static getColumns(results, filteredColumns, metadataColumns, columnMetadata){
    const ORDER_MAX = 100;

    //if we don't have any data don't mess with this
    if (results === undefined || results.length === 0){ return [];}

    //if we didn't set default or filter
    if (filteredColumns.length === 0){
        filteredColumns =  _.keys(_.omit(results[0], metadataColumns));
    }

    filteredColumns = _.difference(filteredColumns, metadataColumns); 

    filteredColumns = _.sortBy(filteredColumns, function(item){
        var metaItem = _.findWhere(columnMetadata, {columnName: item});

        if (typeof metaItem === 'undefined' || metaItem === null || isNaN(metaItem.order)){
            return ORDER_MAX;
        }

        return metaItem.order;
    });

    return filteredColumns;
  }
}

module.exports = ColumnProperties; 