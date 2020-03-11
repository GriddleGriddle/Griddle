import React from 'react';
import PropTypes from 'prop-types';
import { connect } from '../../../utils/griddleConnect';

import {
  classNamesForComponentSelector,
  stylesForComponentSelector,
  dataLoadingSelector,
  visibleRowCountSelector
} from '../selectors/localSelectors';

const ComposedContainerComponent = (OriginalComponent) =>
  connect((state, props) => ({
    dataLoading: dataLoadingSelector(state),
    visibleRows: visibleRowCountSelector(state),
    className: classNamesForComponentSelector(state, 'Table'),
    style: stylesForComponentSelector(state, 'Table')
  }))((props) => {
    const tableProps = {
      ...props,
      TableHeading: props.context.components.TableHeading,
      TableBody: props.context.components.TableBody,
      Loading: props.context.components.Loading,
      NoResults: props.context.components.NoResults
    };
    return <OriginalComponent {...tableProps} />;
  });

export default ComposedContainerComponent;
