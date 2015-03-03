var _ = require('underscore');

class RowProperties{
  constructor (rowMetadata={}){
    this.rowMetadata = rowMetadata;
  }

  getRowMetadataByName(name){
    return _.findWhere(this.rowMetadata, {rowName: name});
  }

  hasRowMetadata(){
    return this.rowMetadata !== null;
  }

  getRowId(row, backupId){
    if(this.hasRowMetadata() && this.rowMetadata.key) {
      return row[this.rowMetadata.key];
    } else {
      console.warn("No row 'key' specified; a generated unique id will be used for each table row (which negatively impacts performance).");
      return _.uniqueId("grid_row")
    };
  }
}

module.exports = RowProperties;
