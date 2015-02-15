/*
   See License / Disclaimer https://raw.githubusercontent.com/DynamicTyped/Griddle/master/LICENSE
*/
var React = require('react');
var _ = require('underscore');
var ColumnProperties = require('./columnProperties.js');

var GridTitle = React.createClass({
    getDefaultProps: function(){
        return {
           "columnSettings" : new ColumnProperties(),
           "sortColumn": "",
           "sortAscending": true,
           "headerStyle": null,
           "useGriddleStyles": true,
           "usGriddleIcons": true,
           "sortAscendingClassName": "sort-ascending",
           "sortDescendingClassName": "sort-descending",
           "sortAscendingComponent": " ▲",
           "sortDescendingComponent": " ▼",
           "enableSort": true,
           "headerClassName": "",
           "headerStyles": {},
           "changeSort": null
        }
    },
    sort: function(event){
        this.props.changeSort(event.target.dataset.title||event.target.parentElement.dataset.title);
    },
    isSortable: function(enableSort, meta){
      var metaIsValid = typeof meta !== "undefined" && meta !== null; 
        
      return metaIsValid ? (meta.hasOwnProperty("sortable") && (meta.sortable !== null)) ? 
        enableSort && meta.sortable : 
        enableSort : enableSort;
    },
    verifyProps: function(){
      if(this.props.columnSettings === null){
         console.error("gridTitle: The columnSettings prop is null and it shouldn't be");
      }
    },
    render: function(){
      this.verifyProps();
      var that = this;

      var nodes = this.props.columnSettings.getColumns().map(function(col, index){
          var columnSort = "";
          var sortComponent = null;
          var titleStyles = null;

          if(that.props.sortColumn == col && that.props.sortAscending){
              columnSort = that.props.sortAscendingClassName;
              sortComponent = that.props.useGriddleIcons && that.props.sortAscendingComponent;
          }  else if (that.props.sortColumn == col && that.props.sortAscending === false){
              columnSort += that.props.sortDescendingClassName;
              sortComponent = that.props.useGriddleIcons && that.props.sortDescendingComponent;
          }

          var displayName = col;

          var meta = that.props.columnSettings.getColumnMetadataByName(col); 
          var columnIsSortable = that.props.columnSettings.isColumnSortable(col); 

          columnSort = meta == null ? columnSort : (columnSort && (columnSort + " ")||columnSort) + meta.cssClassName;
          if (typeof meta !== "undefined" && typeof meta.displayName !== "undefined" && meta.displayName != null) {
              displayName = meta.displayName;
          }

          if (that.props.useGriddleStyles){
            titleStyles = {
              backgroundColor: "#EDEDEF",
              border: "0",
              borderBottom: "1px solid #DDD",
              color: "#222",
              padding: "5px",
              cursor: columnIsSortable ? "pointer" : "default"
            }
          }

          return (<th onClick={columnIsSortable ? that.sort : null} data-title={col} className={columnSort} key={displayName} style={titleStyles}>{displayName}{sortComponent}</th>);
      });


      return(
          <thead>
              <tr
                  className={this.props.headerClassName}
                  style={this.props.headerStyles}>
                  {nodes}
              </tr>
          </thead>
      );
    }
});

module.exports = GridTitle;
