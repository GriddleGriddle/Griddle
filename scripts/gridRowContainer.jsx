/*
   See License / Disclaimer https://raw.githubusercontent.com/DynamicTyped/Griddle/master/LICENSE
*/
var React = require('react');
var ColumnProperties = require('./columnProperties.js');

var GridRowContainer = React.createClass({
    getDefaultProps: function(){
      return {
        "useGriddleStyles": true,
        "useGriddleIcons": true,
        "isSubGriddle": false,
        "columnSettings": null,
        "rowSettings": null,
        "paddingHeight": null,
        "rowHeight": null,
        "parentRowCollapsedClassName": "parent-row",
        "parentRowExpandedClassName": "parent-row expanded",
        "parentRowCollapsedComponent": "▶",
        "parentRowExpandedComponent": "▼",
        "onRowClick": null,
	    "multipleSelectionSettings": null
      };
    },
    getInitialState: function(){
        return {
           "data": {
           },
           "showChildren":false
        }
    },
    componentWillReceiveProps: function(){
      this.setShowChildren(false);
    },
    toggleChildren: function(){
      this.setShowChildren(this.state.showChildren === false);
    },
    setShowChildren: function(visible){
      this.setState({
        showChildren: visible
      });
    },
    verifyProps: function(){
        if(this.props.columnSettings === null){
           console.error("gridRowContainer: The columnSettings prop is null and it shouldn't be");
        }
    },
    render: function(){
      this.verifyProps();
      var that = this;
      if(typeof this.props.data === "undefined"){return (<tbody></tbody>);}
      var arr = [];

      var columns = this.props.columnSettings.getColumns();

      arr.push(<this.props.rowSettings.rowComponent 
        useGriddleStyles={this.props.useGriddleStyles}
        isSubGriddle={this.props.isSubGriddle} 
        data={this.props.rowSettings.isCustom ? _.pick(this.props.data, columns) : this.props.data}
        rowData={this.props.rowSettings.isCustom ? this.props.data : null }
        columnSettings={this.props.columnSettings}
        rowSettings={this.props.rowSettings}
        hasChildren={that.props.hasChildren}
        toggleChildren={that.toggleChildren}
        showChildren={that.state.showChildren}
        key={that.props.uniqueId}
        useGriddleIcons={that.props.useGriddleIcons}
        parentRowExpandedClassName={this.props.parentRowExpandedClassName}
        parentRowCollapsedClassName={this.props.parentRowCollapsedClassName}
        parentRowExpandedComponent={this.props.parentRowExpandedComponent}
        parentRowCollapsedComponent={this.props.parentRowCollapsedComponent}
        paddingHeight={that.props.paddingHeight}
        rowHeight={that.props.rowHeight}
        onRowClick={that.props.onRowClick}
	    multipleSelectionSettings={this.props.multipleSelectionSettings} />
      );

      var children = null;

      if(that.state.showChildren){
          children =  that.props.hasChildren && this.props.data["children"].map(function(row, index){
              if(typeof row["children"] !== "undefined"){
                var Griddle = require('./griddle.jsx');
                return (<tr style={{paddingLeft: 5}}>
                          <td colSpan={that.props.columnSettings.getVisibleColumnCount()} className="griddle-parent" style={that.props.useGriddleStyles ? {border: "none", "padding": "0 0 0 5px"} : null}>
                            <Griddle isSubGriddle={true} results={[row]} columns={that.props.columnSettings.getColumns()} tableClassName={that.props.tableClassName} parentRowExpandedClassName={that.props.parentRowExpandedClassName}
                              parentRowCollapsedClassName={that.props.parentRowCollapsedClassName}
                              showTableHeading={false} showPager={false} columnMetadata={that.props.columnSettings.columnMetadata}
                              parentRowExpandedComponent={that.props.parentRowExpandedComponent}
                              parentRowCollapsedComponent={that.props.parentRowCollapsedComponent}
                              paddingHeight={that.props.paddingHeight} rowHeight={that.props.rowHeight} />
                          </td>
                        </tr>);
              }

              return <that.props.rowSettings.rowComponent useGriddleStyles={that.props.useGriddleStyles} isSubGriddle={that.props.isSubGriddle} data={row} columnSettings={that.props.columnSettings} isChildRow={true} columnMetadata={that.props.columnSettings.columnMetadata} key={that.props.rowSettings.getRowKey(row)} />
          });
      }

      return that.props.hasChildren === false ? arr[0] : <tbody>{that.state.showChildren ? arr.concat(children) : arr}</tbody>
    }
});

module.exports = GridRowContainer;
