import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { connect } from '../../../utils/griddleConnect';
import GriddleContext from '../../../context/GriddleContext';

const spacerRow = connect((state, props) => {
  const griddleContext = useContext(GriddleContext);
  const { topSpacerSelector, bottomSpacerSelector } = griddleContext.selectors;
  const { placement } = props;

  return {
    spacerHeight:
      placement === 'top' ? topSpacerSelector(state, props) : bottomSpacerSelector(state, props)
  };
})((props) => {
  const { placement, spacerHeight } = props;
  let spacerRowStyle = {
    height: `${spacerHeight}px`
  };

  return <tr key={placement + '-' + spacerHeight} style={spacerRowStyle}></tr>;
});

export default spacerRow;
