const offset = 1000;

/** Gets a column properties object from an array of columnNames
 * @param {Array<string>} columns - array of column names
 */
function getColumnPropertiesFromColumnArray(columnProperties, columns) {
  return columns.reduce((previous, current, i) => {
    previous[current] = { id: current, order: offset + i };
    return previous;
  },
  columnProperties);
}

/** Gets the column properties object from a react component (rowProperties) that contains child component(s) for columnProperties.
 *    If no properties are found, it will work return a column properties object based on the all columns array
 * @param {Object} rowProperties - An React component that contains the rowProperties and child columnProperties components
 * @param {Array<string> optional} allColumns - An optional array of colummn names. This will be used to generate the columnProperties when they are not defined in rowProperties
 */
export function getColumnProperties(rowProperties, allColumns=[]) {
  const children = rowProperties && rowProperties.props && rowProperties.props.children;
  const columnProperties = {};

  // Working against an array of columnProperties
  if (Array.isArray(children)) {
    // build one object that contains all of the column properties keyed by id
    children.reduce((previous, current, i) => {
      if (current) {
        previous[current.props.id] = {order: offset + i, ...current.props};
      }
      return previous;
    }, columnProperties);

  // Working against a lone, columnProperties object
  } else if (children && children.props) {
    columnProperties[children.props.id] = { order: offset, ...children.props };
  }

  if(Object.keys(columnProperties).length === 0 && allColumns) {
    getColumnPropertiesFromColumnArray(columnProperties, allColumns);
  }

  return columnProperties; 
}
