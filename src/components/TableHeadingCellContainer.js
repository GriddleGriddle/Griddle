import React from 'react';
import PropTypes from 'prop-types';
import { connect } from '../utils/griddleConnect';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import getContext from 'recompose/getContext';

//import { sortPropertyByIdSelector, iconsForComponentSelector, classNamesForComponentSelector, stylesForComponentSelector, customHeadingComponentSelector, cellPropertiesSelector } from '../selectors/dataSelectors';
import { getSortIconProps } from '../utils/sortUtils';
import { valueOrResult } from '../utils/valueUtils';

const DefaultTableHeadingCellContent = ({title, icon}) => (
  <span>
    { title }
    { icon && <span>{icon}</span> }
  </span>
)

const EnhancedHeadingCell = OriginalComponent => compose(
  getContext({
    selectors: PropTypes.object,
  }),
  connect(
    (state, props) => ({
      sortProperty: props.selectors.sortPropertyByIdSelector(state, props),
      customHeadingComponent: props.selectors.customHeadingComponentSelector(state, props),
      cellProperties: props.selectors.cellPropertiesSelector(state, props),
      className: props.selectors.classNamesForComponentSelector(state, 'TableHeadingCell'),
      style: props.selectors.stylesForComponentSelector(state, 'TableHeadingCell'),
      ...props.selectors.iconsForComponentSelector(state, 'TableHeadingCell'),
    })
  ),
  mapProps(props => {
    const iconProps = getSortIconProps(props);
    const title = props.customHeadingComponent ?
      <props.customHeadingComponent {...props.cellProperties.extraData} {...props} {...iconProps} /> :
      <DefaultTableHeadingCellContent title={props.title} {...iconProps} />;
    const className = valueOrResult(props.cellProperties.headerCssClassName, props) || props.className;
    const style = {
      ...(props.cellProperties.sortable === false || { cursor: 'pointer' }),
      ...props.style,
    };

    return {
      ...props.cellProperties.extraData,
      ...props,
      ...iconProps,
      title,
      style,
      className
    };
  })
)(props =>
  <OriginalComponent
    {...props}
  />
);

export default EnhancedHeadingCell;
