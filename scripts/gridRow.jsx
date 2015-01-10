/** @jsx React.DOM */

/*
   Griddle - Simple Grid Component for React
   https://github.com/DynamicTyped/Griddle
   Copyright (c) 2014 Ryan Lanciaux | DynamicTyped

   See License / Disclaimer https://raw.githubusercontent.com/DynamicTyped/Griddle/master/LICENSE
*/
var React = require('react');
var _ = require('underscore');

var GridRow = React.createClass({
    getDefaultProps: function(){
      return {
        "isChildRow": false,
        "showChildren": false,
        "data": {},
        "metadataColumns": [],
        "hasChildren": false,
        "columnMetadata": null,
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
    render: function() {
        var that = this;
        var columnStyles = this.props.useGriddleStyles ?
          {
            padding: "5px",
            backgroundColor: "#FFF",
            borderTopColor: "#DDD",
            color: "#222"
          } : null;

        var nodes = _.pairs(_.omit(this.props.data, this.props.metadataColumns)).map(function(col, index) {
            var returnValue = null;
            var meta = _.findWhere(that.props.columnMetadata, {columnName: col[0]});

            //todo: Make this not as ridiculous looking
            firstColAppend = index === 0 && that.props.hasChildren && that.props.showChildren === false && that.props.useGriddleIcons ?
              <span style={that.props.useGriddleStyles&&{fontSize: "10px", marginRight:"5px"}}>{that.props.parentRowCollapsedComponent}</span> :
              index === 0 && that.props.hasChildren && that.props.showChildren && that.props.useGriddleIcons ?
                <span style={that.props.useGriddleStyles&&{fontSize: "10px"}}>{that.props.parentRowExpandedComponent}</span> : "";

            if(index === 0 && that.props.isChildRow && that.props.useGriddleStyles){
              columnStyles = _.extend(columnStyles, {paddingLeft:10})
            }


            if (that.props.columnMetadata !== null && that.props.columnMetadata.length > 0 && typeof meta !== "undefined"){
              var colData = (typeof meta === 'undefined' || typeof meta.customComponent === 'undefined' || meta.customComponent === null) ? col[1] : <meta.customComponent data={col[1]} rowData={that.props.data} />;
              returnValue = (meta == null ? returnValue : <td onClick={that.props.hasChildren && that.handleClick} className={meta.cssClassName} key={index} style={columnStyles}>{colData}</td>);
            }

            return returnValue || (<td onClick={that.props.hasChildren && that.handleClick} key={index} style={columnStyles}>{firstColAppend}{col[1]}</td>);
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
