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
           "changeSort": null,
           "enableColumnFilter": true,
           "changeFilter" : null,
           "columnFilters" : [],
           "results" : []
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
        var that = this;
        var nodes = this.props.columns.map(function(col, index){
            var columnSort = "";
            var sortComponent = null;
            var titleStyles = null;
            var inputStyle = null;

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
            var columnIsFilterable = that.isFilterable(that.props.enableColumnFilter, meta);

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

            if (that.props.useGriddleStyles){
              inputStyle = {
                width: "95%"
              }
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
                uniqueData = _.uniq(_.map(that.props.results, function(res) {return res[col];}));
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
