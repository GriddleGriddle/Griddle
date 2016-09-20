import { createStore, combineReducers, bindActionCreators } from 'redux';
import { buildGriddleReducerReal } from '../utils/compositionUtils';
import Immutable from 'immutable';

import * as localReducers from '../reducers/localReducer';

const reducers = buildGriddleReducerReal([localReducers]);
//load all plugins
//get the row / column settings and add to initial state
//setup initial state
//create combined reducer
//wire up actions

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

export default (props) => (<h1>HELLO</h1>)
