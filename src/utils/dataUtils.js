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

export function transformDataToList(data, settings={}) {
  const defaultSettings = { name: 'griddleKey', startIndex: 0, addGriddleKey: true };
  const localSettings = Object.assign({}, defaultSettings, settings);

  const getKey = getIncrementer(localSettings.startIndex);

  return new Immutable.List(data.map(row => {
    const map = Immutable.fromJS(row);
    return localSettings.addGriddleKey ? map.set(localSettings.name, getKey()) : map;
  }));
}

/** adds griddleKey to given collection
 * @param (List<Map>) data - data collection to work against
 * @param (object) settings - settings object -- default {}
 */
export function addKeyToCollection(data, settings={}) {
  const defaultSettings = { name: 'griddleKey', startIndex: 0 };
  const localSettings = Object.assign({}, defaultSettings, settings);

  let key = localSettings.startIndex;
  const getKey = (() => key++);

  return data.map(row => row.set(localSettings.name, getKey()));
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
 *
 * TODO: Needs tests
 */
export function hasData(stateObject) {
  return stateObject.hasOwnProperty('data') && stateObject.data.length > 0;
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


