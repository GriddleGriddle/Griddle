import React from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers, mapProps } from 'recompose';
import { sortPropertyByIdSelector, iconsForComponentSelector, customHeadingComponentSelector } from '../../../selectors/dataSelectors';
import { setSortColumn } from '../../../actions';

const DefaultTableHeadingCellContent = ({title, icon}) => (
  <span>
    { title }
    { icon && <span>{icon}</span> }
  </span>
)

function setSortProperties({setSortColumn, sortProperty, columnId}) {
  return function(event) {
    if (sortProperty === null) {
      setSortColumn({ id: columnId, sortAscending: true });
      return;
    }

    const newSortProperty = {
      ...sortProperty,
      sortAscending: !sortProperty.sortAscending
    };

    setSortColumn(newSortProperty);
  };
}

function getIcon({sortProperty, sortAscendingIcon, sortDescendingIcon}) {
  if (sortProperty) {
    return sortProperty.sortAscending ? sortAscendingIcon : sortDescendingIcon;
  }

  // return null so we don't render anything if no sortProperty
  return null;
}
const EnhancedHeadingCell = (OriginalComponent => compose(
  connect(
    (state, props) => ({
      sortProperty: sortPropertyByIdSelector(state, props),
      customHeadingComponent: customHeadingComponentSelector(state, props),
      ...iconsForComponentSelector(state, 'TableHeadingCell'),
    }),
    {
      setSortColumn
    }
  ),
  withHandlers({
    onClick: setSortProperties
  }),
  //TODO: use with props on change or something more performant here
  mapProps(props => {
    const icon = getIcon(props);
    const title = props.customHeadingComponent ?
      <props.customHeadingComponent {...props} icon={icon} /> :
      <DefaultTableHeadingCellContent title={props.title} icon={icon} />;
    return {
      ...props,
      icon,
      title
    };
  })
)((props) => (
  <OriginalComponent
    {...props}
    onClick={props.onClick} />
)));

export default EnhancedHeadingCell;
