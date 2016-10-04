function containsColumnPropertiesArray(rowProperties) {
  return (rowProperties &&
    rowProperties.props &&
    rowProperties.props.children &&
    Array.isArray(rowProperties.props.children));
}

function containsColumnPropertiesObject(rowProperties) {
  return rowProperties && rowProperties.props && rowProperties.props.children;
}

/** Gets a column properties object from an array of columnNames
 * @param {Array<string>} columns - array of column names
 */
export function getColumnPropertiesFromColumnArray(columns) {
  return columns.reduce((previous, current) => {
    previous[current] = {id: current};
    return previous;
  },
  {});
}

/** Gets the column properties object from a react component (rowProperties) that contains child component(s) for columnProperties.
 *    If no properties are found, it will work return a column properties object based on the all columns array
 * @param {Object} rowProperties - An React component that contains the rowProperties and child columnProperties components
 * @param {Array<string> optional} allColumns - An optional array of colummn names. This will be used to generate the columnProperties when they are not defined in rowProperties
 */
export function getColumnProperties(rowProperties, allColumns=[]) {
  let columnProperties = {};
  // Working against an array of columnProperties
  if (containsColumnPropertiesArray(rowProperties)) {
    // build one object that contains all of the column properties keyed by id
    columnProperties = rowProperties.props.children.reduce((previous, current) => {
      previous[current.props.id] = current.props;
      return previous;
    }, {});

  // Working against a lone, columnProperties object
  } else if (containsColumnPropertiesObject(rowProperties)) {
    columnProperties[rowProperties.props.children.props.id] = rowProperties.props.children.props;
  }

  if(Object.keys(columnProperties).length === 0 && allColumns) {
    columnProperties = getColumnPropertiesFromColumnArray(allColumns);
  }

  return columnProperties; 
}