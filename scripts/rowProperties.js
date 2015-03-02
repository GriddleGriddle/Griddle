var _ = require('underscore'); 

class RowProperties{
  constructor (rowMetadata=[]){
    this.rowMetadata = rowMetadata;
  }

  getRowMetadataByName(name){
    return _.findWhere(this.rowMetadata, {rowName: name}); 
  }

  hasRowMetadata(){
   return this.rowMetadata !== null && this.rowMetadata.length > 0  
  }
}

module.exports = RowProperties; 