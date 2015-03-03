var _ = require('underscore'); 

class RowProperties{
  constructor (rowMetadata=[]){
    this.rowMetadata = rowMetadata;
  }

  hasRowMetadataKey(){
   return this.hasRowMetadata() && this.rowMetadata.key !== null && this.rowMetadata.key !== undefined;  
  }

  hasRowMetadata(){
   return this.rowMetadata !== null;  
  }
}

module.exports = RowProperties; 