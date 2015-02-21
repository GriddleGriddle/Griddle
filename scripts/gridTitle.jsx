/*
   See License / Disclaimer https://raw.githubusercontent.com/DynamicTyped/Griddle/master/LICENSE
*/
var React = require('react');
var _ = require('underscore');
var ColumnProperties = require('./columnProperties.js');

var GridTitle = React.createClass({
    getDefaultProps: function(){
        return {
           "columnSettings" : null,
           "sortSettings": null,
           "headerStyle": null,
           "useGriddleStyles": true,
           "useGriddleIcons": true,
           "headerClassName": "",
           "headerStyles": {},
        }
    },
    componentWillMount: function(){
      this.verifyProps(); 
    },
    sort: function(event){
        this.props.sortSettings.changeSort(event.target.dataset.title||event.target.parentElement.dataset.title);
    },
    verifyProps: function(){
      if(this.props.columnSettings === null){
         console.error("gridTitle: The columnSettings prop is null and it shouldn't be");
      }

      if(this.props.sortSettings === null){
          console.error("gridTitle: The sortSettings prop is null and it shouldn't be");       
      }
    },
    render: function(){
      this.verifyProps();
      var that = this;

      var nodes = this.props.columnSettings.getColumns().map(function(col, index){
          var columnSort = "";
          var sortComponent = null;
          var titleStyles = null;

          if(that.props.sortSettings.sortColumn == col && that.props.sortSettings.sortAscending){
              columnSort = that.props.sortSettings.sortAscendingClassName;
              sortComponent = that.props.useGriddleIcons && that.props.sortSettings.sortAscendingComponent;
          }  else if (that.props.sortSettings.sortColumn == col && that.props.sortSettings.sortAscending === false){
              columnSort += that.props.sortSettings.sortDescendingClassName;
              sortComponent = that.props.useGriddleIcons && that.props.sortSettings.sortDescendingComponent;
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
