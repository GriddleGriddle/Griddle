import {
  GRIDDLE_NEXT_PAGE,
  GRIDDLE_PREVIOUS_PAGE,
  GRIDDLE_SET_PAGE,
  GRIDDLE_SET_SORT,
  GRIDDLE_SET_FILTER,
  GRIDDLE_TOGGLE_SETTINGS,
  GRIDDLE_TOGGLE_COLUMN,
  GRIDDLE_SET_PAGE_SIZE,
  GRIDDLE_UPDATE_STATE,
} from '../constants';

export function getNext() {
  return {
    type: GRIDDLE_NEXT_PAGE
  }
}

export function getPrevious() {
  return {
    type: GRIDDLE_PREVIOUS_PAGE
  }
}

export function setPage(pageNumber) {
  return {
    type: GRIDDLE_SET_PAGE,
    pageNumber
  };
}

export function setFilter(filter) {
  return {
    type: GRIDDLE_SET_FILTER,
    filter
  }
}

export function setSortColumn(sortProperties) {
  return {
    type: GRIDDLE_SET_SORT,
    sortProperties
  }
}

export function toggleSettings() {
  return {
    type: GRIDDLE_TOGGLE_SETTINGS
  }
}

export function toggleColumn(columnId) {
  return {
    type: GRIDDLE_TOGGLE_COLUMN,
    columnId
  }
}

export function setPageSize(pageSize) {
  return {
    type: GRIDDLE_SET_PAGE_SIZE,
    pageSize
  }
}

export function updateState(newState) {
  return {
    type: GRIDDLE_UPDATE_STATE,
    newState
  }
}
