import React from 'react';
import PropTypes from 'prop-types';
import { connect } from '../utils/griddleConnect';

import {
  classNamesForComponentSelector,
  stylesForComponentSelector
} from '../selectors/dataSelectors';

const LoadingContainer = (OriginalComponent) =>
  connect((state) =>
    ({
      className: classNamesForComponentSelector(state, 'Loading'),
      style: stylesForComponentSelector(state, 'Loading')
    }((props) => {
      const loadingProps = { ...props, Loading: props.context.components.Loading };
      return <OriginalComponent {...loadingProps} />;
    }))
  );

export default LoadingContainer;
