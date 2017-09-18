import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import getContext from 'recompose/getContext';
import { connect } from '../utils/griddleConnect';
//import { textSelector, hasPreviousSelector, classNamesForComponentSelector, stylesForComponentSelector } from '../selectors/dataSelectors';

const enhance = OriginalComponent => compose(
  getContext({
    selectors: PropTypes.object
  }),
  connect(
    (state, props) => ({
      text: props.selectors.textSelector(state, { key: 'previous' }),
      hasPrevious: props.selectors.hasPreviousSelector(state, props),
      className: props.selectors.classNamesForComponentSelector(state, 'PreviousButton'),
      style: props.selectors.stylesForComponentSelector(state, 'PreviousButton'),
    })
  )
)((props) => <OriginalComponent {...props} />);

export default enhance;
