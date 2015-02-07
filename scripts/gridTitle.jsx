/*
   See License / Disclaimer https://raw.githubusercontent.com/DynamicTyped/Griddle/master/LICENSE
*/
var React = require('react');
var _ = require('underscore');

var GridTitle = React.createClass({
    getDefaultProps: function(){
        return {
           "columns":[],
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
    getMetadata: function(columnName, columnMetadata){
      return columnMetadata !== null ? 
         _.findWhere(columnMetadata, {columnName: columnName}) : 
         null;
    },
    isSortable: function(enableSort, meta){
      var metaIsValid = typeof meta !== "undefined" && meta !== null; 
        
      return metaIsValid ? (meta.hasOwnProperty("sortable") && (meta.sortable !== null)) ? 
        enableSort && meta.sortable : 
        enableSort : enableSort;
    },
    render: function(){
        var that = this;

        var nodes = this.props.columns.map(function(col, index){
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

            var meta = that.getMetadata(col, that.props.columnMetadata); 
            var columnIsSortable = that.isSortable(that.props.enableSort, meta); 

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
