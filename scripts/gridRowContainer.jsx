/** @jsx React.DOM */

/*
   Griddle - Simple Grid Component for React
   https://github.com/DynamicTyped/Griddle
   Copyright (c) 2014 Ryan Lanciaux | DynamicTyped

   See License / Disclaimer https://raw.githubusercontent.com/DynamicTyped/Griddle/master/LICENSE
*/
var React = require('react');
var GridRow = require('./gridRow.jsx');

var GridRowContainer = React.createClass({
    getDefaultProps: function(){
      return {
        "useGriddleStyles": true,
        "useGriddleIcons": true,
        "isSubGriddle": false,
        "parentRowCollapsedClassName": "parent-row",
        "parentRowExpandedClassName": "parent-row expanded"
      };
    },
    getInitialState: function(){
        return {
           "data": {
           },
           "metadataColumns": [],
           "showChildren":false
        }
    },
    toggleChildren: function(){
        this.setState({
            showChildren: this.state.showChildren === false
        });
    },
    render: function(){
        var that = this;

        if(typeof this.props.data === "undefined"){return (<tbody></tbody>);}
        var arr = [];

        arr.push(<GridRow useGriddleStyles={this.props.useGriddleStyles} isSubGriddle={this.props.isSubGriddle} data={this.props.data} columnMetadata={this.props.columnMetadata} metadataColumns={that.props.metadataColumns}
          hasChildren={that.props.hasChildren} toggleChildren={that.toggleChildren} showChildren={that.state.showChildren} key={that.props.uniqueId} useGriddleIcons={that.props.useGriddleIcons}
          parentRowExpandedClassName={this.props.parentRowExpandedClassName} parentRowCollapsedClassName={this.props.parentRowCollapsedClassName}/>);
          var children = null;

        if(that.state.showChildren){

            children =  that.props.hasChildren && this.props.data["children"].map(function(row, index){
                if(typeof row["children"] !== "undefined"){
                  return (<tr style={{paddingLeft: 5}}><td colSpan={Object.keys(that.props.data).length - that.props.metadataColumns.length} className="griddle-parent" style={that.props.useGriddleStyles&&{border: "none", "padding": "0 0 0 5px"}}>
                      <Griddle isSubGriddle={true} results={[row]} tableClassName={that.props.tableClassName} parentRowExpandedClassName={that.props.parentRowExpandedClassName} parentRowCollapsedClassName={that.props.parentRowCollapsedClassName} showTableHeading={false} showPager={false} columnMetadata={that.props.columnMetadata}/>
                    </td></tr>);
                }

                return <GridRow useGriddleStyles={that.props.useGriddleStyles} isSubGriddle={that.props.isSubGriddle} data={row} metadataColumns={that.props.metadataColumns} isChildRow={true} columnMetadata={that.props.columnMetadata} key={_.uniqueId("grid_row")}/>
            });
        }

        return that.props.hasChildren === false ? arr[0] : <tbody>{that.state.showChildren ? arr.concat(children) : arr}</tbody>
    }
});

module.exports = GridRowContainer;
