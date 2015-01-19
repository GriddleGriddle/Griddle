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
            "currentPage": 0,
            "useGriddleStyles": true,
            "nextClassName": "griddle-next",
            "previousClassName": "griddle-previous",
            "nextIconComponent": null,
            "previousIconComponent": null
        }
    },
    pageChange: function(event){
        this.props.setPage(parseInt(event.target.value, 10)-1);
    },
    render: function(){
        var previous = "";
        var next = "";

        if(this.props.currentPage > 0){
            previous = <button type="button" onClick={this.props.previous} style={this.props.useGriddleStyles ? {"color": "#222", border: "none", background: "none", margin: "0 0 0 10px"} : null}>{this.props.previousIconComponent}{this.props.previousText}</button>
        }

        if(this.props.currentPage !== (this.props.maxPage -1)){
            next = <button type="button" onClick={this.props.next} style={this.props.useGriddleStyles ? {"color":"#222", border: "none", background: "none", margin: "0 10px 0 0"} : null}>{this.props.nextText}{this.props.nextIconComponent}</button>
        }

        var leftStyle = null;
        var middleStyle = null;
        var rightStyle = null;

        if(this.props.useGriddleStyles === true){
            var baseStyle = {
                "float": "left",
                minHeight: "1px",
                marginTop: "5px"
            };

            rightStyle = _.extend({textAlign:"right", width: "34%"}, baseStyle);
            middleStyle = _.extend({textAlign:"center", width: "33%"}, baseStyle);
            leftStyle = _.extend({ width: "33%"}, baseStyle)
        }

        var options = [];

        for(var i = 1; i<= this.props.maxPage; i++){
            options.push(<option value={i} key={i}>{i}</option>);
        }

        return (
            <div style={this.props.useGriddleStyles ? { minHeight: "35px" } : null }>
                <div className={this.props.previousClassName} style={leftStyle}>{previous}</div>
                <div className="griddle-page" style={middleStyle}>
                    <select value={this.props.currentPage+1} onChange={this.pageChange}>
                        {options}
                    </select> / {this.props.maxPage}
                </div>
                <div className={this.props.nextClassName} style={rightStyle}>{next}</div>
            </div>
        )
    }
})

module.exports = GridPagination;
