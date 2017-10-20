/* Sorts the given data by the specified column
 * @parameter {array<object>} data - The data to sort
 * @parameter {string} column - the name of the column to sort
 * @parameter {boolean optional} sortAscending - whether or not to sort this column in ascending order
 *
 * TODO: Needs tests!
 */
export function defaultSort(data, column, sortAscending = true) {
  return data.sort(
    (original, newRecord) => {
      const columnKey = column.split('.');
      const originalValue = (original.hasIn(columnKey) && original.getIn(columnKey)) || '';
      const newRecordValue = (newRecord.hasIn(columnKey) && newRecord.getIn(columnKey)) || '';

      //TODO: This is about the most cheezy sorting check ever.
      //Make it better
      if(originalValue === newRecordValue) {
        return 0;
      } else if (originalValue > newRecordValue) {
        return sortAscending ? 1 : -1;
      }
      else {
        return sortAscending ? -1 : 1;
      }
    });
}

export function setSortProperties({ setSortColumn, sortProperty, columnId }) {
  return () => {
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

export function getSortIconProps(props) {
  const { sortProperty, sortAscendingIcon, sortDescendingIcon } = props;
  const { sortAscendingClassName, sortDescendingClassName } = props;

  if (sortProperty) {
    return sortProperty.sortAscending ?
    {
      icon: sortAscendingIcon,
      iconClassName: sortAscendingClassName,
    } :
    {
      icon: sortDescendingIcon,
      iconClassName: sortDescendingClassName,
    };
  }

  // return null so we don't render anything if no sortProperty
  return null;
}
