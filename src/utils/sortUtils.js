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
      original = (!!original.get(column) && original.get(column)) || "";
      newRecord = (!!newRecord.get(column) && newRecord.get(column)) || "";

      //TODO: This is about the most cheezy sorting check ever.
      //Make it better
      if(original === newRecord) {
        return 0;
      } else if (original > newRecord) {
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
