/** @jsx React.DOM */

/*
   Griddle - Simple Grid Component for React
   https://github.com/DynamicTyped/Griddle
   Copyright (c) 2014 Ryan Lanciaux | DynamicTyped

   See License / Disclaimer https://raw.githubusercontent.com/DynamicTyped/Griddle/master/LICENSE
*/
var React = require('react/addons');
var GridRow = require('./gridRow.jsx');

var GridRowContainer = React.createClass({
    getInitialState: function(){
        return {
           "data": {
           },
           "metadataColumns": []
        }
    },
    toggleChildren: function(){
        this.setState({
            showChildren: this.state.showChildren == false
        });
    },
    getInitialState: function(){
        return { showChildren: false };
    },
    render: function(){
        var that = this;

        if(typeof this.props.data === "undefined"){return (<tbody></tbody>);}
        var arr = [];
        var hasChildren = (typeof this.props.data["children"] !== "undefined") && this.props.data["children"].length > 0;

        arr.push(<GridRow data={this.props.data} metadataColumns={that.props.metadataColumns} hasChildren={hasChildren} toggleChildren={that.toggleChildren} showChildren={that.state.showChildren}/>);

        if(that.state.showChildren){
            var children =  hasChildren && this.props.data["children"].map(function(row, index){
                if(typeof row["children"] !== "undefined"){
                  return (<tr><td colSpan={Object.keys(that.props.data).length - that.props.metadataColumns.length}>
                      <Griddle results={[row]} tableClassName="table" showTableHeading={false}/>
                    </td></tr>);
                }

                return <GridRow data={row} metadataColumns={that.props.metadataColumns} isChildRow={true}/>
            });

            
        }

        return <tbody>{that.state.showChildren ? arr.concat(children) : arr}</tbody>
    }
});

module.exports = GridRowContainer;
