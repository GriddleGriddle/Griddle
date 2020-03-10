import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { connect } from '../utils/griddleConnect';

import {
  classNamesForComponentSelector,
  stylesForComponentSelector
} from '../selectors/dataSelectors';
import GriddleContext from '../context/GriddleContext';

const LoadingContainer = (OriginalComponent) =>
  connect((state) =>
    ({
      className: classNamesForComponentSelector(state, 'Loading'),
      style: stylesForComponentSelector(state, 'Loading')
    }((props) => {
      const griddleContext = useContext(GriddleContext);
      const loadingProps = { ...props, Loading: griddleContext.components.Loading };
      return <OriginalComponent {...loadingProps} />;
    }))
  );

export default LoadingContainer;
