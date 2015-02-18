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
           "changeSort": null,
           "changeFilter" : null,
           "columnFilters" : []
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
    isFilterable: function(enableFilter, meta){
      var metaIsValid = typeof meta !== "undefined" && meta !== null;

      return metaIsValid ? (meta.hasOwnProperty("filterable") && (meta.filterable !== null)) ?
        enableFilter && meta.filterable :
        enableFilter : enableFilter;
    },
    getMetadataValue: function(defaultValue, propertyName, meta) {
      return meta == null ? defaultValue : typeof(meta[propertyName]) !== "undefined" && meta[propertyName] != null ? meta[propertyName] : defaultValue;
    },
    filter: function(event) {
      this.props.changeFilter(event.target.value, event.target.dataset.title);
    },
    render: function(){
      this.verifyProps();
      var that = this;

      var nodes = this.props.columnSettings.getColumns().map(function(col, index){
        var columnSort = "";
        var sortComponent = null;
        var titleStyles = null;
        var inputStyle = null;

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
        var columnIsFilterable = that.isFilterable(that.props.columnSettings.hasColumnFilterEnabled(), meta);

        columnSort = meta == null ? columnSort : (columnSort && (columnSort + " ")||columnSort) + meta.cssClassName;
        if (typeof meta !== "undefined" && typeof meta.displayName !== "undefined" && meta.displayName != null) {
            displayName = meta.displayName;
        }

        if (that.props.useGriddleStyles) {
          titleStyles = {
            backgroundColor: "#EDEDEF",
            border: "0",
            borderBottom: "1px solid #DDD",
            color: "#222",
            padding: "5px",
            cursor: columnIsSortable ? "pointer" : "default"
          };

          inputStyle = {
            width: "95%"
          };
        }

        var filterComponent = "";
        if (columnIsFilterable) {
          var filterValue = "";
          var filterType = "text";
          var filterSortType = "string";

          filterType = that.getMetadataValue(filterType, "filterType", meta).toLowerCase();
          filterSortType = that.getMetadataValue(filterSortType, "filterSortType", meta).toLowerCase();

          if (typeof that.props.columnFilters !== "undefined" && typeof that.props.columnFilters[col] !== "undefined" && that.props.columnFilters[col] != null) {
            filterValue = that.props.columnFilters[col];
          }

          var uniqueData = [];
          if (filterType == "select") {
            debugger;
            uniqueData = that.props.columnSettings.getColumnValuesByName(col);
            if (filterSortType == "number") {
              uniqueData = _.sortBy(uniqueData, function (element) {
                return parseFloat(element);
              });
            } else if (filterSortType != "none") {
              uniqueData = _.sortBy(uniqueData);
            }

            filterComponent = <div>
                <select onClick={function(event) {event.stopPropagation();}} onChange={that.filter} value={filterValue} data-title={col}>
                    <option value=""></option>
                    {uniqueData.map(function (point) {
                        var key = point == null ? "null" : point;
                        return <option value={point} key={key}>{point}</option>;
                      })
                    }
                </select>
              </div>;
          } else {
            filterComponent = <div><input style={inputStyle} onClick={function(event) {event.stopPropagation();}} onChange={that.filter} type="text" value={filterValue} data-title={col} /></div>;
          }
        }

        return (<th onClick={columnIsSortable ? that.sort : null} data-title={col} className={columnSort} key={displayName} style={titleStyles}>{displayName}{sortComponent}{filterComponent}</th>);
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
