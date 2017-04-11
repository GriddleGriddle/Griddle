import { GRIDDLE_ROW_MOUSE_ENTER, GRIDDLE_ROW_MOUSE_LEAVE } from './constants';

export const rowMouseEnter = griddleKey => ({type: GRIDDLE_ROW_MOUSE_ENTER, griddleKey});

export const rowMouseLeave = () => ({type: GRIDDLE_ROW_MOUSE_LEAVE});
