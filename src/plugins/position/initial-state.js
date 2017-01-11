const initialState = {
  renderedData: [],
  currentPosition: {
    height: 500,
    width: 500,
    xScrollChangePosition: 0,
    yScrollChangePosition: 0,
    renderedStartDisplayIndex: 0,
    renderedEndDisplayIndex: 16,
    visibleDataLength: 16
  },
  positionSettings: {
    // The height of the table
    tableHeight: '70%',
    // The width of the table
    tableWidth: null,
    // The minimum row height
    rowHeight: 30,
    // The minimum column width
    defaultColumnWidth: null,
    // Whether or not the header should be fixed
    fixedHeader: true,
    // Disable pointer events while scrolling to improve performance
    disablePointerEvents: false,
  },
};

export default initialState;
