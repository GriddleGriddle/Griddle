const types = {
  GRIDDLE_NEXT_PAGE: 'GRIDDLE_NEXT_PAGE',
  GRIDDLE_PREVIOUS_PAGE: 'GRIDDLE_PREVIOUS_PAGE',
}

const GRIDDLE_NEXT_PAGE = types.GRIDDLE_NEXT_PAGE;
const GRIDDLE_PREVIOUS_PAGE = types.GRIDDLE_PREVIOUS_PAGE;

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