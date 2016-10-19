import {
  GRIDDLE_NEXT_PAGE,
  GRIDDLE_PREVIOUS_PAGE,
  GRIDDLE_SET_PAGE,
  GRIDDLE_SET_FILTER
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