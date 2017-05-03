import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import getContext from 'recompose/getContext';
import { currentPageSelector, maxPageSelector, classNamesForComponentSelector, stylesForComponentSelector } from '../selectors/dataSelectors';

const enhance = OriginalComponent => compose(
  getContext({
    events: PropTypes.object,
  }),
  connect((state, props) => ({
    maxPages: maxPageSelector(state, props),
    currentPage: currentPageSelector(state, props),
    className: classNamesForComponentSelector(state, 'PageDropdown'),
    style: stylesForComponentSelector(state, 'PageDropdown'),
  })),
  mapProps(({ events: { onGetPage: setPage }, ...props }) => ({
    ...props,
    setPage,
  }))
)((props) => <OriginalComponent {...props} />);

export default enhance;
