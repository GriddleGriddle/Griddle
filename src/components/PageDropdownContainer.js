import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { compose, mapProps, getContext } from 'recompose';
import { currentPageSelector, maxPageSelector } from '../selectors/dataSelectors';

const enhance = OriginalComponent => compose(
  getContext({
    events: PropTypes.object,
  }),
  connect((state, props) => ({
    maxPages: maxPageSelector(state, props),
    currentPage: currentPageSelector(state, props),
  })),
  mapProps(({ events: { onGetPage: setPage }, ...props }) => ({
    ...props,
    setPage,
  }))
)((props) => <OriginalComponent {...props} />);

export default enhance;
