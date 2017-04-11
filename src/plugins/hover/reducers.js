export const GRIDDLE_ROW_MOUSE_ENTER = (state, {griddleKey}) =>
    state.set('hoveredRowKey', griddleKey);

export const GRIDDLE_ROW_MOUSE_LEAVE = (state, action) =>
    state.delete('hoveredRowKey');
