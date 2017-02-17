import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { withHandlers, getContext, compose, mapProps } from 'recompose';

import { classNamesForComponentSelector, stylesForComponentSelector } from '../selectors/dataSelectors';
import { setFilter } from '../actions';

const EnhancedFilter = OriginalComponent => compose(
  getContext({
    events: PropTypes.object
  }),
  connect((state, props) => ({
    className: classNamesForComponentSelector(state, 'Filter'),
    style: stylesForComponentSelector(state, 'Filter'),
  }), { setFilter }),
  mapProps(props => {
    const { events, ...otherProps } = props;

    return {
      setFilter: props.events.onFilter,
      ...otherProps,
    };
  })
)(props => <OriginalComponent {...props} />);

export default EnhancedFilter;
