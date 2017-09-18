import React from 'react';
import PropTypes from 'prop-types';
import { connect } from '../utils/griddleConnect';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import getContext from 'recompose/getContext';
//import { currentPageSelector, maxPageSelector, classNamesForComponentSelector, stylesForComponentSelector } from '../selectors/dataSelectors';

const enhance = OriginalComponent => compose(
  getContext({
    events: PropTypes.object,
    selectors: PropTypes.object
  }),
  connect(
    (state, props) => ({
      maxPages: props.selectors.maxPageSelector(state, props),
      currentPage: props.selectors.currentPageSelector(state, props),
      className: props.selectors.classNamesForComponentSelector(state, 'PageDropdown'),
      style: props.selectors.stylesForComponentSelector(state, 'PageDropdown'),
    })
  ),
  mapProps(({ events: { onGetPage: setPage }, ...props }) => ({
    ...props,
    setPage,
  }))
)((props) => <OriginalComponent {...props} />);

export default enhance;
