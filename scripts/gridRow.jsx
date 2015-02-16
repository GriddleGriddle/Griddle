/*
   See License / Disclaimer https://raw.githubusercontent.com/DynamicTyped/Griddle/master/LICENSE
*/
var React = require('react');
var _ = require('underscore');
var ColumnProperties = require('./columnProperties.js');

var GridRow = React.createClass({
    getDefaultProps: function(){
      return {
        "isChildRow": false,
        "showChildren": false,
        "data": {},
        "columnSettings": null,
        "hasChildren": false,
        "useGriddleStyles": true,
        "useGriddleIcons": true,
        "isSubGriddle": false,
        "parentRowCollapsedClassName": "parent-row",
        "parentRowExpandedClassName": "parent-row expanded",
        "parentRowCollapsedComponent": "▶",
        "parentRowExpandedComponent": "▼"
      }
    },
    handleClick: function(){
      this.props.toggleChildren();
    },
    verifyProps: function(){
        if(this.props.columnSettings === null){
           console.error("gridRow: The columnSettings prop is null and it shouldn't be");
        }
    },
    render: function() {
        this.verifyProps();
        var that = this;

        var columnStyles = this.props.useGriddleStyles ?
          {
            padding: "5px",
            backgroundColor: "#FFF",
            borderTopColor: "#DDD",
            color: "#222"
          } : null;

        var data = _.pairs(_.pick(this.props.data, this.props.columnSettings.getColumns()))
        var nodes = data.map((col, index) => {
            var returnValue = null;
            var meta = this.props.columnSettings.getColumnMetadataByName(col[0]);

            //todo: Make this not as ridiculous looking
            var firstColAppend = index === 0 && this.props.hasChildren && this.props.showChildren === false && this.props.useGriddleIcons ?
              <span style={this.props.useGriddleStyles&&{fontSize: "10px", marginRight:"5px"}}>{this.props.parentRowCollapsedComponent}</span> :
              index === 0 && this.props.hasChildren && this.props.showChildren && this.props.useGriddleIcons ?
                <span style={this.props.useGriddleStyles&&{fontSize: "10px"}}>{this.props.parentRowExpandedComponent}</span> : "";

            if(index === 0 && this.props.isChildRow && this.props.useGriddleStyles){
              columnStyles = _.extend(columnStyles, {paddingLeft:10})
            }


            if (this.props.columnSettings.hasColumnMetadata() && typeof meta !== "undefined"){
              var colData = (typeof meta.customComponent === 'undefined' || meta.customComponent === null) ? col[1] : <meta.customComponent data={col[1]} rowData={this.props.data} />;
              returnValue = (meta == null ? returnValue : <td onClick={this.props.hasChildren && this.handleClick} className={meta.cssClassName} key={index} style={columnStyles}>{colData}</td>);
            }

            return returnValue || (<td onClick={this.props.hasChildren && this.handleClick} key={index} style={columnStyles}>{firstColAppend}{col[1]}</td>);
        });

        //this is kind of hokey - make it better
        var className = "standard-row";


        if(that.props.isChildRow){
            className = "child-row";
        } else if (that.props.hasChildren){
            className = that.props.showChildren ? this.props.parentRowExpandedClassName : this.props.parentRowCollapsedClassName;
        }
        return (<tr className={className}>{nodes}</tr>);
    }
});

module.exports = GridRow;
