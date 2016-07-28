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
