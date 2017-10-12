import React from 'react';
import PropTypes from 'prop-types';
// import { connect } from '../../../utils/griddleConnect';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import getContext from 'recompose/getContext';
import shouldUpdate from 'recompose/shouldUpdate';
import { connect } from 'react-redux';

import {
  columnIdsSelector,
  rowDataSelector,
  rowPropertiesSelector,
  classNamesForComponentSelector,
  stylesForComponentSelector,
} from '../selectors/localSelectors';
import { valueOrResult } from '../../../utils/valueUtils';

const ComposedRowContainer = OriginalComponent => compose(
  getContext({
    components: PropTypes.object
  }),
  shouldUpdate((props, nextProps)=> {
    console.log('should update row1?');
    return true;
  }),
  connect((state, props) => ({
    columnIds: columnIdsSelector(state),
    rowProperties: rowPropertiesSelector(state),
    rowData: rowDataSelector(state, props),
    className: classNamesForComponentSelector(state, 'Row'),
    style: stylesForComponentSelector(state, 'Row'),
  }), null, null, { storeKey: 'store' }),
  shouldUpdate((props, nextProps)=> {
    console.log('should update row2?');
    return true;
  }),
  mapProps((props) => {
    const { components, rowProperties, className, ...otherProps } = props;
    return {
      Cell: components.Cell,
      className: valueOrResult(rowProperties.cssClassName, props) || props.className,
      ...otherProps,
    };
  }),
)(({Cell, columnIds, griddleKey, style, className }) => (
  <OriginalComponent
    griddleKey={griddleKey}
    columnIds={columnIds}
    Cell={Cell}
    className={className}
    style={style}
  />
));

export default ComposedRowContainer;
