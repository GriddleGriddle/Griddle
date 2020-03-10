import React from 'react';
import PropTypes from 'prop-types';
import { connect } from '../utils/griddleConnect';

import {
  classNamesForComponentSelector,
  stylesForComponentSelector
} from '../selectors/dataSelectors';
import GriddleContext from '../context/GriddleContext';

const NoResultsContainer = (OriginalComponent) =>
  connect((state) =>
    ({
      className: classNamesForComponentSelector(state, 'NoResults'),
      style: stylesForComponentSelector(state, 'NoResults')
    }((props) => {
      const griddleContext = React.useContext(GriddleContext);
      const noResultProps = {
        NoResults: griddleContext.components.NoResults,
        ...props
      };
      return <OriginalComponent {...noResultProps} />;
    }))
  );

export default NoResultsContainer;
