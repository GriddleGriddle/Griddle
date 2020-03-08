import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { connect } from '../../../utils/griddleConnect';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';

import {
  classNamesForComponentSelector,
  stylesForComponentSelector,
  dataLoadingSelector,
  visibleRowCountSelector
} from '../selectors/localSelectors';
import GriddleContext from '../../../context/GriddleContext';

const ComposedContainerComponent = (OriginalComponent) =>
  compose(
    mapProps((props) => {
      const griddleContext = useContext(GriddleContext);
      return {
        TableHeading: griddleContext.components.TableHeading,
        TableBody: griddleContext.components.TableBody,
        Loading: griddleContext.components.Loading,
        NoResults: griddleContext.components.NoResults
      };
    }),
    connect((state, props) => ({
      dataLoading: dataLoadingSelector(state),
      visibleRows: visibleRowCountSelector(state),
      className: classNamesForComponentSelector(state, 'Table'),
      style: stylesForComponentSelector(state, 'Table')
    }))
  )((props) => <OriginalComponent {...props} />);

export default ComposedContainerComponent;
