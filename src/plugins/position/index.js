import components from './components';
import * as reducer from './reducers';

const initialState = {
  positionSettings: {

  },
}

const PositionPlugin = (config) => {
  return {
    initialState: {
      positionSettings: {
        // The height of the table
        tableHeight: 500,
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
        ...config,
      },
    },
    components,
    reducer,
  };
}

export default PositionPlugin;
