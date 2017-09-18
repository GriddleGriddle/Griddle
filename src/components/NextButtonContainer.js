import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import getContext from 'recompose/getContext';
import { connect } from '../utils/griddleConnect';

//import { textSelector, hasNextSelector, classNamesForComponentSelector, stylesForComponentSelector } from '../selectors/dataSelectors';

const enhance = OriginalComponent => compose(
  getContext({
    selectors: PropTypes.object
  }),
  connect((state, props) => ({
    text: props.selectors.textSelector(state, { key: 'next' }),
    hasNext: props.selectors.hasNextSelector(state, props),
    className: props.selectors.classNamesForComponentSelector(state, 'NextButton'),
    style: props.selectors.stylesForComponentSelector(state, 'NextButton'),
  }))
)((props) => <OriginalComponent {...props} />);

export default enhance;
