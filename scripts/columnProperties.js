var map = require('lodash/map');
var filter = require('lodash/filter');
var find = require('lodash/find');
var sortBy = require('lodash/sortBy');
var difference = require('lodash/difference');

class ColumnProperties{
  constructor (allColumns = [], filteredColumns=[], childrenColumnName="children", columnMetadata=[], metadataColumns=[]){
    this.allColumns = allColumns;
    this.filteredColumns = filteredColumns;
    this.childrenColumnName = childrenColumnName;
    this.columnMetadata = columnMetadata;
    this.metadataColumns = metadataColumns;
  }

  getMetadataColumns(){
    var meta = map(filter(this.columnMetadata, {visible: false}), function(item){ return item.columnName});
      if(meta.indexOf(this.childrenColumnName) < 0){
         meta.push(this.childrenColumnName);
      }
      return meta.concat(this.metadataColumns);
  }

  getVisibleColumnCount(){
    return this.getColumns().length;
  }

  getColumnMetadataByName(name){
    return find(this.columnMetadata, {columnName: name});
  }

  hasColumnMetadata(){
   return this.columnMetadata !== null && this.columnMetadata.length > 0
  }

  getMetadataColumnProperty(columnName, propertyName, defaultValue){
    var meta = this.getColumnMetadataByName(columnName);

    //send back the default value if meta isn't there
    if(typeof meta === "undefined" || meta === null)
      return defaultValue;

    return meta.hasOwnProperty(propertyName) ? meta[propertyName] : defaultValue;
  }

  orderColumns(cols) {
    var ORDER_MAX = 100;

    var orderedColumns = sortBy(cols, (item) => {
        var metaItem = find(this.columnMetadata, {columnName: item});

        if (typeof metaItem === 'undefined' || metaItem === null || isNaN(metaItem.order)){
            return ORDER_MAX;
        }

        return metaItem.order;
    });

    return orderedColumns;
  }

  getColumns(){
    //if we didn't set default or filter
    var filteredColumns = this.filteredColumns.length === 0 ? this.allColumns : this.filteredColumns;

    filteredColumns = difference(filteredColumns, this.metadataColumns);

    filteredColumns = this.orderColumns(filteredColumns);

    return filteredColumns;
  }
}

module.exports = ColumnProperties;
