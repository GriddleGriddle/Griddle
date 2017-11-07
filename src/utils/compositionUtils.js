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

export function combineHandlers(functionArray) {
  return (...args) => {
    functionArray.forEach(func => !!func && func(...args));
  }
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

/** Removes a given string from any key on the object that contains that string
 * @param {Object} reducer object - the reducer object to update keys on
 * @param {string} keyString - the string to remove from all keys
*/
export function removeKeyNamePartFromObject(reducerObject, keyString) {
  return Object.keys(reducerObject).reduce((previous, current) => {
    previous[current.replace(keyString, '')] = reducerObject[current]
    return previous;
  }, {});
}

/** Gets an object that consists of only the _BEFORE hooks. _BEFORE will be removed from the key.
 * @param {Object} reducerObject - the reducer to get the _BEFORE hooks from
 */
export function getBeforeHooksFromObject(reducerObject) {
  return removeKeyNamePartFromObject(
    _.pickBy(reducerObject, (value, key) => key.endsWith('BEFORE')), '_BEFORE');
}

/** Gets an object that consists of only the BEFORE_REDUCE hooks.
 * @param {Object} reducerObject - the reducer to get the BEFORE_REDUCE hooks from
 */
export function getBeforeReduceHooksFromObject(reducerObject) {
  return _.pickBy(reducerObject, (value, key) => key === 'BEFORE_REDUCE')
}


/** Gets an object that conists of only the _AFTER hooks. _AFTER will be removed from the key
 * @param {Object} reducerObject - the reducer to get the _AFTER hooks from
 */
export function getAfterHooksFromObject(reducerObject) {
  return removeKeyNamePartFromObject(
    _.pickBy(reducerObject, (value, key) => key.endsWith('AFTER')), '_AFTER');
}

/** Gets an object that conists of only the AFTER_REDUCE hooks.
 * @param {Object} reducerObject - the reducer to get the AFTER_REDUCE hooks from
 */
export function getAfterReduceHooksFromObject(reducerObject) {
  return _.pickBy(reducerObject, (value, key) => key === 'AFTER_REDUCE');
}

/** Combines the given reducer objects left to right
 * @param {Object <array>} reducerObjects - An array containing objects consisting of reducer methods as properties
 */
export function composeReducerObjects(reducerObjects) {
  if (reducerObjects.length < 1) return null;

  return reducerObjects.reverse().reduce((previous, next) => {
    // if we don't have any reducers in previous object continue with next
    if(previous === null) { return next; }

    //mutate the previous object by composing the reducer methods
    for(let key in next) {
      previous[key] = composeReducer(next[key], previous[key]);
    }

    return previous;
  }, null);
}

/** Builds a new reducer that composes hooks and extends standard reducers between reducerObjects
 * @param {Object <array>} reducers - An array of reducerObjects
 * TODO: This method should be broken down a bit -- it's doing too much currently
 */
export function buildGriddleReducerObject(reducerObjects) {
  let reducerMethodsWithoutHooks = [];
  let beforeHooks = [];
  let afterHooks = [];

  let beforeReduceAll = [];
  let afterReduceAll = [];


  if (reducerObjects.length > 0) {
    // remove the hooks and extend the object
    for(const key in reducerObjects) {
      const reducer = reducerObjects[key];
      reducerMethodsWithoutHooks.push(removeHooksFromObject(reducer));
      beforeHooks.push(getBeforeHooksFromObject(reducer));
      afterHooks.push(getAfterHooksFromObject(reducer));
      beforeReduceAll.push(getBeforeReduceHooksFromObject(reducer));
      afterReduceAll.push(getAfterReduceHooksFromObject(reducer));
    }
  }

  const composedBeforeHooks = composeReducerObjects(beforeHooks);
  const composedAfterHooks = composeReducerObjects(afterHooks);

  const composedBeforeReduceAll = composeReducerObjects(beforeReduceAll);
  const composedAfterReduceAll = composeReducerObjects(afterReduceAll);

  // combine the reducers without hooks
  const combinedReducer = extendArray(reducerMethodsWithoutHooks);

  const composed = composeReducerObjects([
    composedBeforeReduceAll,
    composedBeforeHooks,
    combinedReducer,
    composedAfterHooks,
    composedAfterReduceAll
  ]);

  return composed;
}

/** Builds a composed method containing the before / after reduce calls
 * @param {Object} reduceObject - The reducer that contains the composed reducer methods
 * @param {Object} state - The store state
 * @param {object} action - The action payload information
*/
export function callReducerWithBeforeAfterPipe(reducerObject, state, action) {
  const noop = passThroughState => passThroughState;
  const before = reducerObject.hasOwnProperty('BEFORE_REDUCE') ? reducerObject.BEFORE_REDUCE : noop;
  const after = reducerObject.hasOwnProperty('AFTER_REDUCE') ? reducerObject.AFTER_REDUCE : noop;

  const call = (action.type &&
        reducerObject[action.type] &&
        reducerObject[action.type]
      ) || reducerObject.GRIDDLE_INITIALIZED;

  const partialCall = (partialAction => partialState => call(partialState, partialAction))(action);

  const method = _.flow([before, partialCall, after]);

  return method(state);
}

/** Builds a griddleReducer function from a series of reducerObjects
 * @param {Object <array>} reducers - An array of reducerObjects
*/
export function buildGriddleReducer(reducerObjects) {
  const reducerObject = buildGriddleReducerObject(reducerObjects);
  return (state, action) => callReducerWithBeforeAfterPipe(reducerObject, state, action);
}

/** Gets all reducers by a specific wordEnding
 * @param {array <Object>} reducers - An array of reducer objects
 * @param {string} ending - the wordEnding for the reducer name
 */
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

/** Wraps all methods in another method by name and word ending
  * @param {array<Object>} componentObjectArray - An array of component objects
  * @param {string} ending - the word ending to determine what is a enhancer method
  * @param {string} keyReplaceString - the word ending to apply when replacing the 'ending' parameter. Defaults to ''
*/
export function wrapMethodsByWordEnding(componentArray, wordEnding, keyReplaceString = '') {
  return componentArray.reduce((previous, current) => {
    let newObject = {},
      mergedObject = previous;

    for(var key in current) {
      const keyWithoutEnhancer = key.replace(wordEnding, keyReplaceString);

      if(key.endsWith(wordEnding) && (previous.hasOwnProperty(keyWithoutEnhancer) || current.hasOwnProperty(keyWithoutEnhancer))) {
        // Determine if we are working with an HoC that wraps another HoC
        if(keyWithoutEnhancer.endsWith('Container') || keyWithoutEnhancer.endsWith('Enhancer')) {
          // If we are enhancing a container or enhancer flow this stuff since it's likely an HoC
          newObject[keyWithoutEnhancer] = _.flowRight(current[key], (current[keyWithoutEnhancer] || previous[keyWithoutEnhancer]));
        } else {
          // Wrap the current component in the Enhancer or container
          if(Array.isArray(current[key])) {
            newObject[keyWithoutEnhancer] = current[key].reduce((previousComponent, currentComponent) => {
                if(previousComponent !== undefined) {
                  return currentComponent(previousComponent);
                } else {
                  return currentComponent(current[keyWithoutEnhancer]);
                }
            }, undefined);
          } else {
            newObject[keyWithoutEnhancer] = current[key](current[keyWithoutEnhancer] || previous[keyWithoutEnhancer])
          }
          
        }
      }
      if(mergedObject[key] === undefined) {
        mergedObject[key] = current[key];
      } else {
        if(key.endsWith('Enhancer')) {
          if(Array.isArray(mergedObject[key])) {
            mergedObject[key].push(current[key]);
          }else {
            mergedObject[key] = [mergedObject[key], current[key]];
          }
        } else {
          mergedObject[key] = current[key];
        }
      }
    }

    return _.pickBy(Object.assign(mergedObject, newObject), (v, k) => (!k.endsWith(wordEnding))) ;
  }, {})
}

/** Gets a new components object with component per component name
 * @param {array<Object>} componentObjectArray - An array of component objects
*/
export function combineAndEnhanceComponents (componentArray) {
  return wrapMethodsByWordEnding(componentArray, 'Enhancer');
}

export function combineAndEnhanceContainers (componentArray) {
  return wrapMethodsByWordEnding(componentArray, 'ContainerEnhancer', 'Container');
}

/** Gets a new component object with containers wrapping standard components
  (this is the same as enhance but just applying different naming conventions)
 * @param {array<Object>} componentObjectArray - An array of component objects
*/
export function combineAndWrapWithContainerComponents(componentArray) {
  return wrapMethodsByWordEnding(componentArray, 'Container');
}

/** Wraps components in their containers and enhancers
 * @param {array<Object>} componentObjectArray - An array of component objects
*/
export function buildGriddleComponents(componentArray) {
  //enhance the containers
  const withEnhancedContainers = combineAndEnhanceContainers(componentArray);

  //enhance the components
  const withEnhancedComponents = combineAndEnhanceComponents([withEnhancedContainers]);

  //wrap the components with the container
  const withWrappedComponents = combineAndWrapWithContainerComponents([withEnhancedComponents])

  return withWrappedComponents;
}
