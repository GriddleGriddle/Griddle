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

        arr.push(<GridRow data={this.props.data} columnMetadata={this.props.columnMetadata} metadataColumns={that.props.metadataColumns}
          hasChildren={that.props.hasChildren} toggleChildren={that.toggleChildren} showChildren={that.state.showChildren} key={that.props.uniqueId}/>);
          var children = null;
        if(that.state.showChildren){
            children =  that.props.hasChildren && this.props.data["children"].map(function(row, index){
                if(typeof row["children"] !== "undefined"){
                  return (<tr><td colSpan={Object.keys(that.props.data).length - that.props.metadataColumns.length} className="griddle-parent">
                      <Griddle results={[row]} tableClassName={that.props.tableClassName} showTableHeading={false} showPager={false} columnMetadata={that.props.columnMetadata}/>
                    </td></tr>);
                }

                return <GridRow data={row} metadataColumns={that.props.metadataColumns} isChildRow={true} columnMetadata={that.props.columnMetadata} key={_.uniqueId("grid_row")}/>
            });


        }

        return that.props.hasChildren === false ? arr[0] : <tbody>{that.state.showChildren ? arr.concat(children) : arr}</tbody>
    }
});

module.exports = GridRowContainer;
