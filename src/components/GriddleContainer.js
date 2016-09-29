import { createStore, combineReducers, bindActionCreators } from 'redux';
import { buildGriddleReducer } from '../utils/compositionUtils';
import Immutable from 'immutable';
import { connect, Provider } from 'react-redux';

import * as localReducers from '../plugins/local/reducers/localReducer';
import { columnTitlesSelector, dataSelector } from '../plugins/local/selectors/localSelectors';

const reducers = buildGriddleReducer([localReducers]);
//load all plugins
//get the row / column settings and add to initial state
//setup initial state
//create combined reducer
//wire up actions
//override components in the correct order and set up the containers

const data = [
  {
    name: 'test',
    id: 1
  },
  {
    name: 'test2',
    id: 2
  }
]

const initialState ={
  data,
  renderProperties: {
    columnProperties: {
      name: {
        id: 'name',
        title: 'NAME'
      },
      id: {
        id: 'id',
        title: 'ID'
      }
    }
  }
};

const store = createStore(
  reducers,
  initialState
);

const Component = (props) => (<h1>HI</h1>);

const enhance = connect((state) => ({
  columnTitles: columnTitlesSelector(state),
  data: dataSelector(state)
}));

const EnhancedComponent = enhance(Component);

class Wrapper extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <EnhancedComponent />
      </Provider>
    );
  }
}

export default Wrapper
