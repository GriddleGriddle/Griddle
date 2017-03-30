import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import getContext from 'recompose/getContext';
import { columnTitlesSelector, columnIdsSelector, classNamesForComponentSelector, stylesForComponentSelector } from '../selectors/dataSelectors';

const NoResultsContainer = OriginalComponent => compose(
  getContext({
    components: PropTypes.object,
  }),
  connect(
    state => ({
      columnTitles: columnTitlesSelector(state),
      columnIds: columnIdsSelector(state),
      className: classNamesForComponentSelector(state, 'NoResults'),
      style: stylesForComponentSelector(state, 'NoResults'),
    })
  ),
  mapProps((props) => {
    const { components, ...otherProps } = props;
    return {
      NoResults: components.NoResults,
      ...otherProps
    };
  })
)((props) => <OriginalComponent {...props} />);

export default NoResultsContainer;

