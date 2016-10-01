import { createStore, combineReducers, bindActionCreators } from 'redux';
import Immutable from 'immutable';
import { connect, Provider } from 'react-redux';
import React, { Component } from 'react';

import * as dataReducers from '../src/reducers/dataReducer';
import components from './components';

import { buildGriddleReducer, buildGriddleComponents } from './utils/compositionUtils';

export default class extends Component {
  static childContextTypes = {
    components: React.PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);

    const { plugins=[], data } = props;

    //Combine / compose the reducers to make a single, unified reducer
    const reducers = buildGriddleReducer([dataReducers, ...plugins.map(p => p.reducer)]);

debugger;
    //Combine / Compose the components to make a single component for each component type
    this.components = buildGriddleComponents([components, ...plugins.map(p => p.components)]);

    //TODO: This should get the column properties and row properties to determine
    //TODO: This should also look at the default and plugin initial state objects
    const renderProperties = {
      columnProperties: {
        name: {
          id: 'name',
          title: 'NAME'
        },
        city: {
          id: 'city',
          title: 'City'
        },
        state: {
          id: 'state',
          title: 'State'
        },
        country: {
          id: 'Country',
          title: 'Country'
        },
        company: {
          id: 'Company',
          title: 'Company'
        }
      }
    };

    const initialState = {
      renderProperties,
      data
    }

    this.store = createStore(
      reducers,
      initialState
    );
  }

  getChildContext() {
    return {
      components: this.components
    };
  }

  render() {
    return (
      <Provider store={this.store}>
        <this.components.Table />
      </Provider>
    )

  }
}
