import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import getContext from 'recompose/getContext';

import { connect } from '../utils/griddleConnect';

const EnhancedFilter = OriginalComponent => compose(
  getContext({
    selectors: PropTypes.object,
    actions: PropTypes.object,
  }),
  connect(
    (state, props) => ({
      className: props.selectors.classNamesForComponentSelector(state, 'Filter'),
      style: props.selectors.stylesForComponentSelector(state, 'Filter'),
    }),
    (dispatch, props) => ({
      setFilter: (filter) => dispatch(props.actions.setFilter(filter)),
    })
  )
)(props => <OriginalComponent {...props} />);

export default EnhancedFilter;
