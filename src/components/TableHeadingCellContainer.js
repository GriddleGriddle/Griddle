import React from 'react';
import PropTypes from 'prop-types';
import { connect } from '../utils/griddleConnect';
import { compose } from 'redux';
import {
  sortPropertyByIdSelector,
  iconsForComponentSelector,
  customHeadingComponentSelector,
  stylesForComponentSelector,
  classNamesForComponentSelector,
  cellPropertiesSelector
} from '../selectors/dataSelectors';
import { setSortColumn } from '../actions';
import { combineHandlers } from '../utils/compositionUtils';
import { getSortIconProps, setSortProperties } from '../utils/sortUtils';
import { valueOrResult } from '../utils/valueUtils';

const DefaultTableHeadingCellContent = ({ title, icon, iconClassName }) => (
  <span>
    {title}
    {icon && <span className={iconClassName}>{icon}</span>}
  </span>
);

const EnhancedHeadingCell = (OriginalComponent) =>
  connect(
    (state, props) => ({
      sortProperty: sortPropertyByIdSelector(state, props),
      customHeadingComponent: customHeadingComponentSelector(state, props),
      cellProperties: cellPropertiesSelector(state, props),
      className: classNamesForComponentSelector(state, 'TableHeadingCell'),
      sortAscendingClassName: classNamesForComponentSelector(state, 'TableHeadingCellAscending'),
      sortDescendingClassName: classNamesForComponentSelector(state, 'TableHeadingCellDescending'),
      style: stylesForComponentSelector(state, 'TableHeadingCell'),
      ...iconsForComponentSelector(state, 'TableHeadingCell')
    }),
    (
      dispatch,
      {
        context: {
          events: { onSort }
        }
      }
    ) => ({
      setSortColumn: combineHandlers([onSort, compose(dispatch, setSortColumn)])
    })
  )((props) => {
    const iconProps = getSortIconProps(props);
    const title = props.customHeadingComponent ? (
      <props.customHeadingComponent {...props.cellProperties.extraData} {...props} {...iconProps} />
    ) : (
      <DefaultTableHeadingCellContent title={props.title} {...iconProps} />
    );
    const className =
      valueOrResult(props.cellProperties.headerCssClassName, props) || props.className;
    const style = {
      ...(props.cellProperties.sortable === false || { cursor: 'pointer' }),
      ...props.style
    };
    let { setSortProperties: setSortPropertiesEvent } = props.context.events;
    if (setSortPropertiesEvent) {
      setSortPropertiesEvent = setSortPropertiesEvent.apply(this, [props]);
    }
    const onClick =
      props.cellProperties.sortable === false
        ? () => () => {}
        : setSortPropertiesEvent || setSortProperties.apply(this, [props]);
    const cellProps = {
      ...props.cellProperties.extraData,
      ...props,
      ...iconProps,
      title,
      style,
      className,
      onClick
    };
    return <OriginalComponent {...cellProps} />;
  });

export default EnhancedHeadingCell;
