/** @jsx React.DOM */

/*
   Griddle - Simple Grid Component for React
   https://github.com/DynamicTyped/Griddle
   Copyright (c) 2014 Ryan Lanciaux | DynamicTyped

   See License / Disclaimer https://raw.githubusercontent.com/DynamicTyped/Griddle/master/LICENSE
*/
var React = require('react');
var _ = require('underscore');

//needs props maxPage, currentPage, nextFunction, prevFunction
var GridPagination = React.createClass({
    getDefaultProps: function(){
        return{
            "maxPage": 0,
            "nextText": "",
            "previousText": "",
            "currentPage": 0
        }
    },
    pageChange: function(event){
        this.props.setPage(parseInt(event.target.value, 10)-1);
    },
    render: function(){
        var previous = "";
        var next = "";

        if(this.props.currentPage > 0){
            previous = <span onClick={this.props.previous} className="previous"><i className="griddle-icon-left"></i>{this.props.previousText}</span>
        }

        if(this.props.currentPage !== (this.props.maxPage -1)){
            next = <span onClick={this.props.next} className="next">{this.props.nextText}<i className="griddle-icon-right"></i></span>
        }

        var leftStyle = null;
        var middleStyle = null; 
        var rightStyle = null; 

        if(typeof this.props.useGriddleStyles !== 'undefined' && this.props.useGriddleStyles === true){
            leftStyle = {
                "float": "left",
                "width": "33%",
                "min-height": "1px"
            };

            rightStyle = _.extend({"text-align":"right"}, leftStyle);
            middleStyle = _.extend({"text-align":"center"}, leftStyle);  
        }

        var options = [];

        for(var i = 1; i<= this.props.maxPage; i++){
            options.push(<option value={i} key={i}>{i}</option>);
        }

        return (
            <div className="row">
                <div className="griddle-previous" style={leftStyle}>{previous}</div>
                <div className="griddle-page" style={middleStyle}>
                    <select value={this.props.currentPage+1} onChange={this.pageChange}>
                        {options}
                    </select> / {this.props.maxPage}
                </div>
                <div className="griddle-next" style={rightStyle}>{next}</div>
            </div>
        )
    }
})

module.exports = GridPagination;
