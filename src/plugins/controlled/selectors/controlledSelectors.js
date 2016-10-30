import Immutable from 'immutable';

/** Gets the current page from pageProperties
 * @param {Immutable} state - state object
 */
export const maxPageSelector = state => state.getIn(['pageProperties', 'maxPage']);
