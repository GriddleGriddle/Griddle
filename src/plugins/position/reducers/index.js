import { setCurrentPosition, updatePositionProperties } from '../utils';

const updateRenderedData(state) {

}

const sortDataByColumns(state) {

}


export function XY_POSITION_CHANGED(state, action) {
  const height = state.getIn(['positionSettings', 'height']) || 0;
  const width = state.getIn(['positionSettings', 'width']) || 0;

  const updatedState = state
    .setIn(['positionSettings', 'xScrollPosition'], action.xScrollPosition || 0)
    .setIn(['positionSettings', 'yScrollPosition'], action.yScrollPosition || 0)
    .setIn(['positionSettings', 'height'], action.height || height)
    .setIn(['positionSettings', 'width'], action.width || width);

  return updateRenderedData(updatedState);
}


export function GRIDDLE_INITIALIZED_AFTER(state, action) {
  const columnProperties = state.getIn(['renderProperties', 'columnProperties']);

  //TODO: Clean this up and make this happen in core instead of here
  const sorted =  sortDataByColumns(updated)
                  .setIn(['pageProperties', 'currentPage'], 1);

  return updateRenderedData(sorted);
}

export function GRIDDLE_LOADED_DATA_AFTER(state, action, helpers) {
  const updated = updatePositionProperties(action, state);
  const sorted = sortDataByColumns(updated);

  return updateRenderedData(sorted);
}
export function GRIDDLE_GET_PAGE_AFTER(state, action, helpers) {
  const updated = updatePositionProperties(action, state);
  return updateRenderedData(updated);
}

export function GRIDDLE_NEXT_PAGE_AFTER(state, action, helpers) {
  return updateRenderedData(state);
}

export function GRIDDLE_PREVIOUS_PAGE_AFTER(state, action, helpers) {
  return updateRenderedData(state);
}

export function GRIDDLE_SET_FILTER_AFTER(state, action, helpers) {
  const updated = setCurrentPosition(state, 0, 0);
  return updateRenderedData(updated);
}

export function GRIDDLE_SET_SORT_AFTER(state, action, helpers) {
  return updateRenderedData(state);
}

export function GRIDDLE_TOGGLE_COLUMN_AFTER(state, action, helpers) {
  return updateRenderedData(state);
}
