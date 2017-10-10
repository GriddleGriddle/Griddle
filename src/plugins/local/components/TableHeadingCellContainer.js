import React from 'react';
import PropTypes from 'prop-types';
import { connect } from '../../../utils/griddleConnect';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import getContext from 'recompose/getContext';
import withHandlers from 'recompose/withHandlers';
import { sortPropertyByIdSelector, iconsForComponentSelector, customHeadingComponentSelector, stylesForComponentSelector, classNamesForComponentSelector, cellPropertiesSelector } from '../../../selectors/dataSelectors';
import { setSortColumn } from '../../../actions';
import { combineHandlers } from '../../../utils/compositionUtils';
import { getSortIconProps, setSortProperties } from '../../../utils/sortUtils';
import { valueOrResult } from '../../../utils/valueUtils';

const DefaultTableHeadingCellContent = ({title, icon, iconClassName}) => (
  <span>
    { title }
    { icon && <span className={iconClassName}>{icon}</span> }
  </span>
)

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
      sortAscendingClassName: classNamesForComponentSelector(state, 'TableHeadingCellAscending'),
      sortDescendingClassName: classNamesForComponentSelector(state, 'TableHeadingCellDescending'),
      style: stylesForComponentSelector(state, 'TableHeadingCell'),
      ...iconsForComponentSelector(state, 'TableHeadingCell'),
    }),
    (dispatch, { events: { onSort } }) => ({
      setSortColumn: combineHandlers([
        onSort,
        sp => dispatch(setSortColumn(sp)),
      ]),
    })
  ),
  withHandlers(props => ({
    onClick: props.cellProperties.sortable === false ? (() => () => {}) :
      props.events.setSortProperties || setSortProperties,
  })),
  //TODO: use with props on change or something more performant here
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
