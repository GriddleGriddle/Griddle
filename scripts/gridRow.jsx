/*
   See License / Disclaimer https://raw.githubusercontent.com/DynamicTyped/Griddle/master/LICENSE
*/
var React = require('react');
var _ = require('underscore');
var ColumnProperties = require('./columnProperties.js');
var deep = require('./deep.js');

var GridRow = React.createClass({
    getDefaultProps: function(){
      return {
        "isChildRow": false,
        "showChildren": false,
        "data": {},
        "columnSettings": null,
        "rowSettings": null,
        "hasChildren": false,
        "useGriddleStyles": true,
        "useGriddleIcons": true,
        "isSubGriddle": false,
        "paddingHeight": null,
        "rowHeight": null,
        "parentRowCollapsedClassName": "parent-row",
        "parentRowExpandedClassName": "parent-row expanded",
        "parentRowCollapsedComponent": "▶",
        "parentRowExpandedComponent": "▼",
        "onRowClick": null,
	    "multipleSelectionSettings": null
      }
    },
    handleClick: function(e){
        if(this.props.onRowClick !== null && _.isFunction(this.props.onRowClick) ){
            this.props.onRowClick(this, e);
        }else if(this.props.hasChildren){
            this.props.toggleChildren();
        }
    },
    handleSelectionChange: function(e) {
      //hack to get around warning that's not super useful in this case
      return;
    },
	handleSelectClick: function(e) {
		if(this.props.multipleSelectionSettings.isMultipleSelection) {
			if(e.target.type === "checkbox") {
				this.props.multipleSelectionSettings.toggleSelectRow(this.props.data, this.refs.selected.checked);
			} else {
				this.props.multipleSelectionSettings.toggleSelectRow(this.props.data, !this.refs.selected.checked)
			}
		}
	},
    verifyProps: function(){
        if(this.props.columnSettings === null){
           console.error("gridRow: The columnSettings prop is null and it shouldn't be");
        }
    },
    render: function() {
        this.verifyProps();
        var that = this;
        var columnStyles = null;

        if (this.props.useGriddleStyles) {
          columnStyles = {
            margin: "0",
            padding: that.props.paddingHeight + "px 5px " + that.props.paddingHeight + "px 5px",
            height: that.props.rowHeight? this.props.rowHeight - that.props.paddingHeight * 2 + "px" : null,
            backgroundColor: "#FFF",
            borderTopColor: "#DDD",
            color: "#222"
          };
        }

        var columns = this.props.columnSettings.getColumns();

        // make sure that all the columns we need have default empty values
        // otherwise they will get clipped
        var defaults = _.object(columns, []);

        // creates a 'view' on top the data so we will not alter the original data but will allow us to add default values to missing columns
        var dataView = _.extend(this.props.data);

        _.defaults(dataView, defaults);
        var data = _.pairs(deep.pick(dataView, _.without(columns, 'children')));
        var nodes = data.map((col, index) => {
            var returnValue = null;
            var meta = this.props.columnSettings.getColumnMetadataByName(col[0]);

            //todo: Make this not as ridiculous looking
            var firstColAppend = index === 0 && this.props.hasChildren && this.props.showChildren === false && this.props.useGriddleIcons ?
              <span style={this.props.useGriddleStyles ? {fontSize: "10px", marginRight:"5px"} : null}>{this.props.parentRowCollapsedComponent}</span> :
              index === 0 && this.props.hasChildren && this.props.showChildren && this.props.useGriddleIcons ?
                <span style={this.props.useGriddleStyles ? {fontSize: "10px"} : null}>{this.props.parentRowExpandedComponent}</span> : "";

            if(index === 0 && this.props.isChildRow && this.props.useGriddleStyles){
              columnStyles = _.extend(columnStyles, {paddingLeft:10})
            }

            if (this.props.columnSettings.hasColumnMetadata() && typeof meta !== "undefined"){
              var colData = (typeof meta.customComponent === 'undefined' || meta.customComponent === null) ? col[1] : <meta.customComponent data={col[1]} rowData={dataView} metadata={meta} />;
              returnValue = (meta == null ? returnValue : <td onClick={this.handleClick} className={meta.cssClassName} key={index} style={columnStyles}>{colData}</td>);
            }

            return returnValue || (<td onClick={this.handleClick} key={index} style={columnStyles}>{firstColAppend}{col[1]}</td>);
        });

		if(nodes && this.props.multipleSelectionSettings && this.props.multipleSelectionSettings.isMultipleSelection) {
			var selectedRowIds = this.props.multipleSelectionSettings.getSelectedRowIds();

			nodes.unshift(
              <td key="selection" style={columnStyles}>
                <input
                    type="checkbox"
                    checked={this.props.multipleSelectionSettings.getIsRowChecked(dataView)}
                    onChange={this.handleSelectionChange}
                    ref="selected" />
              </td>
            );
		}

        //Get the row from the row settings.
        var className = that.props.rowSettings&&that.props.rowSettings.getBodyRowMetadataClass(that.props.data) || "standard-row";

        if(that.props.isChildRow){
            className = "child-row";
        } else if (that.props.hasChildren){
            className = that.props.showChildren ? this.props.parentRowExpandedClassName : this.props.parentRowCollapsedClassName;
        }
        return (<tr onClick={this.props.multipleSelectionSettings && this.props.multipleSelectionSettings.isMultipleSelection ? this.handleSelectClick : null} className={className}>{nodes}</tr>);
    }
});

module.exports = GridRow;
