import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { withHandlers, getContext, compose, mapProps } from 'recompose';

import { classNamesForComponentSelector, stylesForComponentSelector } from '../selectors/dataSelectors';


const EnhancedFilter = OriginalComponent => compose(
  getContext({
    events: PropTypes.object
  }),
  connect(
    (state, props) => ({
      className: classNamesForComponentSelector(state, 'Filter'),
      style: stylesForComponentSelector(state, 'Filter'),
      sortProperty: sortPropertyByIdSelector(state, props),
      customHeadingComponent: customHeadingComponentSelector(state, props),
    })
  )
  mapProps(props => {
    const { events, ...otherProps } = props;
    return {
      setFilter: props.events.onFilter,
      ...otherProps,
    };
  })
)(({setFilter}) => <OriginalComponent setFilter={setFilter} />);

export default EnhancedFilter;
