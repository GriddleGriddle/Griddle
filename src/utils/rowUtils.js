/** Gets a row properties object from a rowProperties component
 * @param {Object} rowPropertiesComponent - A react component that contains rowProperties as props
*/
export function getRowProperties(rowPropertiesComponent) {
    if (!rowPropertiesComponent) return null;

    let rowProps = Object.assign({}, rowPropertiesComponent.props);
    delete rowProps.children;

    if (!rowProps.hasOwnProperty('childColumnName')) {
      rowProps.childColumnName = 'children';
    }

    return rowProps;
}
