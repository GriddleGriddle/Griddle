import React from 'react';
import PropTypes from 'prop-types';
import { connect } from '../utils/griddleConnect';

import {
  classNamesForComponentSelector,
  stylesForComponentSelector
} from '../selectors/dataSelectors';

const NoResultsContainer = (OriginalComponent) =>
  connect((state) => ({
    className: classNamesForComponentSelector(state, 'NoResults'),
    style: stylesForComponentSelector(state, 'NoResults')
  }))((props) => {
    const noResultsProps = {
      NoResults: props.context.components.NoResults,
      ...props
    };
    return <OriginalComponent {...noResultsProps} />;
  });

export default NoResultsContainer;
