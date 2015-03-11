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
           "rowSettings" : null,
           "sortSettings": null,
           "headerStyle": null,
           "useGriddleStyles": true,
           "useGriddleIcons": true,
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


          var meta = that.props.columnSettings.getColumnMetadataByName(col);
          var columnIsSortable = that.props.columnSettings.getMetadataColumnProperty(col, "sortable", true);
          var displayName = that.props.columnSettings.getMetadataColumnProperty(col, "displayName", col);

          columnSort = meta == null ? columnSort : (columnSort && (columnSort + " ")||columnSort) + that.props.columnSettings.getMetadataColumnProperty(col, "cssClassName", "");

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

      //Get the row from the row settings.
      var className = that.props.rowSettings&&that.props.rowSettings.getHeaderRowMetadataClass() || null;

      return(
          <thead>
              <tr
                  className={className}
                  style={this.props.headerStyles}>
                  {nodes}
              </tr>
          </thead>
      );
    }
});

module.exports = GridTitle;
