var _ = require('underscore'); 

class RowProperties{
  constructor (rowMetadata=[]){
    this.rowMetadata = rowMetadata;
  }

  getRowKey(row) {
    var uniqueId; 

    if(this.hasRowMetadataKey()){
      uniqueId = row[this.rowMetadata.key];
    }
    else{
      uniqueId = _.uniqueId("grid_row");
    }

    //todo: add error handling

  	return uniqueId;
  }

  hasRowMetadataKey(){
   return this.hasRowMetadata() && this.rowMetadata.key !== null && this.rowMetadata.key !== undefined;  
  }

  hasRowMetadata(){
   return this.rowMetadata !== null;  
  }
}

module.exports = RowProperties; 