jest.dontMock('../gridTitle.jsx');
jest.dontMock('../columnProperties.js');

var React = require('react');
var GridTitle = require('../gridTitle.jsx');
var TestUtils = require('react-addons-test-utils');
var ColumnProperties = require('../columnProperties.js');

describe('GridTitle', function() {
	var title;
	var columns;
	var columnSettings;
	var sortObject;
	var multipleSelectOptions;
	var multipleSelectSettings;

	beforeEach(function(){
		columns = ["one", "two", "three"];
		columnSettings = new ColumnProperties(columns, [], "children", [], []);
    sortObject =  {
        enableSort: true,
        changeSort: null,
        sortColumn: "",
        sortAscending: true,
				sortDefaultComponent: null,
        sortAscendingClassName: "",
        sortDescendingClassName: "",
        sortAscendingComponent: null,
        sortDescendingComponent: null
    };
    multipleSelectSettings = {
			isMultipleSelection: false,
			toggleSelectAll: function(){},
			getIsSelectAllChecked: function(){},

			toggleSelectRow: function(){},
			getSelectedRowIds: function(){},
      getIsRowChecked: function(){}
		};

    var renderer = TestUtils.createRenderer();
    renderer.render(<GridTitle columns={columns} columnSettings={columnSettings} sortSettings={sortObject} multipleSelectionSettings={multipleSelectSettings} />);
    title = renderer.getRenderOutput();
	});
  
	it('calls sortDefaultComponent in table init', function(){
    expect(title.type).toBe('thead');
    const headings = title.props.children.props.children.length;
    expect(headings).toEqual(3);

    for(var i = 0, l = headings.length; i < l; i++) {
      var heading = headings[i];
      expect(heading.props.children[1]).toEqual(sortObject['sortDefaultComponent']);
    }
	});
});
