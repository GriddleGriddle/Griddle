import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

/** The main griddle component */
import Griddle from './components/GriddleContainer';

render(<Griddle />, document.getElementById('main'));
