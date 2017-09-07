import Immutable from 'immutable';

//From Immutable docs - https://github.com/facebook/immutable-js/wiki/Predicates
function keyInArray(keys) {
  var keySet = Immutable.Set(keys);
  return function (v, k) {

    return keySet.has(k);
  }
}

export function getIncrementer(startIndex) {
  let key = startIndex;
  return () => key++;
}

function isImmutableConvertibleValue(value) {
  return typeof value !== 'object' || value === null || value instanceof Date;
}

// From https://github.com/facebook/immutable-js/wiki/Converting-from-JS-objects#custom-conversion
function fromJSGreedy(js) {
  return isImmutableConvertibleValue(js) ? js :
    Array.isArray(js) ?
      Immutable.Seq(js).map(fromJSGreedy).toList() :
      Immutable.Seq(js).map(fromJSGreedy).toMap();
}

export function transformData(data, renderProperties) {
  const hasCustomRowId = renderProperties.rowProperties && renderProperties.rowProperties.rowKey;

  // Validate that the first item in our data has the custom Griddle key
  if (hasCustomRowId && data.length > 0 && !data[0].hasOwnProperty(renderProperties.rowProperties.rowKey)) {
    throw new Error(`Griddle: Property '${renderProperties.rowProperties.rowKey}' doesn't exist in row data. Please specify a rowKey that exists in <RowDefinition>`);
  }

  const list = [];
  const lookup = {};

  data.forEach((rowData, index) => {
    const map = fromJSGreedy(rowData);

    // if this has a row key use that -- otherwise use Griddle key
    const key = hasCustomRowId ? rowData[renderProperties.rowProperties.rowKey] : index;

    // if our map object already has griddleKey use that -- otherwise add key as griddleKey
    const keyedData = map.has('griddleKey') ? map : map.set('griddleKey', key);

    list.push(keyedData);
    lookup[key] = index;
  });

  return {
    data: new Immutable.List(list),
    lookup: new Immutable.Map(lookup),
  };
}

/** Gets the visible data based on columns
 *  @param (List<Map>) data - data collection
 *  @param (array<string>) columns - list of columns to display
 *
 *  TODO: Needs tests
 */
export function getVisibleDataForColumns(data, columns) {
  if (data.size < 1) {
    return data;
  }

  const dataColumns = data.get(0).keySeq().toArray();

  const metadataColumns = dataColumns.filter(item => columns.indexOf(item) < 0);

  //if columns are specified but aren't in the data
  //make it up (as null). We will append this column
  //to the resultant data
  const magicColumns = columns
    .filter(item => dataColumns.indexOf(item) < 0)
    .reduce((original, item) => { original[item] = null; return original}, {})
  //combine the metadata and the "magic" columns
  const extra = data.map((d, i) => new Immutable.Map(
    Object.assign(magicColumns)
  ));

  const result = data.map(d => d.filter(keyInArray(columns)));

  return result.mergeDeep(extra)
    .map(item => item.sortBy((val, key) => columns.indexOf(key) > -1 ? columns.indexOf(key) :  MAX_SAFE_INTEGER ));
}

/* TODO: Add documentation and tests for this whole section!*/

/** Does this initial state object have column properties?
 * @param (object) stateObject - a non-immutable state object for initialization
 *
 * TODO: Needs tests
 */
export function hasColumnProperties(stateObject) {
  return stateObject.hasOwnProperty('renderProperties') &&
    stateObject.renderProperties.hasOwnProperty('columnProperties') &&
    Object.keys(stateObject.renderProperties.columnProperties).length > 0
}

/** Does this initial state object have data?
 * @param (object) stateObject - a non-immutable state object for initialization
 */
export function hasData(stateObject) {
  return !!stateObject.data && stateObject.data.length > 0;
}

/** Gets a new state object (not immutable) that has columnProperties if none exist
 * @param (object) stateObject - a non-immutable state object for initialization
 *
 * TODO: Needs tests
 */
export function addColumnPropertiesWhenNoneExist(stateObject) {
  if(!hasData(stateObject) || hasColumnProperties(stateObject)) {
    return stateObject;
  }

  return {
    ...stateObject,
    renderProperties: {
      columnProperties: Object.keys(stateObject.data[0]).reduce(((previous, current) => {
        previous[current] = { id: current, visible: true }

        return previous;
      }), {})
    }
  };
}
