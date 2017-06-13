import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import getContext from 'recompose/getContext';
import withHandlers from 'recompose/withHandlers';
import { sortPropertyByIdSelector, iconsForComponentSelector, customHeadingComponentSelector, stylesForComponentSelector, classNamesForComponentSelector, cellPropertiesSelector } from '../../../selectors/dataSelectors';
import { setSortColumn } from '../../../actions';
import { setSortProperties } from '../../../utils/sortUtils';
import { valueOrResult } from '../../../utils/valueUtils';

const DefaultTableHeadingCellContent = ({title, icon}) => (
  <span>
    { title }
    { icon && <span>{icon}</span> }
  </span>
)

function getIcon({sortProperty, sortAscendingIcon, sortDescendingIcon}) {
  if (sortProperty) {
    return sortProperty.sortAscending ? sortAscendingIcon : sortDescendingIcon;
  }

  // return null so we don't render anything if no sortProperty
  return null;
}
const EnhancedHeadingCell = OriginalComponent => compose(
  getContext({
    events: PropTypes.object,
  }),
  connect(
    (state, props) => ({
      sortProperty: sortPropertyByIdSelector(state, props),
      customHeadingComponent: customHeadingComponentSelector(state, props),
      cellProperties: cellPropertiesSelector(state, props),
      className: classNamesForComponentSelector(state, 'TableHeadingCell'),
      style: stylesForComponentSelector(state, 'TableHeadingCell'),
      ...iconsForComponentSelector(state, 'TableHeadingCell'),
    }),
    {
      setSortColumn
    }
  ),
  withHandlers(props => ({
    onClick: props.cellProperties.sortable === false ? (() => () => {}) :
      props.events.setSortProperties || setSortProperties,
  })),
  //TODO: use with props on change or something more performant here
  mapProps(props => {
    const icon = getIcon(props);
    const title = props.customHeadingComponent ?
      <props.customHeadingComponent {...props.cellProperties.extraData} {...props} icon={icon} /> :
      <DefaultTableHeadingCellContent title={props.title} icon={icon} />;
    const className = valueOrResult(props.cellProperties.headerCssClassName, props) || props.className;
    const style = {
      ...(props.cellProperties.sortable === false || { cursor: 'pointer' }),
      ...props.style,
    };

    return {
      ...props.cellProperties.extraData,
      ...props,
      icon,
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
