import _ from 'lodash';

/** Extends an array rather than known list of objects */
//TODO: Look at using object.assign
export function extendArray(objects) {
  //return an empty object if we don't have anything to combine
  if(!objects) { return {}; }

  //add empty object to the beginning for Object.extend
  objects.unshift({});

  //Buid the combined object
  let combinedObject = _.extend.apply(this, objects);

  //TODO: why are we doing this? is it necessary
  objects.shift();

  //return the combined object
  return combinedObject;
}

//from MDN
if (!String.prototype.endsWith) {
  String.prototype.endsWith = function(searchString, position) {
      var subjectString = this.toString();
      if (typeof position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
        position = subjectString.length;
      }
      position -= searchString.length;
      var lastIndex = subjectString.indexOf(searchString, position);
      return lastIndex !== -1 && lastIndex === position;
  };
}

/**
 * Finds properties on an object that end in specified word
 * @param {string} ending - The string that properties should be found ending with
 * @param {Object} object - The object to find keys on
 */
export function getPropertiesByEnding(ending, object) {
  return Object.keys(object).filter((name) => name.endsWith(ending));
}

/** Creates a new object containing only properties that end with specified ending
 * @param {string} ending - The string that properties should be found ending with
 * @param {Object} object - The object to find keys on
 */
export function getObjectWherePropertyEndsWith(ending, object) {
  const keys = getPropertiesByEnding(ending, object);

  return _.pick(object, keys);
}

/** Creates a new reducer by taking the output of the first reducer as state to the second
 * @param {Object} currentReducer - reducerMethod (state, action) to that we want to run as the state parameter for second reducer
 * @param {Object} previousReducer - reducerMethod (state, action) to run second
 */
export function composeReducer(nextReducer, previousReducer) {
  // compose the reducers when both parameters are functions
  if(typeof(nextReducer) === 'function' && typeof(previousReducer) === 'function') {
    return (state, action) => previousReducer(nextReducer(state, action), action);
  }

  // return the nextReducer
  return nextReducer;
}

/** Creates a composed reducer method from an array of reducer methods
 * @param {Object <array>} reducers - An array of reducer methods to compose
 */
export function composeReducers(reducers) {
  // flip the array (since we want to apply from left-to-right and compose each reducer
  return reducers.reverse().reduce((previous, next) =>
    composeReducer(next, previous), {});
}

/** Obtains all the unique keys between an array of objects
 * @param {Object <array>} objects - An array of objects
 */
export function getKeysForObjects(objects) {
  return _.uniq(_.flattenDeep(objects.map(o => Object.keys(o))));
}

/** Determines if a given key is a Griddle hook reducer 
 * @param {string} key - the key to check if it refers to a Griddle hook
 */
export function isKeyGriddleHook(key) {
  return (key === 'BEFORE_REDUCE' || key === 'AFTER_REDUCE' ||
    key.endsWith('AFTER') || key.endsWith('BEFORE'))
}

/** Removes Griddle hooks from a reducer object
 * @param {Object} reducerObject - The reducer object to remove hooks from
 */
export function removeHooksFromObject(reducerObject) {
  return _.pickBy(reducerObject, (value, key) => {
    if (isKeyGriddleHook(key)) {
      return false;
    }

    return true;
  });
}

/** Combines the given reducer objects
 * @param {Object <array>} reducerObjects - An array containing objects consisting of reducer methods as properties
 */
export function composeReducerObjects(reducerObjects) {
  return reducerObjects.reduce((previous, next) => {
    // if we don't have any reducers in previous object continue with next
    if(previous === null) { return next; }

    //mutate the previous object by composing the reducer methods
    for(let key in next) {
      previous[key] = composeReducer(next[key], previous[key]);
    }

    return previous;
  }, null);
}

/** Creates a composed reducer with BEFORE / AFTER hooks
 * @param {Object <array>} reducers - An array of reducers to compose
 */
export function composeReducersAndAddHooks(reducers) {
  return composeReducers(reducers);
}

export function getReducersByWordEnding(reducers, ending) {
  return reducers.reduce((previous, current) => {
    const keys = Object.keys(current).filter((name) => name.endsWith(ending));

    let reducer = pick(current, keys);

    //TODO: clean this up it's a bit hacky
    for (var key in current) {
      if(!key.endsWith(ending)) { continue; }

      const keyWithoutEnding = key.replace(`_${ending}`, "");
      //make a new method that pipes output of previous into state of current
      //this is to allow chaining these
      const hasPrevious =  previous.hasOwnProperty(keyWithoutEnding) && typeof previous[keyWithoutEnding] === 'function';
      const previousReducer = hasPrevious ?
        previous[keyWithoutEnding] :
        undefined;

      const currentReducer = reducer[key]

      reducer[keyWithoutEnding] = wrapReducer(currentReducer, previousReducer);
    }

    //override anything in previous (since this now calls previous to make sure we have helpers from both);
    return extend(previous, reducer);
  }, {});
}
